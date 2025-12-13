type TimezoneResult = {
  countryCode: string | null
  timezone: string
}

const argentinaAreas: Record<string, string> = {
  '11': 'America/Argentina/Buenos_Aires',
  '261': 'America/Argentina/Mendoza',
  '351': 'America/Argentina/Cordoba',
  '341': 'America/Argentina/Rosario',
  '381': 'America/Argentina/Tucuman',
  '299': 'America/Argentina/Neuquen',
  '264': 'America/Argentina/San_Juan'
}

const venezuelaAreas: Record<string, string> = {
  '212': 'America/Caracas',
  '412': 'America/Caracas',
  '414': 'America/Caracas',
  '416': 'America/Caracas',
  '426': 'America/Caracas'
}

const usaAreas: Record<string, string> = {
  '212': 'America/New_York',
  '213': 'America/Los_Angeles',
  '305': 'America/New_York',
  '312': 'America/Chicago',
  '415': 'America/Los_Angeles',
  '702': 'America/Los_Angeles',
  '808': 'Pacific/Honolulu'
}

const defaultTzMap: Record<string, string> = {
  '54': 'America/Argentina/Buenos_Aires',
  '591': 'America/La_Paz',
  '55': 'America/Sao_Paulo',
  '56': 'America/Santiago',
  '57': 'America/Bogota',
  '506': 'America/Costa_Rica',
  '53': 'America/Havana',
  '1809': 'America/Santo_Domingo',
  '1829': 'America/Santo_Domingo',
  '1849': 'America/Santo_Domingo',
  '787': 'America/Puerto_Rico',
  '1787': 'America/Puerto_Rico',
  '1939': 'America/Puerto_Rico',
  '593': 'America/Guayaquil',
  '503': 'America/El_Salvador',
  '594': 'America/Cayenne',
  '502': 'America/Guatemala',
  '592': 'America/Guyana',
  '509': 'America/Port-au-Prince',
  '504': 'America/Tegucigalpa',
  '52': 'America/Mexico_City',
  '505': 'America/Managua',
  '507': 'America/Panama',
  '595': 'America/Asuncion',
  '51': 'America/Lima',
  '597': 'America/Paramaribo',
  '598': 'America/Montevideo',
  '58': 'America/Caracas',
  '1': 'America/New_York'
}

const DEFAULT_TIMEZONE = 'America/Argentina/Buenos_Aires'

export function getTimezoneFromPhone(phone: string): TimezoneResult {
  // Limpiar el número (quitar @s.whatsapp.net si viene)
  const number = phone.split('@')[0].replace(/\D/g, '')

  // Ordenar códigos de país por longitud (más largo primero)
  const countryCodes = Object.keys(defaultTzMap).sort((a, b) => b.length - a.length)

  for (const cc of countryCodes) {
    if (number.startsWith(cc)) {
      const rest = number.slice(cc.length)
      let timezone = defaultTzMap[cc]

      // Refinamiento por país
      if (cc === '54') {
        // Argentina: formato 54 + 9 + código de área
        const candidate = (rest.startsWith('9') ? rest.slice(1) : rest).slice(0, 3)
        timezone = argentinaAreas[candidate] || argentinaAreas[candidate.slice(0, 2)] || timezone
      } else if (cc === '58') {
        const candidate = rest.slice(0, 3)
        timezone = venezuelaAreas[candidate] || timezone
      } else if (cc === '1') {
        const candidate = rest.slice(0, 3)
        timezone = usaAreas[candidate] || timezone
      }

      return { countryCode: cc, timezone }
    }
  }

  return { countryCode: null, timezone: DEFAULT_TIMEZONE }
}