/** Hue 0-360, saturation and value 0-1. */
export interface Hsv {
  readonly h: number;
  readonly s: number;
  readonly v: number;
}

const HEX6 = /^#[0-9a-fA-F]{6}$/;

export function isHex(value: string): boolean {
  return HEX6.test(value);
}

/**
 * Accepts what people actually paste: with or without the hash, three digits or
 * six, any case. Returns a normalised `#rrggbb` in lower case, or null.
 */
export function normaliseHex(value: string): string | null {
  const raw = value.trim().replace(/^#/, '');
  if (/^[0-9a-fA-F]{3}$/.test(raw)) {
    const [r, g, b] = raw;
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  if (/^[0-9a-fA-F]{6}$/.test(raw)) return `#${raw.toLowerCase()}`;
  return null;
}

export function hexToHsv(hex: string): Hsv {
  const normalised = normaliseHex(hex) ?? '#000000';
  const r = parseInt(normalised.slice(1, 3), 16) / 255;
  const g = parseInt(normalised.slice(3, 5), 16) / 255;
  const b = parseInt(normalised.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === r) h = 60 * (((g - b) / delta) % 6);
    else if (max === g) h = 60 * ((b - r) / delta + 2);
    else h = 60 * ((r - g) / delta + 4);
  }
  if (h < 0) h += 360;

  return { h, s: max === 0 ? 0 : delta / max, v: max };
}

export function hsvToHex({ h, s, v }: Hsv): string {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  const sector = Math.floor(h / 60) % 6;
  const [r, g, b] = (
    [
      [c, x, 0],
      [x, c, 0],
      [0, c, x],
      [0, x, c],
      [x, 0, c],
      [c, 0, x],
    ] as const
  )[sector] ?? [0, 0, 0];

  const channel = (value: number) =>
    Math.round((value + m) * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${channel(r)}${channel(g)}${channel(b)}`;
}

/**
 * Relative luminance per WCAG 2.1, used to decide whether a marker drawn on a
 * colour should be black or white.
 */
export function luminance(hex: string): number {
  const normalised = normaliseHex(hex) ?? '#000000';
  const channels = [1, 3, 5].map((offset) => {
    const value = parseInt(normalised.slice(offset, offset + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

export function readableOn(hex: string): string {
  return luminance(hex) > 0.45 ? '#000000' : '#ffffff';
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
