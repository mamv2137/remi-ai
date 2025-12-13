import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { processMessage } from '@/lib/ai'
import { getTimezoneFromPhone } from '@/lib/timezone'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    const phone = body.from
    const message = body.text
    const pushName = body.pushName

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

    // 4. Guardar respuesta
    await prisma.message.create({
      data: { userId: user.id, role: 'assistant', content: responseText }
    })

    // 5. TODO: Enviar respuesta por Kapso

    return NextResponse.json({ success: true, response: responseText })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}