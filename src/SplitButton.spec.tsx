import { fireEvent, render, screen } from '@testing-library/react';
import { SplitButton } from './SplitButton';

/**
 * The property under test is the one #174 was about: one field, one editor.
 * The wide half does the usual thing, the caret holds the rest, and the value
 * the ticket already has is marked rather than offered as a change.
 */
describe('SplitButton', () => {
  const options = [
    { value: 'open', label: 'Open', current: true },
    { value: 'pending', label: 'Pending' },
    { value: 'resolved', label: 'Resolved' },
  ];

  function setup(disabled = false) {
    const onClick = vi.fn();
    const onSelect = vi.fn();
    render(
      <SplitButton
        label="Resolve"
        onClick={onClick}
        disabled={disabled}
        menuLabel="Set status"
        groupLabel="Status"
        options={options}
        onSelect={onSelect}
      />,
    );
    return { onClick, onSelect };
  }

  it('runs the wide half without opening anything', () => {
    const { onClick } = setup();
    fireEvent.click(screen.getByRole('button', { name: 'Resolve' }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.queryByRole('menuitem')).toBeNull();
  });

  it('offers the whole vocabulary behind the caret', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: 'Set status' }));
    expect(screen.getAllByRole('menuitem').map((item) => item.textContent)).toEqual([
      'Open',
      'Pending',
      'Resolved',
    ]);
  });

  it('sets the chosen value and closes', () => {
    const { onSelect } = setup();
    fireEvent.click(screen.getByRole('button', { name: 'Set status' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Pending' }));
    expect(onSelect).toHaveBeenCalledWith('pending');
    expect(screen.queryByRole('menuitem')).toBeNull();
  });

  it('does not re-set the value the record already has', () => {
    const { onSelect } = setup();
    fireEvent.click(screen.getByRole('button', { name: 'Set status' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Open' }));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('names the pair as one control, so a snapshot does not read two', () => {
    setup();
    const group = screen.getByRole('group', { name: 'Status' });
    expect(group.querySelectorAll('button')).toHaveLength(2);
  });

  it('says what the menu sets, above the values it offers', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: 'Set status' }));
    expect(screen.getByText('Set status', { selector: 'p' })).toBeTruthy();
  });

  it('keeps the caret live when the wide half is spent', () => {
    // A resolved ticket cannot be resolved again, and "put it back to open" is
    // exactly what is wanted then.
    const { onSelect } = setup(true);
    expect((screen.getByRole('button', { name: 'Resolve' }) as HTMLButtonElement).disabled).toBe(
      true,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Set status' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Pending' }));
    expect(onSelect).toHaveBeenCalledWith('pending');
  });
});
