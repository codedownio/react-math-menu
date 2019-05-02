/**
 * Wrapper around Material UI tooltip, adding some custom styling.
 */

import * as Tooltip from "@material-ui/core/Tooltip";

import * as React from "react";

interface ITooltipProps {
  title: string;
  children: any;
  placement?:
       | "bottom-end"
       | "bottom-start"
       | "bottom"
       | "left-end"
       | "left-start"
       | "left"
       | "right-end"
       | "right-start"
       | "right"
       | "top-end"
       | "top-start"
       | "top";
}

const popperClasses = {popper: "tooltip-popper", tooltip: "tooltip-text"};
const popperProps = {
  style: {opacity: 1}
};

export default class CustomTooltip extends React.PureComponent<ITooltipProps, {}> {

  render() {
    return (
      <Tooltip.default title={this.props.title}
                       placement={this.props.placement}
                       classes={popperClasses}
                       PopperProps={popperProps}>
          {this.props.children}
      </Tooltip.default>
    );
  }
}
