import {
  type RefObject,
  type ReactNode,
  type MouseEvent,
  type ReactElement,
  Children,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  useMemo,
} from 'react';
import { classNames } from '@junipero/core';

import type { JuniperoRef, SpecialComponentPropsWithRef } from '../types';
import Tab, { TabProps, type TabObject } from '../Tab';

export declare interface TabsRef extends JuniperoRef {
  activeTab: number;
  tabs: Array<TabObject>;
  innerRef: RefObject<HTMLDivElement>;
}

export declare interface TabsProps extends Omit<
  SpecialComponentPropsWithRef<'div', TabsRef>,
  'onToggle'
> {
  active?: number;
  disabled?: boolean;
  tabs?: Array<TabObject>;
  filterTab?(child: ReactElement | ReactNode): boolean;
  onToggle?(index: number): void;
}

const Tabs = ({
  ref,
  className,
  children,
  active,
  tabs,
  disabled = false,
  filterTab = (child: ReactElement) =>
    typeof child !== 'string' && child.type === Tab,
  onToggle,
  ...rest
}: TabsProps) => {
  const innerRef = useRef<HTMLDivElement>(null);
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

  const availableTabs = useMemo<ReactNode[]>(() => (
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
        { availableTabs.map((tab: ReactElement<TabProps>, index: number) => (
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
        )) }
      </ul>

      <div className="content">
        { availableTabs[activeTab] }
      </div>
    </div>
  );
};

Tabs.displayName = 'Tabs';

export default Tabs;
