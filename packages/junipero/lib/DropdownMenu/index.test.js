import { render } from '@testing-library/react';

import { DropdownContext } from '../contexts';
import DropdownMenu from './';

describe('<DropdownMenu />', () => {
  it('should render', () => {
    const { container, unmount } = render(
      <DropdownContext.Provider
        value={{ styles: {}, attributes: {}, opened: true }}
      >
        <DropdownMenu />
      </DropdownContext.Provider>
    );
    expect(container.querySelectorAll('.junipero.dropdown-menu').length)
      .toBe(1);
    unmount();
  });

  it('should allow to render menu inside a custom container', () => {
    const { unmount } = render(
      <DropdownContext.Provider
        value={{ styles: {}, attributes: {}, opened: true }}
      >
        <DropdownMenu container="body" />
      </DropdownContext.Provider>
    );
    expect(document.body.querySelector('.junipero.junipero-menu'))
      .toBeDefined();
    unmount();
  });

  it('should allow to animate menu', () => {
    const { container, unmount } = render(
      <DropdownContext.Provider
        value={{ styles: {}, attributes: {}, opened: true }}
      >
        <DropdownMenu
          animate={menu => (
            <div className="animation">
              { menu }
            </div>
          )}
        />
      </DropdownContext.Provider>
    );
    expect(container.querySelectorAll('.animation').length).toBe(1);
    unmount();
  });

  it('should allow the use of insert apparition mode', () => {
    const { container, rerender, unmount } = render(
      <DropdownContext.Provider value={{ opened: false }}>
        <DropdownMenu apparition="insert" />
      </DropdownContext.Provider>
    );
    expect(container.querySelectorAll('.menu-inner').length).toBe(0);
    rerender(
      <DropdownContext.Provider value={{ opened: true }}>
        <DropdownMenu apparition="insert" />
      </DropdownContext.Provider>
    );
    expect(container.querySelectorAll('.menu-inner').length).toBe(1);
    unmount();
  });

  it('should allow the use of css apparition mode', () => {
    const { container, rerender, unmount } = render(
      <DropdownContext.Provider value={{ opened: false }}>
        <DropdownMenu apparition="css" />
      </DropdownContext.Provider>
    );
    expect(container.querySelectorAll('.menu-inner').length).toBe(1);
    rerender(
      <DropdownContext.Provider value={{ opened: true }}>
        <DropdownMenu apparition="css" />
      </DropdownContext.Provider>
    );
    expect(container.querySelectorAll('.menu-inner').length).toBe(1);
    unmount();
  });
});
