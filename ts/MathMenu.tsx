
import * as React from "react";

import {mathMenuData} from "./MathMenuData";

import IconButton from "@material-ui/core/IconButton";

import Tooltip from "./Tooltip";

import {MathIconMenu} from "./MathIconMenu";
import {MatrixModal} from "./MatrixModal";

import {IMathMenuItem, IMatrixItem} from "./Types";

import {getActiveJax} from "./Common";

export interface IMathMenuProps {
  chordInProgress?: string[];
  currentChordOptions?: string[];
  onInsertItem: (item: IMathMenuItem) => void;
  onInsertMatrix: (matrix: IMatrixItem) => void;
  backgroundColor?: string;
}

export interface IMathMenuState {
  matrixModalOpen: boolean;
}

const separatorButtonStyle: React.CSSProperties = {
  display: "inline-block",
  backgroundColor: "lightgray",
  width: "2px",
  boxShadow: "inset 1px 0 0px 0px #f1f1f1",
  height: "36px",
  marginTop: "4px",
  marginBottom: "4px",
  lineHeight: "36px",
  verticalAlign: "middle",
};

const standaloneImageButtonStyle: React.CSSProperties = {width: "24px", height: "24px"};

const menuIconImageStyle: React.CSSProperties = {width: "24px", height: "24px"};

export default class MathMenu extends React.Component<IMathMenuProps, IMathMenuState> {

  constructor(props) {
    super(props);

    this.state = {
      matrixModalOpen: false
    };
  }

  shouldComponentUpdate(nextProps: IMathMenuProps, nextState: IMathMenuState) {
    return (this.props.chordInProgress !== nextProps.chordInProgress) ||
           (this.props.currentChordOptions !== nextProps.currentChordOptions) ||
           (!(this.state.matrixModalOpen === nextState.matrixModalOpen));
  }

  getChordMessage() {
    if (!this.props.chordInProgress || !this.props.currentChordOptions) return null;
    return (
      <span>
          <span className="b">{this.props.chordInProgress.join(" ")}</span>
          <span className="ml2">Options: + {this.props.currentChordOptions.join(" ")}</span>
      </span>
    );
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
               style={separatorButtonStyle}>
              <div className="separator"></div>
          </div>
        );
      } else {
        buttons.push(
          <Tooltip title={button.name}
                   key={button.name + "_" + i}>
              <IconButton onClick={(event) => this.onButtonClick(button, event)}
                          data-title={button.name}>
                  <img src={button.icon}
                       style={standaloneImageButtonStyle} />
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
                                              style={menuIconImageStyle} />}
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
      borderTop: "solid 2px #ddd", // @borderGray
      backgroundColor: this.props.backgroundColor || "white"
    };
  }

  render() {
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
