import { Fragment } from 'react';
import { classNames } from '@junipero/react';
import PropTypes from 'prop-types';

const Stepper = ({ currentStep, steps = [], icon, ...rest }) => {
  return (
    <div {...rest}>
      <div className="junipero stepper">
        { Object.values(steps).map((step, index) => (
          <Fragment key={index}>
            <div className="step">
              <div
                className={classNames(
                  'circle',
                  index === currentStep && 'active',
                  index < currentStep && 'completed',
                  icon && 'with-icon',
                )}
              >
                { index < currentStep && icon}
              </div>
              <div className={classNames(
                'details',
                index === currentStep && 'active',
                index < currentStep && 'completed',
              )}
              >
                <span>{ step.title }</span>
                <span className="name">{ step.description }</span>
              </div>
            </div>
            <span className="divider" />
          </Fragment>
        ))}
      </div>
    </div>
  );
};

Stepper.displayName = 'Stepper';
Stepper.propTypes = {
  currentStep: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  steps: PropTypes.arrayOf(PropTypes.object),
  icon: PropTypes.node,
};

export default Stepper;
