import React from 'react';
import PropTypes from 'prop-types';

import { injectStyles, omit, classNames } from './utils';
import styles from './theme/components/Tabs.styl';

import Tab from './Tab';

class Tabs extends React.Component {

  static propTypes = {
    activeTab: PropTypes.number,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    theme: PropTypes.string,
    className: PropTypes.string,
  }

  static defaultProps = {
    activeTab: 0,
    disabled: false,
    onChange: () => {},
    theme: 'default',
  }

  state = {
    activeTab: this.props.activeTab,
  }

  constructor(props) {
    super(props);

    injectStyles(styles,
      { id: 'junipero-tabs-styles', after: '#junipero-main-styles' });
  }

  componentDidUpdate(prevProps) {
    if (this.props.activeTab !== prevProps.activeTab) {
      this.setState({
        activeTab: this.props.activeTab,
      });
    }
  }

  getTabs() {
    return React.Children
      .toArray(this.props.children)
      .filter((child) => child.type === Tab);
  }

  onTabClick(item, index, e) {
    e.preventDefault();

    if (this.props.disabled || item.props.disabled) {
      return false;
    }

    this.setState({
      activeTab: index,
    }, () => {
      this.props.onChange(index);
    });

    return false;
  }

  render() {
    const tabs = this.getTabs();
    const { theme, disabled, className, ...rest } = this.props;
    const { activeTab } = this.state;

    return (
      <div
        { ...omit(rest, [
          'activeTab', 'onChange',
        ]) }
        className={classNames(
          'junipero',
          'junipero-tabs',
          'theme-' + theme,
          { disabled },
          className,
        )}
      >
        <ul className="tabs-titles">
          { tabs.map((item, index) => (
            <li
              className={classNames(
                'tab-title',
                {
                  active: index === activeTab,
                  disabled: item.props.disabled,
                },
              )}
              key={index}
            >
              <a
                role="button"
                tabIndex={-1}
                onClick={this.onTabClick.bind(this, item, index)}
              >
                { item.props.title }
              </a>
            </li>
          )) }
        </ul>

        { tabs[activeTab] && (
          <div className="current-tab">
            { tabs[activeTab] }
          </div>
        )}
      </div>
    );
  }
}

export default Tabs;
