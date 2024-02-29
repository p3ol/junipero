import { render } from '@testing-library/react';

import {
  AccessLogo,
  ConnectLogo,
  EngageLogo,
  FlowLogo,
  JuniperoLogo,
  PooolCompactCutoutLogo,
  PooolCompactLogo,
  PooolCutoutIconLogo,
  PooolCutoutLogo,
  PooolIconLogo,
  PooolLogo,
  SubscribeLogo,
} from './index';

describe('Logos', () => {
  it('should render', () => {
    const { container, unmount } = render(
      <>
        <PooolLogo />
        <PooolIconLogo />
        <PooolCutoutLogo />
        <PooolCutoutIconLogo />
        <PooolCompactLogo />
        <PooolCompactCutoutLogo />
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
