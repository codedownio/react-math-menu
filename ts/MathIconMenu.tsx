
import * as React from "react";

import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Popover from "@material-ui/core/Popover";
import {PopoverOrigin} from "@material-ui/core/Popover";

import Tooltip from "./Tooltip";

export interface IMathIconMenuProps {
  iconButtonElement: any;
  title: string;
  className: string;
  onButtonClick: (item, event) => void;
  button: any;
}

export interface IMathIconMenuState {
  open: boolean;
  anchor?: HTMLElement;
}

const texStyle: React.CSSProperties = {
  fontFamily: "monospace",
  float: "right",
  marginLeft: "1em"
};

const imageStyle: React.CSSProperties = {width: "24px", height: "24px"};

const textButtonContainerStyle: React.CSSProperties = {
  maxHeight: "50vh"
};

const iconButtonContainerStyle: React.CSSProperties = {
  maxWidth: (7 * 48) + "px",
  maxHeight: "50vh"
};

const outerStyle: React.CSSProperties = {
  display: "inline-block"
};

const anchorOrigin: PopoverOrigin = {horizontal: "left", vertical: "top"};
const transformOrigin: PopoverOrigin = {horizontal: "left", vertical: "bottom"};

const popoverClasses = { paper: "math-menu-paper" };

export class MathIconMenu extends React.PureComponent<IMathIconMenuProps, IMathIconMenuState> {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  onButtonClick(event) {
    this.setState({...this.state, open: true, anchor: event.currentTarget });
  }

  requestClose = () => {
    this.setState({...this.state, open: false});
  }

  getTextButtons(button) {
    let textButtons = [];

    for (let i = 0; i < button.children.length; i++) {
      let item = button.children[i];

      textButtons.push(
        <MenuItem className="math-menu-button"
                  data-title={item.tex}
                  onClick={(event) => {
                      event.preventDefault();
                      this.requestClose();
                      this.props.onButtonClick(item, event);
                  }}
                  key={i}>
            {item.name} <span className="text-span"
                              style={texStyle}>({item.tex})</span>
        </MenuItem>
      );
    }

    return textButtons;
  }

  getIconButtons(button) {
    let iconButtons = [];

    for (let i = 0; i < button.children.length; i++) {
      let item = button.children[i];

      iconButtons.push(
        <Tooltip title={item.tex}
                 key={i}>
            <IconButton className="math-menu-button"
                        data-title={item.tex}
                        onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            this.requestClose();
                            this.props.onButtonClick(item, event);
                        }}>
                <img src={item.icon}
                     style={imageStyle}/>
            </IconButton>
        </Tooltip>
      );
    }

    return iconButtons;
  }

  getPopoverContent(button) {
    if (button.type === "text") {
      return (
        <div style={textButtonContainerStyle}>
            {this.getTextButtons(button)}
        </div>
      );
    } else {
      return (
        <div style={iconButtonContainerStyle}>
            {this.getIconButtons(button)}
        </div>
      );
    }
  }

  render() {
    let button = this.props.button;

    return (
      <div className={this.props.className}
           style={outerStyle}>
          <Tooltip title={this.props.title}>
              <IconButton className="math-menu-button"
                          data-title={this.props.title}
                          onClick={(event) => this.onButtonClick(event)}>
                  {this.props.iconButtonElement}
              </IconButton>
          </Tooltip>

          <Popover className="math-menu-popover"
                   open={this.state.open}
                   anchorEl={this.state.anchor}
                   classes={popoverClasses}
                   anchorOrigin={anchorOrigin}
                   transformOrigin={transformOrigin}
                   onClose={this.requestClose}>
              {this.getPopoverContent(button)}
          </Popover>
      </div>
    );
  }
}
