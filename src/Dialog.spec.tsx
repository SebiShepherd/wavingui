import { act, fireEvent, render, screen } from '@testing-library/react';
import { ConfirmDialog } from './ConfirmDialog';
import { Dialog } from './Dialog';

/**
 * The exit is the point of the primitive (wavingui#1): closed, a dialog stays
 * drawn for the length of its exit with the exit classes, then unmounts.
 */
describe('Dialog', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  const dialog = (open: boolean, onClose = () => undefined) => (
    <Dialog open={open} title="Lock with a timer" onClose={onClose}>
      <p>Body</p>
    </Dialog>
  );

  it('plays its exit before it unmounts', () => {
    const { rerender } = render(dialog(true));
    expect(screen.getByRole('dialog').className).toContain('pop-in');

    rerender(dialog(false));
    expect(screen.getByRole('dialog').className).toContain('pop-out');

    act(() => void vi.advanceTimersByTime(200));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('reopening during the exit keeps it open', () => {
    const { rerender } = render(dialog(true));
    rerender(dialog(false));
    rerender(dialog(true));
    act(() => void vi.advanceTimersByTime(300));
    expect(screen.getByRole('dialog').className).toContain('pop-in');
  });

  it('closes on Escape and on the backdrop', () => {
    const onClose = vi.fn();
    render(dialog(true, onClose));
    fireEvent.keyDown(document, { key: 'Escape' });
    fireEvent.mouseDown(screen.getByRole('dialog').parentElement!);
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('a confirmation starts on its way out, not on the destructive button', () => {
    render(<ConfirmDialog title="Delete?" body="Gone for good." confirmLabel="Delete" destructive onConfirm={() => undefined} onCancel={() => undefined} />);
    expect(document.activeElement?.textContent).toBe('Cancel');
  });
});
