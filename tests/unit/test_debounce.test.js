// tests/unit/test_debounce.test.js
import { debounce } from '../../src/lib/utils/debounce'; // Adjust path as necessary

describe('debounce', () => {
  let func;
  let debouncedFunc;


  beforeEach(() => {
    func = jest.fn();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('should execute the function only once after a delay', () => {
    debouncedFunc = debounce(func, 100);

    debouncedFunc();
    debouncedFunc();
    debouncedFunc();

    // Function should not have been called yet
    expect(func).not.toHaveBeenCalled();

    // Advance timers by less than the delay
    jest.advanceTimersByTime(50);
    expect(func).not.toHaveBeenCalled();

    // Advance timers by more than the delay
    jest.advanceTimersByTime(50);
    expect(func).toHaveBeenCalledTimes(1);

    // Call again, and ensure it's debounced again
    debouncedFunc();
    jest.advanceTimersByTime(50);
    expect(func).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(50);
    expect(func).toHaveBeenCalledTimes(2);
  });

  test('should pass arguments and context correctly', () => {
    debouncedFunc = debounce(func, 100);
    const context = { a: 1 };
    debouncedFunc.call(context, 'arg1', 'arg2');
    jest.runAllTimers();
    expect(func).toHaveBeenCalledWith('arg1', 'arg2');
    expect(func).toHaveBeenCalledOnLastCallWith('arg1', 'arg2'); // Jest specific assertion
    expect(func).toHaveBeenCalledTimes(1);
  });

  test('should execute immediately if immediate is true', () => {
    debouncedFunc = debounce(func, 100, true);

    debouncedFunc('first');
    expect(func).toHaveBeenCalledWith('first');
    expect(func).toHaveBeenCalledTimes(1);

    debouncedFunc('second'); // Should not call immediately again
    jest.advanceTimersByTime(50);
    expect(func).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(50); // After delay, it's ready for another immediate call
    debouncedFunc('third');
    expect(func).toHaveBeenCalledWith('third');
    expect(func).toHaveBeenCalledTimes(2);
  });

  test('should reset timer if called again before delay with immediate true', () => {
    debouncedFunc = debounce(func, 100, true);

    debouncedFunc('a'); // Called immediately
    expect(func).toHaveBeenCalledWith('a');

    jest.advanceTimersByTime(50);
    debouncedFunc('b'); // Should not call immediately, should reset timer
    jest.advanceTimersByTime(50);
    expect(func).toHaveBeenCalledTimes(1); // Still only one call
    jest.advanceTimersByTime(50); // Timer expires, function is ready again
    debouncedFunc('c');
    expect(func).toHaveBeenCalledWith('c');
    expect(func).toHaveBeenCalledTimes(2);
  });
});
