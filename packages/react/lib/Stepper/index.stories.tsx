import Stepper from './index';
import Step from '../Step';

export default { title: 'react/Stepper' };

const steps = [
  { title: 'Step 1', content: 'Description 1' },
  { title: 'Step 2', content: 'Description 2' },
  { title: 'Step 3', content: 'Description 3' },
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

export const Basic = () => (
  <>
    <Stepper active={0}>
      <Step title="Step 1">Description 1</Step>
      <Step title="Step 2">Description 2</Step>
      <Step title="Step 3">Description 3</Step>
    </Stepper>
    <Stepper active={1}>
      <Step title="Step 1">Description 1</Step>
      <Step title="Step 2">Description 2</Step>
      <Step title="Step 3">Description 3</Step>
    </Stepper>
    <Stepper active={2}>
      <Step title="Step 1">Description 1</Step>
      <Step title="Step 2">Description 2</Step>
      <Step title="Step 3">Description 3</Step>
    </Stepper>
    <Stepper active={3}>
      <Step title="Step 1">Description 1</Step>
      <Step title="Step 2">Description 2</Step>
      <Step title="Step 3">Description 3</Step>
    </Stepper>
  </>
);

export const WithStepsProp = () => (
  <>
    <Stepper
      steps={steps}
      active={0}
    />
    <Stepper
      steps={steps}
      active={1}
    />
    <Stepper
      steps={steps}
      active={2}
    />
    <Stepper
      steps={steps}
      active={3}
    />
  </>
);

export const WithDefaultIcon = () => (
  <>
    <Stepper
      steps={steps}
      active={0}
      icon={<i className="junipero-icons">check_circle</i>}
    />
    <Stepper
      steps={steps}
      active={1}
      icon={<i className="junipero-icons">check_circle</i>}
    />
    <Stepper
      steps={steps}
      active={2}
      icon={<i className="junipero-icons">check_circle</i>}
    />
    <Stepper
      steps={steps}
      active={3}
      icon={<i className="junipero-icons">check_circle</i>}
    />
  </>
);

export const WithCustomIcons = () => (
  <>
    <Stepper
      steps={stepsWithIcons}
      active={0}
    />
    <Stepper
      steps={stepsWithIcons}
      active={1}
    />
    <Stepper
      steps={stepsWithIcons}
      active={2}
    />
    <Stepper
      steps={stepsWithIcons}
      active={3}
    />
  </>
);
