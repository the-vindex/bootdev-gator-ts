import {describe, expect, it} from 'vitest'
import {formatDuration, parseDuration} from "../../src/utils/duration_parsing";


describe('parseDuration', () => {
    it('should parse seconds', () => {
        expect(parseDuration('30s')).toBe(30 * 1000)
        expect(parseDuration('1s')).toBe(1000)
    })

    it('should parse minutes', () => {
        expect(parseDuration('5m')).toBe(5 * 60 * 1000)
        expect(parseDuration('1m')).toBe(60 * 1000)
    })

    it('should parse hours', () => {
        expect(parseDuration('2h')).toBe(2 * 60 * 60 * 1000)
        expect(parseDuration('1h')).toBe(60 * 60 * 1000)
    })


    it('should throw error for invalid format', () => {
        expect(() => parseDuration('invalid')).toThrow('Invalid duration "invalid"')
        expect(() => parseDuration('123')).toThrow('Invalid duration "123"')
        expect(() => parseDuration('')).toThrow('Invalid duration ""')
    })

    it('should throw error for negative numbers', () => {
        expect(() => parseDuration('-5s')).toThrow('Invalid duration "-5s"')
    })
})


describe('formatDuration', () => {

    it('should format seconds', () => {
      expect(formatDuration(2002)).toBe("2s2ms")
        expect(formatDuration(2000)).toBe("2s")
    })

    it('should format minutes', () => {
        expect(formatDuration(62000)).toBe("1m2s")
        expect(formatDuration(60000)).toBe("1m0s")
        expect(formatDuration(60002)).toBe("1m0s2ms")
    })

    it('should format hours', () => {
        expect(formatDuration(3662000)).toBe("1h1m2s")
        expect(formatDuration(3600000)).toBe("1h0m0s")
        expect(formatDuration(3600002)).toBe("1h0m0s2ms")
    })
})
