import { act, fireEvent, render, screen } from '@testing-library/react';
import { Tooltip } from './Tooltip';

/**
 * What is asserted here is the part the native `title` could not do: appear on
 * keyboard focus, appear on hover inside a bounded time, and be in the DOM
 * where a screenshot and a test can see it (#352, #353).
 */
describe('Tooltip', () => {
  beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }));
  afterEach(() => vi.useRealTimers());

  const trigger = (label = 'Contacts') => (
    <Tooltip label={label}>
      <button type="button" aria-label={label}>
        icon
      </button>
    </Tooltip>
  );

  it('shows the name on hover, within half a second', () => {
    render(trigger());
    expect(screen.queryByRole('tooltip', { hidden: true })).toBeNull();

    fireEvent.mouseEnter(screen.getByRole('button'));
    act(() => void vi.advanceTimersByTime(500));

    expect(screen.getByRole('tooltip', { hidden: true }).textContent).toBe('Contacts');
  });

  it('does not show it while the pointer is only passing over', () => {
    render(trigger());
    const button = screen.getByRole('button');

    fireEvent.mouseEnter(button);
    act(() => void vi.advanceTimersByTime(100));
    fireEvent.mouseLeave(button);
    act(() => void vi.advanceTimersByTime(500));

    expect(screen.queryByRole('tooltip', { hidden: true })).toBeNull();
  });

  it('shows the name on keyboard focus without waiting', () => {
    render(trigger());
    // `:focus-visible` is what tells a tabbed-to button from a clicked one, and
    // jsdom does not implement it; the match is stubbed so the branch is the
    // one a keyboard user takes.
    const button = screen.getByRole('button');
    vi.spyOn(button, 'matches').mockReturnValue(true);

    fireEvent.focus(button);

    expect(screen.getByRole('tooltip', { hidden: true }).textContent).toBe('Contacts');
  });

  it('is hidden from the accessibility tree, because the trigger carries the name', () => {
    render(trigger());
    fireEvent.mouseEnter(screen.getByRole('button'));
    act(() => void vi.advanceTimersByTime(500));

    // Announced once, by the button. A bubble wired up as a description is how
    // a control comes to say "Contacts, Contacts".
    expect(screen.getByRole('tooltip', { hidden: true }).getAttribute('aria-hidden')).toBe('true');
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('goes away when the trigger is pressed', () => {
    render(trigger());
    const button = screen.getByRole('button');

    fireEvent.mouseEnter(button);
    act(() => void vi.advanceTimersByTime(500));
    fireEvent.mouseDown(button);

    expect(screen.queryByRole('tooltip', { hidden: true })).toBeNull();
  });

  it('passes the trigger through untouched when disabled', () => {
    render(
      <Tooltip label="Status" disabled>
        <button type="button">Status</button>
      </Tooltip>,
    );
    const button = screen.getByRole('button');

    fireEvent.mouseEnter(button);
    act(() => void vi.advanceTimersByTime(500));

    expect(screen.queryByRole('tooltip', { hidden: true })).toBeNull();
  });
});
