import { useState, useEffect } from 'react'

export default function ParameterForm() {
  const [postcode, setPostcode] = useState('SW7')
  const [indoor, setIndoor] = useState(20)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const p = params.get('postcode')
    const t = params.get('indoor_temperature_c')
    if (p) setPostcode(p)
    if (t) setIndoor(Number(t))
  }, [])

  function updateUrl(p, t) {
    const params = new URLSearchParams(window.location.search)
    params.set('postcode', p)
    params.set('indoor_temperature_c', String(t))
    const newUrl = `${window.location.pathname}?${params.toString()}`
    history.pushState({}, '', newUrl)
  }

  function onSubmit(e) {
    e.preventDefault()
    const p = postcode.trim()
    const t = Number(indoor)
    updateUrl(p, t)
    window.dispatchEvent(new CustomEvent('paramsChange', { detail: { postcode: p, indoor_temperature_c: t } }))
  }

  return (
    <form onSubmit={onSubmit} aria-label="Forecast parameters">
      <label>
        Postcode:
        <input
          name="postcode"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
          aria-label="postcode"
        />
      </label>
      <label>
        Indoor temperature (°C):
        <input
          name="indoor_temperature_c"
          type="number"
          value={indoor}
          onChange={(e) => setIndoor(e.target.value)}
          aria-label="indoor temperature c"
        />
      </label>
      <button type="submit">Update</button>
    </form>
  )
}
