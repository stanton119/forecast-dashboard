// tests/unit/test_use_url_params.test.js
import { renderHook, act } from '@testing-library/react';
import { useUrlParams } from '../../src/lib/hooks/useUrlParams';
import { vi, describe, test, expect, beforeAll, afterAll, afterEach } from 'vitest';

describe('useUrlParams', () => {
  const originalLocation = window.location;
  const originalHistory = window.history;

  beforeAll(() => {
    // Mock window.location
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        ...originalLocation,
        search: '',
        href: 'http://localhost/',
        toString: () => 'http://localhost/',
      },
    });
    // Mock window.history
    Object.defineProperty(window, 'history', {
      configurable: true,
      value: {
        ...originalHistory,
        replaceState: vi.fn()
      }
    });
  });

  afterEach(() => {
    // Reset URL after each test
    window.location.search = '';
    window.history.replaceState.mockClear();
  });

  afterAll(() => {
    // Restore original window.location and window.history
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
    Object.defineProperty(window, 'history', {
      configurable: true,
      value: originalHistory
    });
  });

  test('should return default values if no URL parameters are present', () => {
    const { result } = renderHook(() => useUrlParams());
    expect(result.current.postcode).toBe('');
    expect(result.current.indoorTemp).toBe(20);
  });

  test('should read initial parameters from URL', () => {
    window.location.search = '?postcode=SW1A0AA&indoorTemp=22';
    const { result } = renderHook(() => useUrlParams());
    expect(result.current.postcode).toBe('SW1A0AA');
    expect(result.current.indoorTemp).toBe(22);
  });

  test('should update URL and state when updateParams is called', () => {
    const { result } = renderHook(() => useUrlParams());

    act(() => {
      result.current.updateParams('SE100XX', 18);
    });

    expect(result.current.postcode).toBe('SE100XX');
    expect(result.current.indoorTemp).toBe(18);
    expect(window.history.replaceState).toHaveBeenCalledWith({}, '', 'http://localhost/?postcode=SE100XX&indoorTemp=18');
  });

  test('should handle invalid indoorTemp in URL by defaulting to 20', () => {
    window.location.search = '?postcode=SW1A0AA&indoorTemp=abc';
    const { result } = renderHook(() => useUrlParams());
    expect(result.current.postcode).toBe('SW1A0AA');
    expect(result.current.indoorTemp).toBe(20);
  });

  test('should remove postcode from URL if newPostcode is empty', () => {
    window.location.search = '?postcode=SW1A0AA&indoorTemp=20';
    const { result } = renderHook(() => useUrlParams());

    act(() => {
      result.current.updateParams('', 20);
    });

    expect(result.current.postcode).toBe('');
    expect(result.current.indoorTemp).toBe(20);
    expect(window.history.replaceState).toHaveBeenCalledWith({}, '', 'http://localhost/?indoorTemp=20');
  });
});