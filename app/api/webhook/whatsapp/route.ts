import { NextRequest, NextResponse } from 'next/server'
import { WhatsAppClient } from '@kapso/whatsapp-cloud-api';
import { prisma } from '@/lib/db'
import { processMessage } from '@/lib/ai'
import { getTimezoneFromPhone } from '@/lib/timezone'

const WspClient = new WhatsAppClient({
  baseUrl: 'https://api.kapso.ai/meta/whatsapp',
  kapsoApiKey: process.env.KAPSO_API_KEY!
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    console.log('BODY__', body)

    const messageBody = body?.message
    
    const phone = messageBody.from
    const message = messageBody?.text?.body
    const pushName = body?.pushName || 'Usuario'

    if (!phone || !message) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }

    // 1. Buscar o crear usuario
    let user = await prisma.user.findUnique({
      where: { phone }
    })

    if (!user) {
      const { timezone } = getTimezoneFromPhone(phone)
      user = await prisma.user.create({
        data: { phone, name: pushName, timezone }
      })
    }

    // 2. Guardar mensaje del usuario
    await prisma.message.create({
      data: { userId: user.id, role: 'user', content: message }
    })

    // 3. Procesar con LLM
    const responseText = await processMessage({
      userId: user.id,
      userMessage: message,
      userName: user.name || 'Usuario',
      userTimezone: user.timezone,
      userPhone: user.phone
    })

    console.log('LLM Response:', responseText)

    // 4. Guardar respuesta (solo si hay respuesta)
    if (responseText && responseText.trim() !== '') {
      await prisma.message.create({
        data: { userId: user.id, role: 'assistant', content: responseText }
      })
    }

    // 5. Enviar respuesta por Kapso
    const phoneNumberId = process.env.KAPSO_PHONE_NUMBER_ID

    if (!phoneNumberId) {
      console.warn('KAPSO_PHONE_NUMBER_ID not configured, skipping WhatsApp send')
    } else if (responseText && responseText.trim() !== '') {
      try {
        await WspClient.messages.sendText({
          phoneNumberId,
          to: phone, // Enviar al usuario que escribió
          body: responseText
        })
        console.log(`Message sent to ${phone}:`, responseText)
      } catch (error) {
        console.error('Error sending WhatsApp message:', error)
        // No lanzar error, continuar con la respuesta HTTP
      }
    } else {
      console.log('No text response to send (tool call only)')
    }

    return NextResponse.json({ success: true, response: responseText })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}