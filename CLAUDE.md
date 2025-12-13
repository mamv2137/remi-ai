# Proyecto: Remi - Bot de recordatorios por WhatsApp

## Descripción

Bot conversacional que permite crear y gestionar recordatorios vía WhatsApp. El usuario escribe algo como "Remi recuérdame mañana a las 10 comprar comida de perro" y el bot lo agenda.

## Stack

- NextJS 14 (App Router)
- Prisma + Neon (Postgres serverless)
- Vercel AI SDK + Gemini 2.0 Flash
- Kapso SDK (WhatsApp) - pendiente integrar
- reminders-api.com (scheduling webhooks) - pendiente integrar

## Estructura actual

```
src/
├── app/api/
│   ├── webhook/whatsapp/route.ts  ← Recibe mensajes de Kapso
│   └── callback/reminder/route.ts ← Recibe webhook cuando dispara reminder
├── lib/
│   ├── db.ts                      ← Cliente Prisma para serverless
│   ├── ai/
│   │   ├── index.ts               ← processMessage() con tools
│   │   └── prompt.ts              ← System prompt de Remi
│   └── utils/
│       └── timezone.ts            ← Detecta timezone por código de país
prisma/
└── schema.prisma                  ← User, Reminder, Message
```

## Modelos de DB

- **User**: phone, name, timezone
- **Reminder**: title, dateTz, timeTz, timezone, notifyInAdvance, rrule, messagePreview, status, externalId
- **Message**: userId, role, content (historial conversacional)

## Flujo

1. Usuario envía mensaje a WhatsApp
2. Kapso hace POST a /api/webhook/whatsapp
3. Se busca/crea usuario, se detecta timezone
4. LLM procesa mensaje y decide si crear reminder (tool) o responder
5. Si crea reminder: guarda en DB → envía a reminders-api.com → guarda externalId
6. Cuando llega la hora: reminders-api hace POST a /api/callback/reminder
7. Buscamos reminder por externalId, enviamos mensaje por Kapso

## Estado actual

- ✅ Schema de Prisma creado y migrado a Neon
- ✅ Cliente Prisma configurado para serverless
- ✅ Webhook de WhatsApp (estructura base)
- ✅ Callback de reminder (estructura base)
- ✅ Función de timezone
- ✅ LLM con tools (createReminder, getReminders)
- 🔴 Error actual: Prisma no conecta a la DB (debugging en progreso)
- ⏳ Pendiente: Integrar Kapso SDK
- ⏳ Pendiente: Integrar reminders-api.com

## Problema actual

Al probar el webhook, Prisma arroja error de conexión aunque DATABASE_URL está definido. Estamos debuggeando.

## Variables de entorno necesarias

- DATABASE_URL (Neon connection string)
- GOOGLE_GENERATIVE_AI_API_KEY (Gemini)
- KAPSO_API_KEY (pendiente)
- REMINDERS_API_KEY (pendiente)
