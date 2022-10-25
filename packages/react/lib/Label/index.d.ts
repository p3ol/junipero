import React from "react";

declare interface LabelProps extends React.ComponentPropsWithoutRef<any> {
  className?: String;
}

declare function Label(props: LabelProps): JSX.Element;

export default Label;
