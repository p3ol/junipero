declare interface BreadCrumbProps extends React.ComponentPropsWithRef<any> {
  className?: string;
  children?: React.ReactNode;
  maxItems?: number;
  filterItem?: (children: React.ReactNode) => boolean;
}

declare function BreadCrumb(props: BreadCrumbProps): React.ReactNode;

export default BreadCrumb;
