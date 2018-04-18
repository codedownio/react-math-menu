
import * as React from "react";

import Button from "material-ui/Button";
import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from "material-ui/Dialog";
import {FormControl, FormControlLabel, FormGroup} from "material-ui/Form";
import {InputLabel} from "material-ui/Input";
import {MenuItem} from "material-ui/Menu";
import Select from "material-ui/Select";

import {getActiveJax} from "./Common";

import NumericInput from "react-numeric-input";

export interface IMatrixModalProps {
  requestClose: () => void;
  open: boolean;
}

export interface IMatrixModalState {
  decoration: string;
  rows: number;
  columns: number;
}

export class MatrixModal extends React.PureComponent<IMatrixModalProps, IMatrixModalState> {

  static decorationOptions = ["None", "[x]", "(x)", "{x}", "|x|", "||x||"];

  constructor(props) {
    super(props);

    this.state = {
      rows: 1,
      columns: 1,
      decoration: "None",
    };
  }

  doInsert() {
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

    let math = getActiveJax();
    if (!math) return;

    math.insertMatrixAtCursor(this.state.rows, this.state.columns, command);

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
                                onChange={(valueAsNumber, valueAsString, input) => this.setState({...this.state, rows: valueAsNumber})} />

                  <br />

                  <h3>Columns</h3>
                  <NumericInput className="columns-input"
                                value={this.state.columns}
                                onChange={(valueAsNumber, valueAsString, input) => this.setState({...this.state, columns: valueAsNumber})} />
              </div>

              <h3>Decoration</h3>
              <FormControl style={{width: "100%"}}>
                  <Select className="decoration-select"
                          inputProps={{
                            name: "decoration",
                            id: "decoration",
                          }}
                          value={this.state.decoration}
                          onChange={(event) => this.setState({...this.state, decoration: event.target.value})}>
                      {this.getDecorationOptions()}
                  </Select>
              </FormControl>
          </DialogContent>

          <DialogActions>
              <Button className=""
                      onClick={(event) => this.props.requestClose()}>Cancel</Button>
              <Button className="confirm-button"
                      color="primary"
                      onClick={(event) => this.doInsert()}>Insert</Button>
          </DialogActions>
      </Dialog>
    );
  }
}
