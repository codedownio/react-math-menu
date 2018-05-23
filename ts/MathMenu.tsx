
import equal from "fast-deep-equal";
import * as React from "react";

import {mathMenuData} from "./MathMenuData";

import IconButton from "material-ui/IconButton";
import Tooltip from "material-ui/Tooltip";

import {MathIconMenu} from "./MathIconMenu";
import {MatrixModal} from "./MatrixModal";

import {IMathMenuItem, IMatrixItem} from "./Types";

import {getActiveJax} from "./Common";

declare var MathJax;

type SpecialCommands = "show_matrix_modal" | "not_inside_matrix";

export interface IMathMenuProps {
  mathWidgetsState: any;
  open: boolean;
  onInsertItem: (item: IMathMenuItem) => void;
  onInsertMatrix: (matrix: IMatrixItem) => void;
  style: React.CSSProperties;
}

export interface IMathMenuState {
  hasLoaded: boolean;
  matrixModalOpen: boolean;
}

export default class MathMenu extends React.Component<IMathMenuProps, IMathMenuState> {

  constructor(props) {
    super(props);

    this.state = {
      hasLoaded: false,
      matrixModalOpen: false
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (this.props.open !== nextProps.open) ||
           (this.props.style !== nextProps.style) ||
           (this.props.mathWidgetsState !== nextProps.mathWidgetsState) ||
           (!equal(this.state, nextState));
  }

  componentWillReceiveProps(nextProps) {
    // Flip the hasLoaded flag to true the first time the menu appears
    if (nextProps.open && !this.state.hasLoaded) {
      this.setState({...this.state, hasLoaded: true});
    }
  }

  getChordMessage() {
    let mathWidgetsState = this.props.mathWidgetsState;
    if (!mathWidgetsState.chordInProgress || !mathWidgetsState.currentChordOptions) return null;
    return mathWidgetsState.chordInProgress.join(" ") + " Options:  " + mathWidgetsState.currentChordOptions.join(" ");
  }

  onButtonClick(item, event) {
    event.preventDefault();

    if (item.special && (item.special === "show_matrix_modal")) {
      event.stopPropagation();
      this.showMatrixModal();
    } else {
      this.props.onInsertItem(item);
    }
  }

  getStandaloneButtons() {
    let buttons = [];

    for (let i = 0; i < mathMenuData.length; i++) {
      let button: any = mathMenuData[i];

      if (button.children) continue;

      if (MathMenu.isDisabledButton(button)) {
        // Do nothing
      } else if (button.isSeparator) {
        buttons.push(
          <div key={"separator_" + i}
               style={{
                 display: "inline-block",
                 backgroundColor: "lightgray",
                 width: "2px",
                 boxShadow: "inset 1px 0 0px 0px #f1f1f1",
                 height: "36px",
                 marginTop: "4px",
                 marginBottom: "4px",
                 lineHeight: "36px",
                 verticalAlign: "middle",
               }}>
              <div className="separator"></div>
          </div>
        );
      } else {
        buttons.push(
          <Tooltip title={button.name}
                   style={{ display: "inline-block" }}
                   key={button.name + "_" + i}>
              <IconButton onClick={(event) => this.onButtonClick(button, event)}
                          data-title={button.name}>
                  <img src={button.icon}
                       style={{width: "24px", height: "24px"}} />
              </IconButton>
          </Tooltip>
        );
      }
    }

    return buttons;
  }

  getMenuButtons() {
    let buttons = [];

    for (let i = 0; i < mathMenuData.length; i++) {
      let button: any = mathMenuData[i];
      if (!button.children) continue;

      buttons.push(
        <MathIconMenu className="math-icon-menu"
                      iconButtonElement={<img src={button.icon}
                                              style={{width: "24px", height: "24px"}} />}
                      title={button.name}
                      button={button}
                      onButtonClick={this.onButtonClick.bind(this)}
                      key={button.icon + "_" + i}>
        </MathIconMenu>
      );
    }

    return buttons;
  }

  showMatrixModal() {
    this.setState({...this.state, matrixModalOpen: true});
  }

  closeMatrixModal() {
    this.setState({...this.state, matrixModalOpen: false});
  }

  static isDisabledButton(button) {
    if (button.disabled === "not_inside_matrix") {
      return MathMenu.notInsideMatrix();
    }

    return false;
  }

  static notInsideMatrix() {
    let math = getActiveJax();
    return !math || !math.isInsideMatrix();
  }

  getStyle(): any {
    return {
      margin: 0,
      paddingLeft: "0.5em",
      paddingTop: 0,
      paddingBottom: 0,
      opacity: 1,
      transition: "opacity 0.3s 0.3s",
      visibility: this.props.open ? "visible" : "hidden",
      borderTop: "solid 2px #ddd", // @borderGray
      backgroundColor: "white",
      ...this.props.style
    };
  }

  render() {
    if (!this.state.hasLoaded) return <div></div>;

    return (
      <div className="math-menu"
           style={this.getStyle()}>
          <div className="chord-message">{this.getChordMessage()}</div>

          {this.getStandaloneButtons()}
          {this.getMenuButtons()}

          <MatrixModal open={this.state.matrixModalOpen}
                       requestClose={() => this.closeMatrixModal()}
                       onInsertMatrix={(matrix) => this.props.onInsertMatrix(matrix)} />
      </div>
    );
  }
}
