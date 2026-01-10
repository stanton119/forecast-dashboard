import { useEffect, useRef, useState } from 'react'
import { fetchBBCForecast } from '../lib/bbc-client.js'
import { getInsideRelativeHumidity } from '../lib/humidity.js'

function loadPlotly() {
  return new Promise((resolve, reject) => {
    if (window.Plotly) return resolve(window.Plotly)
    const s = document.createElement('script')
    s.src = 'https://cdn.plot.ly/plotly-latest.min.js'
    s.onload = () => resolve(window.Plotly)
    s.onerror = reject
    document.head.appendChild(s)
  })
}

export default function ForecastChart() {
  const divRef = useRef(null)
  const [loading, setLoading] = useState(true)

  async function renderFor(params) {
    setLoading(true)
    try {
      const postcode = params?.postcode || new URLSearchParams(window.location.search).get('postcode') || 'SW7'
      const indoor = params?.indoor_temperature_c ?? Number(new URLSearchParams(window.location.search).get('indoor_temperature_c')) || 20

      const data = await fetchBBCForecast(postcode)
      const processed = data.map((row) => ({
        x: row.timestamp_iso,
        outside_humidity: row.outside_humidity_percent,
        outside_temp: row.outside_temp_c,
        inside_humidity: getInsideRelativeHumidity(row.outside_temp_c, row.outside_humidity_percent, indoor)
      }))

      const x = processed.map((r) => r.x)
      const outHum = processed.map((r) => r.outside_humidity)
      const inHum = processed.map((r) => r.inside_humidity)

      const Plotly = await loadPlotly()
      const traces = [
        { x, y: outHum, name: 'Outdoor humidity', type: 'scatter', mode: 'lines' },
        { x, y: inHum, name: 'Indoor relative humidity', type: 'scatter', mode: 'lines' }
      ]
      const layout = { title: `Humidity forecast for ${postcode}`, xaxis: { type: 'date' } }
      Plotly.newPlot(divRef.current, traces, layout)
    } catch (err) {
      divRef.current.innerText = 'Failed to load forecast.'
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const handler = (e) => renderFor(e.detail)
    window.addEventListener('paramsChange', handler)
    // initial render
    renderFor()
    return () => window.removeEventListener('paramsChange', handler)
  }, [])

  return (
    <div>
      {loading && <div>Loading forecast…</div>}
      <div id="plotDiv" ref={divRef} style={{ width: '100%', height: '600px' }} />
    </div>
  )
}
