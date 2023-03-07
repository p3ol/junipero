import { render } from '@testing-library/react';

import {
  AccessLogo,
  ConnectLogo,
  EngageLogo,
  FlowLogo,
  JuniperoLogo,
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
        <FlowLogo />
        <JuniperoLogo />
      </>
    );
    expect(container).toMatchSnapshot();
    unmount();
  });
});
