import { render } from '@testing-library/react';

import FieldAddon from './';

describe('<FieldAddon />', () => {
  it('should render', () => {
    const { container, unmount } = render(<FieldAddon>€</FieldAddon>);

    expect(container).toMatchSnapshot();
    unmount();
  });
});
