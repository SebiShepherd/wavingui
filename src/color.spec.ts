import { describe, expect, it } from 'vitest';
import { hexToHsv, hsvToHex, luminance, normaliseHex, readableOn } from './color';

describe('normaliseHex', () => {
  it('accepts what people paste', () => {
    expect(normaliseHex('#2563EB')).toBe('#2563eb');
    expect(normaliseHex('2563eb')).toBe('#2563eb');
    expect(normaliseHex('  #abc ')).toBe('#aabbcc');
  });

  it('rejects anything that is not a colour', () => {
    expect(normaliseHex('')).toBeNull();
    expect(normaliseHex('#25')).toBeNull();
    expect(normaliseHex('rebeccapurple')).toBeNull();
    expect(normaliseHex('#12345g')).toBeNull();
  });
});

describe('hex and hsv', () => {
  // Every colour the picker can produce must survive the trip back, or the
  // marker jumps to a different spot than the one that was clicked.
  it.each(['#000000', '#ffffff', '#2563eb', '#16a34a', '#ea580c', '#7f7f7f', '#ff0000'])(
    'round-trips %s',
    (hex) => {
      expect(hsvToHex(hexToHsv(hex))).toBe(hex);
    },
  );

  it('keeps a hue at full saturation and value on the spectrum', () => {
    expect(hsvToHex({ h: 0, s: 1, v: 1 })).toBe('#ff0000');
    expect(hsvToHex({ h: 120, s: 1, v: 1 })).toBe('#00ff00');
    expect(hsvToHex({ h: 240, s: 1, v: 1 })).toBe('#0000ff');
    expect(hsvToHex({ h: 360, s: 1, v: 1 })).toBe('#ff0000');
  });

  it('reports greys as unsaturated', () => {
    expect(hexToHsv('#808080').s).toBe(0);
    expect(hexToHsv('#000000').v).toBe(0);
  });
});

describe('readableOn', () => {
  it('marks a light colour in black and a dark one in white', () => {
    expect(readableOn('#ffffff')).toBe('#000000');
    expect(readableOn('#fbbf24')).toBe('#000000');
    expect(readableOn('#2563eb')).toBe('#ffffff');
    expect(readableOn('#000000')).toBe('#ffffff');
  });

  it('orders luminance the way perception does', () => {
    expect(luminance('#ffffff')).toBeGreaterThan(luminance('#808080'));
    expect(luminance('#808080')).toBeGreaterThan(luminance('#000000'));
  });
});
