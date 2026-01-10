import { describe, it, expect } from 'vitest'
import { parseBBCAggregated } from '../../../src/lib/bbc-client.js'

describe('BBC aggregated parser', () => {
  it('parses aggregated forecast payload into standardized series', () => {
    const sample = {
      forecasts: {
        '2026-01-10': {
          detailed: {
            reports: [
              { localDate: '2026-01-10', timeslot: '14', humidity: 70, temperatureC: 5 }
            ]
          }
        }
      }
    }

    const out = parseBBCAggregated(sample)
    expect(Array.isArray(out)).toBe(true)
    expect(out.length).toBe(1)
    expect(out[0]).toEqual({
      timestamp_iso: '2026-01-10T14:00:00+00:00',
      outside_humidity_percent: 70,
      outside_temp_c: 5
    })
  })
})
