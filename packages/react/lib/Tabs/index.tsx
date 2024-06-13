import {
  type MutableRefObject,
  type ComponentPropsWithoutRef,
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
import { classNames } from '@junipero/core';

import type { JuniperoRef } from '../types';
import Tab, { type TabObject } from '../Tab';

export declare interface TabsRef extends JuniperoRef {
  activeTab: number;
  tabs: Array<TabObject>;
  innerRef: MutableRefObject<HTMLDivElement>;
}

export declare interface TabsProps extends ComponentPropsWithoutRef<'div'> {
  active?: number;
  disabled?: boolean;
  tabs?: Array<TabObject>;
  filterTab?(child: ReactNode | JSX.Element): boolean;
  onToggle?(index: number): void;
}

const Tabs = forwardRef<TabsRef, TabsProps>(({
  className,
  children,
  active,
  tabs,
  disabled = false,
  filterTab = (child: ReactNode | JSX.Element) =>
    typeof child !== 'string' && (child as JSX.Element).type === Tab,
  onToggle,
  ...rest
}, ref) => {
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

  const onClick_ = (
    tab: TabObject,
    index: number,
    e: MouseEvent<HTMLAnchorElement>
  ) => {
    e?.preventDefault?.();

    if (disabled || tab.props.disabled) {
      return;
    }

    setActiveTab(index);
    onToggle?.(index);
  };

  const availableTabs = useMemo<(ReactNode | JSX.Element)[]>(() => (
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
                disabled: tab.props?.disabled,
              }
            )}
          >
            <a href="#" onClick={onClick_.bind(null, tab, index)}>
              { tab.props?.title }
            </a>
          </li>
        ))}
      </ul>

      <div className="content">
        { availableTabs[activeTab] }
      </div>
    </div>
  );
});

Tabs.displayName = 'Tabs';

export default Tabs;
