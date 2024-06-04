import {
  type MutableRefObject,
  type ComponentPropsWithRef,
  type ReactNode,
  type MouseEvent,
  Children,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  useMemo,
} from 'react';
import { type ForwardedProps, classNames } from '@junipero/core';
import PropTypes from 'prop-types';

import Tab, { type TabObject } from '../Tab';

export declare type TabsRef = {
  activeTab: number;
  tabs: Array<TabObject>;
  isJunipero: boolean;
  innerRef: MutableRefObject<HTMLDivElement>;
};

export declare interface TabsProps extends ComponentPropsWithRef<any> {
  active?: number;
  children?: ReactNode | JSX.Element;
  className?: string;
  disabled?: boolean;
  tabs?: Array<TabObject>;
  filterTab?(child: ReactNode | JSX.Element): boolean;
  onToggle?(index: number): void;
  ref?: MutableRefObject<TabsRef | undefined>;
}

const Tabs = forwardRef(({
  className,
  children,
  active,
  tabs,
  disabled = false,
  filterTab = (child: ReactNode) =>
    // @ts-ignore - String is already discarded
    typeof child !== 'string' && child.type === Tab,
  onToggle,
  ...rest
}: TabsProps, ref) => {
  const innerRef = useRef<HTMLDivElement>();
  const [activeTab, setActiveTab] = useState(active);

  useImperativeHandle(ref, () => ({
    tabs,
    activeTab,
    isJunipero: true,
    innerRef,
  }));

  useEffect(() => {
    setActiveTab(active ?? 0);
  }, [active]);

  const onClick_ = (tab: TabObject, index: number, e: MouseEvent) => {
    e?.preventDefault?.();

    if (disabled || tab.props.disabled) {
      return;
    }

    setActiveTab(index);
    onToggle?.(index);
  };

  const availableTabs = useMemo(() => (
    tabs
      ? tabs.map((t, i) => <Tab key={i} title={t.title}>{ t.content }</Tab>)
      : Children.toArray(children).filter(filterTab)
  ), [tabs, children]);

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
        { availableTabs.map((tab: JSX.Element, index: number) => (
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
        { availableTabs[activeTab] }
      </div>
    </div>
  );
}) as ForwardedProps<TabsProps, TabsRef>;

Tabs.displayName = 'Tabs';
Tabs.propTypes = {
  active: PropTypes.number,
  tabs: PropTypes.arrayOf(PropTypes.exact({
    title: PropTypes.any,
    content: PropTypes.any,
    props: PropTypes.object,
  })),
  disabled: PropTypes.bool,
  onToggle: PropTypes.func,
  filterTab: PropTypes.func,
};

export default Tabs;
