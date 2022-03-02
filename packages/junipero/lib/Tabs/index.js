import {
  Children,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { classNames } from '@poool/junipero-utils';

import Tab from '../Tab';

const Tabs = forwardRef(({
  className,
  children,
  active = 0,
  disabled = false,
  filterTab = child => child.type === Tab,
  onChange = () => {},
  ...rest
}, ref) => {
  const innerRef = useRef();
  const [activeTab, setActiveTab] = useState(active);

  useImperativeHandle(ref, () => ({
    innerRef,
    activeTab,
  }));

  useEffect(() => {
    setActiveTab(active);
  }, [active]);

  const onClick_ = (tab, index, e) => {
    e?.preventDefault?.();

    if (disabled || tab.props.disabled) {
      return;
    }

    setActiveTab(index);
    onChange(index);
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

Tabs.propTypes = {
  active: PropTypes.number,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  filterTab: PropTypes.func,
};

export default Tabs;
