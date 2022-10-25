import { render } from '@testing-library/react';

import {
  AccessLogo,
  ConnectLogo,
  EngageLogo,
  PooolLogo,
  SubscribeLogo,
} from './index';

describe('Logos', () => {
  it('should render', () => {
    const { container, unmount } = render(
      <>
        <PooolLogo />
        <AccessLogo />
        <SubscribeLogo />
        <ConnectLogo />
        <EngageLogo />
      </>
    );
    expect(container).toMatchSnapshot();
    unmount();
  });
});
