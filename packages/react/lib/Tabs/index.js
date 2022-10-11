import {
  Children,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { classNames } from '@junipero/core';

import Tab from '../Tab';

const Tabs = forwardRef(({
  className,
  children,
  active,
  disabled = false,
  filterTab = child => child.type === Tab,
  onToggle,
  ...rest
}, ref) => {
  const innerRef = useRef();
  const [activeTab, setActiveTab] = useState(active);

  useImperativeHandle(ref, () => ({
    innerRef,
    activeTab,
    isJunipero: true,
  }));

  useEffect(() => {
    setActiveTab(active ?? 0);
  }, [active]);

  const onClick_ = (tab, index, e) => {
    e?.preventDefault?.();

    if (disabled || tab.props.disabled) {
      return;
    }

    setActiveTab(index);
    onToggle?.(index);
  };

  const tabs = Children.toArray(children).filter(filterTab);

  return (
    <div
      { ...rest }
      ref={innerRef}
      className={classNames(
        'junipero',
        'tabs',
        className,
      )}
    >
      <ul className="titles">
        { tabs.map((tab, index) => (
          <li
            key={index}
            className={classNames(
              'title',
              {
                active: index === activeTab,
                disabled: tab.props.disabled,
              }
            )}
          >
            <a href="#" onClick={onClick_.bind(null, tab, index)}>
              { tab.props.title }
            </a>
          </li>
        ))}
      </ul>

      <div className="content">
        { tabs[activeTab] }
      </div>
    </div>
  );
});

Tabs.displayName = 'Tabs';
Tabs.propTypes = {
  active: PropTypes.number,
  disabled: PropTypes.bool,
  onToggle: PropTypes.func,
  filterTab: PropTypes.func,
};

export default Tabs;
