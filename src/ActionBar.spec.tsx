import { fireEvent, render, screen, within } from '@testing-library/react';
import { Tag, Trash2 } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';
import { ActionBar, type BarItem } from './ActionBar';
import { useModalPresence } from './modal';

const noop = () => undefined;

describe('ActionBar', () => {
  /**
   * A dialog dims the screen it is asking about; this bar kept its own surface
   * and its own click targets over that dim, and the rows it acted on were the
   * rows the dialog was asking about (#443). The rule cannot live in the page
   * that owns the bar, because the dialog that caught it out belongs to another
   * pane entirely.
   */
  it('is not on screen while a dialog is', () => {
    function Dialog() {
      useModalPresence();
      return <div role="dialog" aria-label="Merge ticket" />;
    }
    const view = render(
      <ActionBar
        count={2}
        total={2}
        actions={[]}
        onClear={noop}
      />,
    );
    expect(screen.getByRole('toolbar', { name: 'Actions for 2/2 selected' })).toBeTruthy();

    view.rerender(
      <>
        <ActionBar
          count={2}
          total={2}
          actions={[]}
          onClear={noop}
        />
        <Dialog />
      </>,
    );
    expect(screen.queryByRole('toolbar', { name: 'Actions for 2/2 selected' })).toBeNull();

    // And back when it closes: hiding is the dialog's doing, not a state the
    // bar gets stuck in.
    view.rerender(
      <ActionBar
        count={2}
        total={2}
        actions={[]}
        onClear={noop}
      />,
    );
    expect(screen.getByRole('toolbar', { name: 'Actions for 2/2 selected' })).toBeTruthy();
  });

  /**
   * The offer is optional furniture, so it is what gives when the column is
   * narrow - and it gives by moving into the overflow, not by being cut off.
   * jsdom has no `ResizeObserver`, so the bar reads its honest default (room
   * for everything) and the offer is inline; the narrow half of this rule is
   * measured in `responsive.spec.ts` at five widths, where there are real
   * pixels to measure.
   */
  /**
   * The bar says what is held out of what could be, and its box is the way out
   * at any count - the gesture Gmail and Intercom share. Widening the selection
   * is not here: it needs words, and the bar has no room for them (see
   * `SelectionRest`).
   */
  it('says what it holds out of what it could, and puts it down', () => {
    const onClear = vi.fn();
    const { rerender } = render(<ActionBar count={3} total={30} actions={[]} onClear={onClear} />);

    const bar = screen.getByRole('toolbar', { name: 'Actions for 3/30 selected' });
    expect(within(bar).getByText('3/30 selected')).toBeTruthy();

    const partial = within(bar).getByLabelText('Deselect all') as HTMLInputElement;
    expect(partial.checked).toBe(false);
    expect(partial.indeterminate).toBe(true);
    fireEvent.click(partial);
    expect(onClear).toHaveBeenCalled();

    rerender(<ActionBar count={30} total={30} actions={[]} onClear={onClear} />);
    const full = screen.getByLabelText('Deselect all') as HTMLInputElement;
    expect(full.checked).toBe(true);
    expect(full.indeterminate).toBe(false);
  });

  // Printed for the eye, hidden from the ear: read aloud, "Move to trash #"
  // becomes "Move to trash number sign".
  it('prints a shortcut without putting it in the accessible name', () => {
    const actions: BarItem[] = [
      {
        key: 'trash',
        label: 'Move to trash',
        shortcut: '#',
        icon: <Trash2 aria-hidden />,
        onSelect: noop,
      },
    ];
    render(
      <ActionBar
        count={1}
        total={1}
        actions={actions}
        onClear={noop}
      />,
    );

    expect(screen.getByRole('button', { name: 'Move to trash' })).toBeTruthy();
    expect(screen.getByText('#')).toBeTruthy();
  });

  it('renders a menu verb the caller composed', () => {
    const actions: BarItem[] = [
      { key: 'tag', node: <button type="button">Tag</button> },
      { key: 'trash', label: 'Trash', icon: <Tag aria-hidden />, onSelect: noop },
    ];
    render(
      <ActionBar
        count={2}
        total={2}
        actions={actions}
        onClear={noop}
      />,
    );

    expect(screen.getByRole('button', { name: 'Tag' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Trash' })).toBeTruthy();
  });
  it('keeps clear of a footer strip when the caller says there is one', () => {
    // The inbox passed `clearsFooter` for three evaluator runs while no
    // interface between it and `FloatingBar` declared the prop, so it was
    // dropped and the bar sat on the layout switch (#298, #362). Nothing
    // typechecks this app in CI (#238), so the assertion has to be here.
    const { rerender } = render(
      <ActionBar
        count={2}
        total={2}
        actions={[]}
        onClear={noop}
        placement="overlay"
      />,
    );
    const withoutFooter = screen.getByRole('toolbar').parentElement;
    expect(withoutFooter?.className).not.toContain('pb-11');

    rerender(
      <ActionBar
        count={2}
        total={2}
        actions={[]}
        onClear={noop}
        placement="overlay"
        clearsFooter
      />,
    );
    expect(screen.getByRole('toolbar').parentElement?.className).toContain('pb-11');
  });

});

// The budget itself (`ACTION_BUDGET`) is asserted by each product against its
// own bars, because only a product knows which verbs a bar holds. Hikaru's test
// for its bulk bar is the worked example.
