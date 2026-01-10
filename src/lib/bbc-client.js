export function pad2(n) {
  return n.toString().padStart(2, '0')
}

export function toIsoWithTimezone(localDate, timeslot) {
  // timeslot may be '14' or '14:00'
  const hour = timeslot.split(':')[0]
  const iso = `${localDate}T${pad2(hour)}:00:00+00:00`
  return iso
}

export function processReports(reports) {
  const out = []
  reports.forEach((report) => {
    const iso = toIsoWithTimezone(report.localDate, report.timeslot)
    out.push({
      timestamp_iso: iso,
      outside_humidity_percent: report.humidity,
      outside_temp_c: report.temperatureC
    })
  })
  return out
}

export function parseBBCAggregated(payload) {
  if (!payload || !payload.forecasts) return []
  let list = []
  for (const key in payload.forecasts) {
    const f = payload.forecasts[key]
    if (f && f.detailed && Array.isArray(f.detailed.reports)) {
      list = list.concat(processReports(f.detailed.reports))
    }
  }
  return list
}

export async function fetchBBCForecast(postcode) {
  const url = `https://weather-broker-cdn.api.bbci.co.uk/en/forecast/aggregated/${encodeURIComponent(postcode)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Network response was not ok')
  const data = await res.json()
  return parseBBCAggregated(data)
}

export default { parseBBCAggregated, fetchBBCForecast }
