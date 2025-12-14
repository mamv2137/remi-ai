import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log(body)
    const externalId = body.id // ID que envía reminders-api

    const reminder = await prisma.reminder.findUnique({
      where: { externalId },
      include: { user: true }
    })

    if (!reminder) {
      return NextResponse.json({ error: 'Reminder not found' }, { status: 404 })
    }

    // TODO: Enviar mensaje por Kapso
    console.log(`Enviando a ${reminder.user.phone}: ${reminder.messagePreview}`)

    // Marcar como enviado
    await prisma.reminder.update({
      where: { id: reminder.id },
      data: { 
        status: 'sent',
        sentAt: new Date()
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Callback error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}