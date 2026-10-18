import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Person, personInitials, personName, SelectableAvatar } from './Person';

/**
 * The rules this primitive exists to hold, asserted rather than described.
 *
 * Each of these was decided differently on a different screen before, which is
 * what #176 (one requester, three renderings on one screen) is made of. A rule
 * that lives only in a component's comment is one the next screen re-decides.
 */
describe('personName', () => {
  it('prefers the name, falls back to the address, then to what the caller calls nobody', () => {
    expect(personName({ name: 'Nadia Bloom', email: 'nadia@example.com' })).toBe('Nadia Bloom');
    expect(personName({ name: '   ', email: 'nadia@example.com' })).toBe('nadia@example.com');
    expect(personName({})).toBe('Unknown');
    // The caller names the nothing, because "Unassigned" and "Unknown sender"
    // are different facts and only the caller knows which is true.
    expect(personName({}, 'Unassigned')).toBe('Unassigned');
  });
});

describe('personInitials', () => {
  it('takes two letters from two words and one from one', () => {
    expect(personInitials({ name: 'Nadia Bloom' })).toBe('NB');
    expect(personInitials({ name: 'Nadia' })).toBe('N');
    expect(personInitials({ name: 'nadia bloom hart' })).toBe('NB');
  });

  it('takes one letter from an address, never two', () => {
    // The domain is not their name. `ada@example.com` used to yield AE on the
    // screens that split on any separator.
    expect(personInitials({ email: 'ada@example.com' })).toBe('A');
    // And a local part split on its dots is not a first name and a surname:
    // reading AL out of it asserts something nobody said (#251).
    expect(personInitials({ email: 'ada.lovelace@example.com' })).toBe('A');
  });

  it('draws a dash for nobody at all, never the initials of the phrase', () => {
    expect(personInitials({}, '')).toBe('-');
    // "Unknown sender" must not come out as US: that reads as somebody's real
    // initials, which is the one thing the circle may not claim.
    expect(personInitials({}, 'Unknown sender')).toBe('-');
    expect(personInitials({}, 'Unassigned')).toBe('-');
  });
});

describe('Person', () => {
  it('writes the name once, beside its circle', () => {
    render(<Person person={{ name: 'Nadia Bloom', email: 'nadia@example.com' }} />);
    expect(screen.getByText('Nadia Bloom')).toBeTruthy();
  });

  it('shows the second line when the caller gives one', () => {
    render(<Person person={{ name: 'Nadia Bloom' }} secondary="nadia@example.com" />);
    expect(screen.getByText('nadia@example.com')).toBeTruthy();
  });

  it('renders somebody deactivated rather than hiding them', () => {
    const { container } = render(<Person person={{ name: 'Ada Lovelace', deactivated: true }} />);
    expect(screen.getByText('Ada Lovelace')).toBeTruthy();
    // Quieter, and by the tone the theme reserves for somebody who cannot sign
    // in, whatever tone the caller asked for.
    expect(container.querySelector('.text-muted')).toBeTruthy();
  });

  it('shows the picture where there is one', () => {
    const { container } = render(
      <Person person={{ name: 'Nadia Bloom', imageUrl: 'https://example.test/n.png' }} />,
    );
    const image = container.querySelector('img');
    expect(image?.getAttribute('src')).toBe('https://example.test/n.png');
    // Decorative: the name is written beside it, so announcing it twice is noise.
    expect(image?.getAttribute('alt')).toBe('');
  });

  it('does not print the address twice for somebody with no name', () => {
    render(<Person person={{ email: 'nadia@example.com' }} secondary="nadia@example.com" />);
    expect(screen.getAllByText('nadia@example.com')).toHaveLength(1);
  });
});

describe('SelectableAvatar', () => {
  it('draws the same letters as every other circle', () => {
    const { container } = render(
      <SelectableAvatar
        person={{ name: 'Nadia Bloom', email: 'nadia@example.com' }}
        selected={false}
        onToggle={() => undefined}
        label="Select HD-2026-0001"
      />,
    );
    // Two, not one. The row used to show N while the panel beside it showed NB
    // for the same requester, at the same moment, on the same screen (#250).
    expect(container.textContent).toBe('NB');
  });

  it('shows a tick instead of the letters once it is picked', () => {
    const { container } = render(
      <SelectableAvatar
        person={{ name: 'Nadia Bloom' }}
        selected
        onToggle={() => undefined}
        label="Select HD-2026-0001"
      />,
    );
    expect(container.textContent).toBe('');
    expect(container.querySelector('svg')).toBeTruthy();
  });
});
