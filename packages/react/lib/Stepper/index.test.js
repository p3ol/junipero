import { render } from '@testing-library/react';

import Stepper from './';
import Step from '../Step';

describe('<Stepper />', () => {

  const steps = [
    { title: 'Step 1', description: 'Description 1' },
    { title: 'Step 2', description: 'Description 2' },
    { title: 'Step 3', description: 'Description 3' },
  ];

  const stepsWithIcons = [
    {
      title: 'Step 1',
      content: 'Description 1',
      icon: <i className="junipero-icons">add_user</i>,
    },
    {
      title: 'Step 2',
      content: 'Description 2',
      icon: <i className="junipero-icons">user_edit</i>,
    },
    {
      title: 'Step 3',
      content: 'Description 3',
      icon: <i className="junipero-icons">user_valid</i>,
    },
  ];

  it('should render steps prop with each status', () => {
    const { unmount, container } = render(
      <Stepper steps={steps} active={1} />
    );
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should render step children with each status', () => {
    const { unmount, container } = render(
      <Stepper active={1}>
        <Step title="Step 1">Description 1</Step>
        <Step title="Step 2">Description 2</Step>
        <Step title="Step 3">Description 3</Step>
      </Stepper>
    );
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should display a different icon per step', () => {
    const { unmount, container } = render(
      <Stepper
        steps={stepsWithIcons}
        active={0}
        icon={<i className="junipero-icons">check_circle</i>}
      />
    );
    expect(container).toMatchSnapshot();
    unmount();
  });
});
