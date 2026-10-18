import { Children, type ReactNode } from 'react';

/**
 * Wrap the words in a control so they are centred on their letters.
 *
 * `items-center` centres the *line box*, which is the font's ascent plus its
 * descent and is not symmetric about the ink inside it: measured at ten times
 * scale, a label in a 30px pill sat 7.5px below the top and 8.5px above the
 * bottom. Half a pixel, on every fixed-height control in the product, which is
 * why it reads as "something is slightly off" rather than as a defect anybody
 * can point at.
 *
 * The trim (`optical-center` in `styles.css`) has to sit on the element that
 * holds the text: applying it to the flex container does nothing, because the
 * text there is an anonymous inline box. That is the whole reason this helper
 * exists rather than a class on a base string - a primitive can wrap its own
 * words, and then every screen built from that primitive gets it without
 * anybody remembering.
 *
 * Non-text children pass through untouched, so an icon beside a label keeps its
 * own flex slot and the gap between them.
 */
export function opticalText(children: ReactNode): ReactNode {
  return Children.map(children, (child) =>
    typeof child === 'string' || typeof child === 'number' ? (
      <span className="optical-center">{child}</span>
    ) : (
      child
    ),
  );
}
