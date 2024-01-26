import { ReactNode, ComponentPropsWithoutRef } from 'react';

export declare interface PaginationProps extends ComponentPropsWithoutRef<any> {
  size?: number;
  initialPage?: number;
  shouldWrap?: boolean;
  shouldWrapFrom?: number;
  onPageChange?(page: number): void;
  className?: string;
}

declare function Pagination(props: PaginationProps): ReactNode | JSX.Element;

export default Pagination;
