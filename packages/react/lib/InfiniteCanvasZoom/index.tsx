import {
  MouseEvent,
  RefObject,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';

import type { SpecialComponentPropsWithRef } from '../types';
import { useInfiniteCanvas } from '../hooks';
import Dropdown, {
  type DropdownProps,
  type DropdownRef,
} from '../Dropdown';
import DropdownToggle from '../DropdownToggle';
import DropdownMenu from '../DropdownMenu';
import DropdownItem from '../DropdownItem';
import Button from '../Button';

export interface InfiniteCanvasZoomRef {
  innerRef: RefObject<DropdownRef>;
  isJunipero: boolean;
}

export declare interface InfiniteCanvasZoomProps extends
  SpecialComponentPropsWithRef<any, InfiniteCanvasZoomRef>,
  Omit<DropdownProps, 'innerRef' | 'ref'> {
  fitIntoViewText?: string;
  zoomInText?: string;
  zoomOutText?: string;
  zoom100Text?: string;
  zoom200Text?: string;
  zoom50Text?: string;
}

const InfiniteCanvasZoom = ({
  ref,
  fitIntoViewText = 'Fit into View',
  zoomInText = 'Zoom In',
  zoomOutText = 'Zoom Out',
  zoom100Text = '100%',
  zoom200Text = '200%',
  zoom50Text = '50%',
  children,
  ...rest
}: InfiniteCanvasZoomProps) => {
  const dropdownRef = useRef<DropdownRef>(null);
  const { zoom, fitIntoView, setZoom, zoomIn, zoomOut } = useInfiniteCanvas();
  const value = useMemo(() => (
    Math.round((zoom || 1) * 100) + '%'
  ), [zoom]);

  useImperativeHandle(ref, () => ({
    innerRef: dropdownRef,
    isJunipero: true,
  }), []);

  const prevent = (cb: () => void) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dropdownRef.current?.close();
    cb();
  };

  return (
    <Dropdown placement="top-end" { ...rest } ref={dropdownRef}>
      <DropdownToggle>
        <Button type="button">
          { value }
        </Button>
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem>
          <a onClick={prevent(fitIntoView.bind(null, 200))}>
            { fitIntoViewText }
          </a>
        </DropdownItem>
        <DropdownItem>
          <a onClick={prevent(setZoom.bind(null, 2, 200))}>
            { zoom200Text }
          </a>
        </DropdownItem>
        <DropdownItem>
          <a onClick={prevent(setZoom.bind(null, 1, 200))}>
            { zoom100Text }
          </a>
        </DropdownItem>
        <DropdownItem>
          <a onClick={prevent(setZoom.bind(null, 0.5, 200))}>
            { zoom50Text }
          </a>
        </DropdownItem>
        <DropdownItem>
          <a onClick={prevent(zoomIn.bind(null, 200))}>
            { zoomInText }
          </a>
        </DropdownItem>
        <DropdownItem>
          <a onClick={prevent(zoomOut.bind(null, 200))}>
            { zoomOutText }
          </a>
        </DropdownItem>

        { children }
      </DropdownMenu>
    </Dropdown>
  );
};

InfiniteCanvasZoom.displayName = 'InfiniteCanvasZoom';

export default InfiniteCanvasZoom;
