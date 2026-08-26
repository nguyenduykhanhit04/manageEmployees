/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * format.test.ts, 25/08/2026 nguyenduykhanh2
 */

import { truncateText } from '@/lib/utils/format';

describe('truncateText utility', () => {
  it('should return empty string when input is null or undefined or empty', () => {
    expect(truncateText(null)).toBe('');
    expect(truncateText(undefined)).toBe('');
    expect(truncateText('')).toBe('');
  });

  it('should return original text when length is <= 22', () => {
    const shortText = 'Nguyen Van A';
    expect(truncateText(shortText)).toBe(shortText);

    const exact22 = '1234567890123456789012';
    expect(truncateText(exact22)).toBe(exact22);
  });

  it('should truncate and add ... when length > 22', () => {
    const longText = 'Nguyen Van A Very Long Employee Name Exceeding Limit';
    const result = truncateText(longText);

    expect(result).toBe('Nguyen Van A Very Long...');
    expect(result.length).toBe(22 + 3); // 22 ký tự + 3 dấu chấm
  });

  it('should support custom maxLength', () => {
    const text = 'Hello World';
    expect(truncateText(text, 5)).toBe('Hello...');
  });
});
