import sharp from 'sharp';

/**
 * Where the ink sits inside a control, read off the pixels.
 *
 * The browser cannot answer this: a range rect returns the *line box*, and the
 * whole question is that the ink inside a line box is not centred in it. Nor
 * does a range rect see `text-box` trimming, so a control that is correct
 * measures wrong and a control that is wrong measures right. Only the rendered
 * pixels settle it.
 *
 * Carried over from Hikaru, where kagami's `tools/measure-ink.mjs` is the same measurement pointed at
 * a running page by hand. One instrument, two callers: a number in a test and a
 * number in a comment have to come from the same place or they will disagree
 * and the comment will win.
 */
export interface InkGaps {
  readonly above: number;
  readonly below: number;
  readonly off: number;
}

/**
 * @param shot PNG of the control, taken at `scale` device pixels per CSS pixel
 * @param scale the device pixel ratio the shot was taken at
 * @param inset CSS pixels to step in before looking, to clear the control's own border
 * @param xSlice the horizontal band to read, as fractions of the width: a pill
 *   holds an icon, a label and a chevron, and their inks do not share a centre
 */
export async function inkGaps(
  shot: Buffer,
  {
    scale,
    inset = 2,
    xSlice = [0, 1],
  }: { scale: number; inset?: number; xSlice?: [number, number] },
): Promise<InkGaps | null> {
  const { data, info } = await sharp(shot).greyscale().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const edge = Math.round(inset * scale);
  const left = Math.max(edge, Math.round(xSlice[0] * width));
  const right = Math.min(width - edge, Math.round(xSlice[1] * width));

  // The background is whatever most of the first readable row is, and ink is
  // whatever differs from it - in either direction. A white label on a filled
  // button is ink too, and a rule that only looks for dark pixels reports the
  // button's own fill as its text.
  const row = [];
  for (let x = edge; x < width - edge; x += 1) row.push(data[edge * width + x] ?? 0);
  row.sort((a, b) => a - b);
  const background = row[Math.floor(row.length / 2)] ?? 0;
  const differs = (value: number) => Math.abs(value - background) > 32;

  let top = -1;
  let bottom = -1;
  for (let y = edge; y < height - edge; y += 1) {
    for (let x = left; x < right; x += 1) {
      if (differs(data[y * width + x] ?? background)) {
        if (top === -1) top = y;
        bottom = y;
        break;
      }
    }
  }
  if (top === -1) return null;

  const above = (top - edge) / scale;
  const below = (height - edge - 1 - bottom) / scale;
  return { above, below, off: (above - below) / 2 };
}
