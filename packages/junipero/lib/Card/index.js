import React from 'react';
import PropTypes from 'prop-types';
import { classNames } from '@poool/junipero-utils';

const Card = ({
  className,
  title,
  text,
  icon,
  illustration,
  children,
}) => {
  return (
    <div className={classNames(
      'junipero',
      'card',
      className
    )}>
      <div className="card-body">
        { icon && <img className="card-icon" src={icon}/> }
        { illustration &&
          <img className="card-illustration" src={illustration}/>
        }
        { title && <span className="card-title">{title}</span>}
        { text && <span className="card-text">{text}</span>}
        { children }
      </div>
    </div>
  );
};

export default Card;

Card.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  icon: PropTypes.string,
  illustration: PropTypes.string,
  Form: PropTypes.node,
};
