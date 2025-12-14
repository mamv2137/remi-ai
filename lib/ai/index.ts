import { generateText } from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { systemPrompt } from './prompt'
import { createReminder as createExternalReminder } from '@/lib/reminders-api'

type ProcessMessageParams = {
  userId: string
  userMessage: string
  userName: string
  userTimezone: string
  userPhone: string
}

export async function processMessage({
  userId,
  userMessage,
  userName,
  userTimezone,
  userPhone
}: ProcessMessageParams) {
  // console.log('Processing message:', { userId, userMessage, userName, userTimezone })

  // Validar que el mensaje no esté vacío
  if (!userMessage || userMessage.trim() === '') {
    throw new Error('User message cannot be empty')
  }

  // Obtener historial reciente (excluyendo el mensaje actual que aún no se guardó)
  // Limitamos a 6 mensajes (3 intercambios usuario-asistente) para balance entre contexto y eficiencia
  const history = await prisma.message.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 6
  })

  // Construir mensajes en orden cronológico
  const messages = [
    ...history
      .reverse()
      .map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
      })),
    { role: 'user' as const, content: userMessage }
  ]

  // console.log('Messages for LLM:', JSON.stringify(messages, null, 2))
  // console.log('Total messages:', messages.length)

  // Validar que haya al menos un mensaje
  if (messages.length === 0) {
    throw new Error('No messages to process')
  }

  // Calcular fecha y hora actual en la zona horaria del usuario
  const now = new Date()
  const dateInTz = new Date(now.toLocaleString('en-US', { timeZone: userTimezone }))

  const currentDate = dateInTz.toISOString().split('T')[0] // YYYY-MM-DD
  const currentTime = dateInTz.toTimeString().slice(0, 5) // HH:mm
  const dayOfWeek = dateInTz.toLocaleDateString('es-AR', { weekday: 'long', timeZone: userTimezone })

  // console.log('Temporal context:', {
  //   currentDate,
  //   currentTime,
  //   dayOfWeek,
  //   userTimezone
  // })

  // Debug: log the prompt
  const systemPromptText = systemPrompt({ userName, userTimezone, currentDate, currentTime, dayOfWeek })

  const result = await generateText({
    model: google('gemini-2.5-flash'), // Usar modelo Gemini 2.5 Flash
    system: systemPromptText,
    messages,
    tools: {
      createReminder: {
        description: 'Crea un recordatorio para el usuario',
        inputSchema: z.object({
          title: z.string().describe('Título corto del recordatorio'),
          dateTz: z.string().describe('Fecha en formato YYYY-MM-DD'),
          timeTz: z.string().describe('Hora en formato HH:mm'),
          messagePreview: z.string().describe('Mensaje amigable para enviar cuando dispare'),
          notifyInAdvance: z.string().optional().describe('Ej: "10 minutes", "2 hours"'),
          rrule: z.string().optional().describe('Regla de recurrencia RRULE'),
          notes: z.string().optional().describe('Notas adicionales')
        }),
        execute: async (params) => {
          // console.log('Creating reminder:', params)

          // Validar formato de fecha YYYY-MM-DD
          if (!/^\d{4}-\d{2}-\d{2}$/.test(params.dateTz)) {
            throw new Error(`Formato de fecha inválido: ${params.dateTz}. Usa YYYY-MM-DD`)
          }

          // Validar formato de hora HH:mm
          if (!/^\d{2}:\d{2}$/.test(params.timeTz)) {
            throw new Error(`Formato de hora inválido: ${params.timeTz}. Usa HH:mm`)
          }

          // Validar que la fecha no sea del pasado
          const reminderDateTime = new Date(`${params.dateTz}T${params.timeTz}:00`)
          const nowInUserTz = new Date(new Date().toLocaleString('en-US', { timeZone: userTimezone }))

          if (reminderDateTime < nowInUserTz) {
            throw new Error(`La fecha ${params.dateTz} ${params.timeTz} ya pasó. Por favor especifica una fecha futura.`)
          }

          // 1. Crear reminder en nuestra DB
          const reminder = await prisma.reminder.create({
            data: {
              userId,
              title: params.title,
              dateTz: params.dateTz,
              timeTz: params.timeTz,
              timezone: userTimezone,
              notifyInAdvance: params.notifyInAdvance,
              rrule: params.rrule,
              notes: params.notes,
              messagePreview: params.messagePreview
            }
          })

          try {
            const externalReminder = await createExternalReminder({
              date_tz: params.dateTz,
              time_tz: params.timeTz,
              timezone: userTimezone,
              title: params.title,
              notify_in_advance: params.notifyInAdvance,
              rrule: params.rrule
            })

            console.log(externalReminder)

            // 3. Guardar el externalId en nuestra DB
            await prisma.reminder.update({
              where: { id: reminder.id },
              data: { externalId: externalReminder.id.toString() }
            })

            return {
              success: true,
              reminderId: reminder.id,
              scheduledFor: `${params.dateTz} ${params.timeTz}`
            }
          } catch (error) {
            console.error('Error creating external reminder:', error)
            throw error
          }
        }
      },

      getReminders: {
        description: 'Obtiene los recordatorios pendientes del usuario',
        inputSchema: z.object({
          includeCompleted: z.boolean().default(false).describe('Incluir completados')
        }),
        execute: async ({ includeCompleted }) => {
          const reminders = await prisma.reminder.findMany({
            where: {
              userId,
              status: includeCompleted ? undefined : 'pending'
            },
            orderBy: { dateTz: 'asc' },
            take: 10
          })

          return { reminders }
        }
      }
    }
  })

  console.log('LLM result:', {
    text: result.text,
    toolCalls: result.toolCalls?.length || 0,
    finishReason: result.finishReason
  })

  // Si no hay texto pero se ejecutaron tools, devolver un mensaje por defecto
  if (!result.text || result.text.trim() === '') {
    return 'Listo! Ya agendé tu recordatorio.'
  }

  return result.text
}
