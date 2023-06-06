import Stepper from './index';

export default { title: 'react/Stepper' };

const steps = [
  { title: 'Step 1', description: 'Description 1' },
  { title: 'Step 2', description: 'Description 2' },
  { title: 'Step 3', description: 'Description 3' },
];

export const basic = () => (
  <Stepper
    steps={steps}
    currentStep={1}
  />
);

export const withIcon = () => (
  <Stepper
    steps={steps}
    currentStep={1}
    icon={<i className="junipero-icons">check_circle</i>}
  />
);
