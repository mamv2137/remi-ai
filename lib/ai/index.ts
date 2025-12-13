import { generateText, tool } from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { systemPrompt } from './prompt'

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
  // Obtener historial reciente
  const history = await prisma.message.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 10
  })

  const messages = history
    .reverse()
    .map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content
    }))

  // Agregar mensaje actual
  messages.push({ role: 'user', content: userMessage })

  const currentTime = new Date().toLocaleString('es-AR', { 
    timeZone: userTimezone 
  })

  const result = await generateText({
    model: google('gemini-2.0-flash'),
    system: systemPrompt({ userName, userTimezone, currentTime }),
    messages,
    tools: {
      createReminder: tool({
        description: 'Crea un recordatorio para el usuario',
        parameters: z.object({
          title: z.string().describe('Título corto del recordatorio'),
          dateTz: z.string().describe('Fecha en formato YYYY-MM-DD'),
          timeTz: z.string().describe('Hora en formato HH:mm'),
          notifyInAdvance: z.string().optional().describe('Ej: "10 minutes", "2 hours"'),
          rrule: z.string().optional().describe('Regla de recurrencia RRULE'),
          notes: z.string().optional().describe('Notas adicionales'),
          messagePreview: z.string().describe('Mensaje amigable para enviar cuando dispare')
        }),
        execute: async (params: any) => {
          console.log(params)
          // const reminder = await prisma.reminder.create({
          //   data: {
          //     userId,
          //     title: params.title,
          //     dateTz: params.dateTz,
          //     timeTz: params.timeTz,
          //     timezone: userTimezone,
          //     notifyInAdvance: params.notifyInAdvance,
          //     rrule: params.rrule,
          //     notes: params.notes,
          //     messagePreview: params.messagePreview
          //   }
          // })

          // TODO: Crear en reminders-api.com y guardar externalId

          return { 
            success: true, 
            // reminderId: reminder.id,
            scheduledFor: `${params.dateTz} ${params.timeTz}`
          }
        }
      }),

      getReminders: tool({
        description: 'Obtiene los recordatorios pendientes del usuario',
        parameters: z.object({
          includeCompleted: z.boolean().optional().describe('Incluir completados')
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
      })
    },
    maxSteps: 3
  })

  return result.text
}