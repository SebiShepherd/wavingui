import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { HexColorPicker } from './HexColorPicker';

function open(props: Partial<Parameters<typeof HexColorPicker>[0]> = {}) {
  const onChange = vi.fn();
  render(<HexColorPicker label="Accent colour" value="#2563eb" onChange={onChange} {...props} />);
  fireEvent.click(screen.getByRole('button', { name: 'Accent colour' }));
  return onChange;
}

describe('HexColorPicker', () => {
  it('keeps the palette behind the trigger until it is asked for', () => {
    const onChange = vi.fn();
    render(<HexColorPicker label="Accent colour" value="#2563eb" onChange={onChange} />);
    expect(screen.queryByRole('dialog')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Accent colour' }));
    expect(screen.getByRole('dialog', { name: 'Accent colour picker' })).toBeTruthy();
  });

  it('names the value on the trigger, so the row needs no second readout', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <HexColorPicker label="Accent colour" value="#16a34a" onChange={onChange} />,
    );
    expect(screen.getByRole('button', { name: 'Accent colour' }).textContent).toContain('#16a34a');

    rerender(<HexColorPicker label="Accent colour" value="" onChange={onChange} />);
    expect(screen.getByRole('button', { name: 'Accent colour' }).textContent).toContain('None');
  });

  it('emits a preset colour, named rather than read out as hex digits', () => {
    const onChange = open();
    fireEvent.click(screen.getByRole('button', { name: 'Green' }));
    expect(onChange).toHaveBeenCalledWith('#16a34a');
  });

  it('accepts a typed value and normalises its case', () => {
    const onChange = open();
    fireEvent.change(screen.getByLabelText('Accent colour hex value'), {
      target: { value: '#AABBCC' },
    });
    expect(onChange).toHaveBeenCalledWith('#aabbcc');
  });

  it('names the preset under the pointer, on screen and not only in a tooltip', () => {
    open();
    fireEvent.mouseEnter(screen.getByRole('button', { name: 'Fuchsia' }));
    expect(screen.getByText('Fuchsia')).toBeTruthy();
  });

  it('says what is wrong instead of silently undoing it', () => {
    const onChange = open();
    fireEvent.change(screen.getByLabelText('Accent colour hex value'), {
      target: { value: 'not-a-colour' },
    });
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('alert').textContent).toMatch(/six hex digits/i);
  });

  it('stays quiet while a value is still half-typed', () => {
    const onChange = open();
    fireEvent.change(screen.getByLabelText('Accent colour hex value'), {
      target: { value: '#25' },
    });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('moves the hue with the arrow keys', () => {
    const onChange = open();
    fireEvent.keyDown(screen.getByRole('slider', { name: 'Hue' }), { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0]?.[0]).not.toBe('#2563eb');
  });

  it('does not offer to unset a colour that must be set', () => {
    open();
    expect(screen.queryByRole('button', { name: 'No colour' })).toBeNull();
  });

  it('unsets the colour where empty is allowed', () => {
    const onChange = open({ clearable: true });
    fireEvent.click(screen.getByRole('button', { name: 'No colour' }));
    expect(onChange).toHaveBeenCalledWith('');
  });

  // It edits live, so every way out has to mean the same thing: no gesture
  // silently keeps an edit while another silently throws it away.
  it('keeps the edit on Done and on Escape alike', () => {
    const onChange = open();
    fireEvent.click(screen.getByRole('button', { name: 'Teal' }));
    fireEvent.click(screen.getByRole('button', { name: 'Done' }));
    expect(onChange).toHaveBeenLastCalledWith('#0d9488');
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('closes on Escape without undoing anything', () => {
    const onChange = open();
    fireEvent.click(screen.getByRole('button', { name: 'Green' }));
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onChange).toHaveBeenLastCalledWith('#16a34a');
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  // The three-digit shorthand used to expand mid-word, rewriting the field
  // under the caret and writing a colour nobody asked for.
  it('lets a six-digit value be typed one character at a time', () => {
    const onChange = open();
    const field = screen.getByLabelText('Accent colour hex value');
    for (const partial of ['#1', '#16', '#16a', '#16a3', '#16a34']) {
      fireEvent.change(field, { target: { value: partial } });
    }
    expect(onChange).not.toHaveBeenCalled();
    expect((field as HTMLInputElement).value).toBe('#16a34');

    fireEvent.change(field, { target: { value: '#16a34a' } });
    expect(onChange).toHaveBeenCalledWith('#16a34a');
  });

  it('accepts the three-digit shorthand once the caret leaves', () => {
    const onChange = open();
    const field = screen.getByLabelText('Accent colour hex value');
    fireEvent.change(field, { target: { value: '#abc' } });
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.blur(field);
    expect(onChange).toHaveBeenCalledWith('#aabbcc');
  });
});
