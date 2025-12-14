const REMINDERS_API_URL = 'https://reminders-api.com/api'
const APPLICATION_ID = '1318'

type CreateReminderParams = {
  date_tz: string // YYYY-MM-DD - Date of the reminder in local timezone
  time_tz: string // HH:mm - Time of the reminder in local timezone
  timezone: string // The timezone for the reminder (e.g., "Europe/Helsinki")
  title: string // The title of the reminder
  notify_in_advance?: string // How much time in advance should the reminder fire (minutes - weeks). Examples: "10 minutes", "2 hours", "1 day", "3 weeks"
  rrule?: string // Recursion rule
  snoozed?: number // If set to 1 (true), the reminder will not fire
}

type ReminderResponse = {
  id: string
  date_tz: string
  time_tz: string
  timezone: string
  title: string
  notify_in_advance?: string
  rrule?: string
  snoozed?: number
  created_at: string
  updated_at: string
}

export async function createReminder(params: CreateReminderParams): Promise<ReminderResponse> {
  const apiKey = process.env.REMINDERS_API_KEY

  if (!apiKey) {
    throw new Error('REMINDERS_API_KEY is not set')
  }
  
  const response = await fetch(
    `${REMINDERS_API_URL}/applications/${APPLICATION_ID}/reminders/`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        date_tz: params.date_tz,
        time_tz: params.time_tz,
        timezone: params.timezone,
        title: params.title,
        notify_in_advance: params.notify_in_advance,
        rrule: params.rrule,
        snoozed: params.snoozed
      })
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to create reminder: ${response.status} - ${error}`)
  }

  return response.json()
}

export async function deleteReminder(reminderId: string): Promise<void> {
  const apiKey = process.env.REMINDERS_API_KEY

  if (!apiKey) {
    throw new Error('REMINDERS_API_KEY is not set')
  }

  const response = await fetch(
    `${REMINDERS_API_URL}/applications/${APPLICATION_ID}/reminders/${reminderId}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to delete reminder: ${response.status} - ${error}`)
  }
}
