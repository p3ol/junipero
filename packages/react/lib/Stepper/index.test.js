import { render } from '@testing-library/react';

import Stepper from './';

describe('<Stepper />', () => {

  const steps = [
    { title: 'Step 1', description: 'Description 1' },
    { title: 'Step 2', description: 'Description 2' },
    { title: 'Step 3', description: 'Description 3' },
  ];

  it('should render', () => {
    const { unmount, container } = render(
      <Stepper steps={steps} currentStep={0} />
    );
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should display an icon if the parameter is passed', () => {
    const { unmount, container } = render(
      <Stepper
        steps={steps}
        currentStep={0}
        icon={<i className="junipero-icons">check_circle</i>}
      />
    );
    expect(container).toMatchSnapshot();
    unmount();
  });
});
