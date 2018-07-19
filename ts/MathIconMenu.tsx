
import * as React from "react";

import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Popover from "@material-ui/core/Popover";
import Tooltip from "@material-ui/core/Tooltip";

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

export class MathIconMenu extends React.PureComponent<IMathIconMenuProps, IMathIconMenuState> {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  onButtonClick(event) {
    this.setState({...this.state, open: true, anchor: event.currentTarget });
  }

  requestClose() {
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
                              style={{
                                fontFamily: "monospace",
                                float: "right",
                                marginLeft: "1em"
                              }}>({item.tex})</span>
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
                     style={{width: "24px", height: "24px"}}/>
            </IconButton>
        </Tooltip>
      );
    }

    return iconButtons;
  }

  getPopoverContent(button) {
    if (button.type === "text") {
      return (
        <div style={{
          maxHeight: "50vh"
        }}>
            {this.getTextButtons(button)}
        </div>
      );
    } else {
      return (
        <div style={{
          maxWidth: (7 * 48) + "px",
          maxHeight: "50vh"
        }}>
            {this.getIconButtons(button)}
        </div>
      );
    }
  }

  render() {
    let button = this.props.button;

    return (
      <div className={this.props.className}
           style={{
             display: "inline-block"
           }}>
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
                   classes={{
                     paper: "math-menu-paper"
                   }}
                   anchorOrigin={{horizontal: "left", vertical: "top"}}
                   transformOrigin={{horizontal: "left", vertical: "bottom"}}
                   onClose={(event) => this.requestClose()}>
              {this.getPopoverContent(button)}
          </Popover>
      </div>
    );
  }
}
