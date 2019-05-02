
import * as React from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

import {IMatrixItem} from "./Types";

// Use require instead of import here because this needs to work with a Gatsby app, which doesn't
// always understand ES6 imports (see https://github.com/gatsbyjs/gatsby/issues/2641)
const NumericInput = require("react-numeric-input");

export interface IMatrixModalProps {
  requestClose: () => void;
  onInsertMatrix: (matrix: IMatrixItem) => void;
  open: boolean;
}

export interface IMatrixModalState {
  decoration: string;
  rows: number;
  columns: number;
}

const formControlStyle: React.CSSProperties = {width: "100%"};
const selectInputProps = {
  name: "decoration",
  id: "decoration",
};

export class MatrixModal extends React.PureComponent<IMatrixModalProps, IMatrixModalState> {

  static decorationOptions = ["None", "[x]", "(x)", "{x}", "|x|", "||x||"];

  constructor(props) {
    super(props);

    this.state = {
      rows: 2,
      columns: 2,
      decoration: "[x]",
    };
  }

  doInsert = () => {
    let command = "matrix";

    let decoration = this.state.decoration;

    if (decoration === "[x]") {
      command = "bmatrix";
    } else if (decoration === "(x)") {
      command = "pmatrix";
    } else if (decoration === "{x}") {
      command = "Bmatrix";
    } else if (decoration === "|x|") {
      command = "vmatrix";
    } else if (decoration === "||x||") {
      command = "Vmatrix";
    }

    this.props.onInsertMatrix({
      rows: this.state.rows,
      columns: this.state.columns,
      command
    });

    this.props.requestClose();
  }

  getDecorationOptions() {
    let items = [];

    for (let option of MatrixModal.decorationOptions) {
      items.push(
        <MenuItem className="decoration-option"
                  data-option-value={option}
                  value={option}
                  key={option}>
            {option}
        </MenuItem>
      );
    }

    return items;
  }

  handleRowsChange = (valueAsNumber, valueAsString, input) => this.setState({...this.state, rows: valueAsNumber});
  handleColumnsChange = (valueAsNumber, valueAsString, input) => this.setState({...this.state, columns: valueAsNumber});

  handleDecorationChange = (event) => this.setState({...this.state, decoration: event.target.value});

  render() {
    return (
      <Dialog className="matrix-modal"
              open={this.props.open}>
          <DialogTitle>Insert matrix</DialogTitle>

          <DialogContent>
              <div>
                  <h3>Rows</h3>
                  <NumericInput className="rows-input"
                                value={this.state.rows}
                                onChange={this.handleRowsChange} />

                  <br />

                  <h3>Columns</h3>
                  <NumericInput className="columns-input"
                                value={this.state.columns}
                                onChange={this.handleColumnsChange} />
              </div>

              <h3>Decoration</h3>
              <FormControl style={formControlStyle}>
                  <Select className="decoration-select"
                          inputProps={selectInputProps}
                          value={this.state.decoration}
                          onChange={this.handleDecorationChange}>
                      {this.getDecorationOptions()}
                  </Select>
              </FormControl>
          </DialogContent>

          <DialogActions>
              <Button className=""
                      onClick={this.props.requestClose}>Cancel</Button>
              <Button className="confirm-button"
                      color="primary"
                      onClick={this.doInsert}>Insert</Button>
          </DialogActions>
      </Dialog>
    );
  }
}
