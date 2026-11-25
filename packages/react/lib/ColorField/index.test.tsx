import { createRef } from 'react';
import {
  render,
  fireEvent,
  act,
  createEvent,
} from '@testing-library/react';

import ColorField, { ColorFieldRef } from '.';

describe('<ColorField />', () => {
  it('should render', () => {
    const { container, unmount } = render(<ColorField autoFocus={true} />);
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should update values when mouse is down and lightness handle is ' +
    'selected', async () => {
    const ref = createRef<ColorFieldRef>();
    const { container, unmount } = render(
      <ColorField autoFocus={true} ref={ref} />
    );
    fireEvent.mouseDown(container.querySelector('.lightness'), { button: 0 });
    expect(container).toMatchSnapshot('lightness handle moving');

    // Man testing is weird
    await act(async () => {
      window.pageXOffset = 50;
      window.pageYOffset = 50;

      // Simulate element width/height
      Object.defineProperty(
        ref.current.colorLightnessRef.current,
        'offsetWidth',
        { value: 100 }
      );
      Object.defineProperty(
        ref.current.colorLightnessRef.current,
        'offsetHeight',
        { value: 100 }
      );

      return Promise.resolve();
    });

    // Testing library (or jsdom?) doesn't support pageX/Y if passed
    // using fireEvent.mouseMove (lol), so we have to first create the event,
    // hard code the pageX and pageY values using .defineProperty, and then
    // give them straight to fireEvent (not fireEvent.mouseMove, this does
    // not work either)
    const moveEvent = createEvent
      .mouseMove(container.querySelector('.lightness'));
    Object.defineProperty(moveEvent, 'pageX', { value: 100 });
    Object.defineProperty(moveEvent, 'pageY', { value: 100 });

    fireEvent(container.querySelector('.lightness'), moveEvent);
    expect(container).toMatchSnapshot('color selected');
    unmount();
  });

  it('should update values when mouse is down and hue handle is ' +
    'selected', async () => {
    const ref = createRef<ColorFieldRef>();
    const { container, unmount } = render(
      <ColorField autoFocus={true} ref={ref} />
    );

    fireEvent.mouseDown(container.querySelector('.hue'), { button: 0 });
    expect(container).toMatchSnapshot('hue handle moving');

    await act(async () => {
      window.pageXOffset = 50;
      Object.defineProperty(
        ref.current.colorHueRef.current,
        'offsetWidth',
        { value: 100 }
      );

      return Promise.resolve();
    });

    const moveEvent = createEvent
      .mouseMove(container.querySelector('.hue'));
    Object.defineProperty(moveEvent, 'pageX', { value: 100 });
    fireEvent(container.querySelector('.hue'), moveEvent);

    expect(container).toMatchSnapshot('color selected');
    unmount();
  });

  it('should update values when mouse is down and alpha handle is ' +
    'selected', async () => {
    const ref = createRef<ColorFieldRef>();
    const { container, unmount } = render(
      <ColorField autoFocus={true} ref={ref} />
    );

    fireEvent.mouseDown(container.querySelector('.alpha'), { button: 0 });
    expect(container).toMatchSnapshot('alpha handle moving');

    await act(async () => {
      window.pageXOffset = 50;
      Object.defineProperty(
        ref.current.colorAlphaRef.current,
        'offsetWidth',
        { value: 100 }
      );

      return Promise.resolve();
    });

    const moveEvent = createEvent
      .mouseMove(container.querySelector('.alpha'));
    Object.defineProperty(moveEvent, 'pageX', { value: 100 });
    fireEvent(container.querySelector('.alpha'), moveEvent);
    expect(container).toMatchSnapshot('color selected');

    unmount();
  });

  it('should render extra content in the color menu', async () => {
    const onChange = vi.fn();
    const ref = createRef<ColorFieldRef>();
    const { container, getByText, unmount } = render(
      <ColorField
        ref={ref}
        autoFocus={true}
        value="#000000"
        onChange={onChange}
        renderMenuContent={({ value, setValue, close }) => (
          <>
            <span>Current: { value }</span>
            <button
              type="button"
              onClick={() => {
                setValue('var(--primary-color)');
                close();
              }}
            >
              Primary
            </button>
          </>
        )}
      />
    );

    // Inside the menu, below the color wheel
    const content = container.querySelector('.color-menu .menu-content');
    expect(content).toBeTruthy();
    expect(container.querySelector('.color-menu .color-wheel')
      .compareDocumentPosition(content) & Node.DOCUMENT_POSITION_FOLLOWING)
      .toBeTruthy();
    expect(getByText('Current: #000000')).toBeTruthy();

    fireEvent.click(getByText('Primary'));

    // Like typing it
    expect(onChange).toHaveBeenCalledWith({
      value: 'var(--primary-color)',
      valid: true,
    });
    expect(ref.current.value).toBe('var(--primary-color)');
    expect(container.querySelector<HTMLInputElement>('input').value)
      .toBe('var(--primary-color)');
    expect(container.querySelector('.color-menu')).toBeFalsy();

    unmount();
  });

  it('should allow to pick presets', async () => {
    const onChange = vi.fn();
    const { container, getByText, getByLabelText, findByText, unmount } =
      render(
        <ColorField
          autoFocus={true}
          onChange={onChange}
          presets={[
            { value: '#6C5CE7', title: 'Purple' },
            { value: 'var(--brand)', color: '#E17055', title: 'Brand color' },
          ]}
        />
      );

    expect(getByText('Presets')).toBeTruthy();
    expect(container.querySelectorAll('.color-menu .presets .preset'))
      .toHaveLength(2);
    // Displayed color
    expect(getByLabelText('Brand color').style.backgroundColor)
      .toBe('rgb(225, 112, 85)');

    // Titles in tooltips
    fireEvent.mouseEnter(getByLabelText('Brand color'));
    expect(await findByText('Brand color', { selector: '.tooltip *' }))
      .toBeTruthy();

    fireEvent.click(getByLabelText('Brand color'));
    expect(onChange).toHaveBeenCalledWith({
      value: 'var(--brand)',
      valid: true,
    });
    // The selected preset is displayed with its title & color
    expect(container.querySelector<HTMLInputElement>('input').value)
      .toBe('Brand color');
    expect(container.querySelector<HTMLElement>('.pigment').style
      .backgroundColor).toBe('rgb(225, 112, 85)');
    expect(container.querySelector('.color-menu')).toBeFalsy();

    unmount();
  });

  it('should allow to group presets', () => {
    const { container, getByText, getByLabelText, unmount } = render(
      <ColorField
        autoFocus={true}
        value="var(--palette--red)"
        presetsLabel="Others"
        presets={[
          { label: 'Styles', presets: [
            { value: 'var(--skin--text)', color: '#000', title: 'Text' },
          ] },
          { label: 'Palette', presets: [
            { value: 'var(--palette--red)', color: '#F00', title: 'Red' },
            { value: 'var(--palette--blue)', color: '#00F', title: 'Blue' },
          ] },
          { value: '#FFFFFF', title: 'White' },
          // Empty groups are not displayed
          { label: 'Empty', presets: [] },
        ]}
      />
    );

    const groups = container.querySelectorAll('.color-menu .presets');
    expect(groups).toHaveLength(3);
    expect([...groups].map(g => g.querySelector('.presets-label').textContent))
      .toEqual(['Styles', 'Palette', 'Others']);
    expect(groups[1].querySelectorAll('.preset')).toHaveLength(2);
    expect(getByText('Palette')).toBeTruthy();
    // Selected preset, whatever its group
    expect(getByLabelText('Red').getAttribute('aria-pressed')).toBe('true');

    const input = container.querySelector<HTMLInputElement>('input');
    fireEvent.blur(input);
    expect(input.value).toBe('Red');

    unmount();
  });

  it('should display the raw value of a preset while editing it', () => {
    const onChange = vi.fn();
    const { container, unmount } = render(
      <ColorField
        value="var(--brand)"
        onChange={onChange}
        presets={[
          { value: 'var(--brand)', color: '#E17055', title: 'Brand color' },
        ]}
      />
    );

    const input = container.querySelector<HTMLInputElement>('input');
    expect(input.value).toBe('Brand color');

    fireEvent.focus(input);
    expect(input.value).toBe('var(--brand)');

    fireEvent.change(input, { target: { value: '#000000' } });
    expect(onChange).toHaveBeenLastCalledWith({
      value: '#000000',
      valid: true,
    });

    fireEvent.blur(input);
    // Not a preset anymore
    expect(input.value).toBe('#000000');

    unmount();
  });

  it('should allow to customize the presets label', () => {
    const { getByText, getByLabelText, unmount } = render(
      <ColorField
        autoFocus={true}
        value="#6C5CE7"
        presets={[{ value: '#6C5CE7', title: 'Purple' }]}
        presetsLabel="Palette"
      />
    );

    expect(getByText('Palette')).toBeTruthy();
    // Current value
    expect(getByLabelText('Purple').getAttribute('aria-pressed'))
      .toBe('true');

    unmount();
  });
});
