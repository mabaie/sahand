import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import {
  Grid,
  IconButton,
  Typography,
  Select,
  MenuItem
} from "@material-ui/core";
import LastPage from "@material-ui/icons/LastPage";
import FirstPage from "@material-ui/icons/FirstPage";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";

import persian from "persian";

const styles = {};

class Pagination extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleClick = this.handleClick.bind(this);
    this.handleRowsPerPageChange = this.handleRowsPerPageChange.bind(this);
  }
  handleClick(name, prevProps) {
    const { page, totalPages } = prevProps;
    const onPageChange = this.props.onPageChange;
    return () => {
      let nextPage;
      switch (name) {
        case "first":
          nextPage = 1;
          break;
        case "next":
          nextPage = (page % totalPages) + 1;
          break;
        case "prev":
          nextPage = page - 1 === 0 ? totalPages : page - 1;
          break;
        case "last":
          nextPage = totalPages;
          break;
        default:
          nextPage = 1;
          break;
      }
      onPageChange(nextPage);
    };
  }
  handleRowsPerPageChange(e) {
    this.props.onRowsPerPageChange(e.target.value);
  }
  render() {
    let prevProps = { totalPages: 0 };
    Object.assign(prevProps, this.props);
    prevProps.totalPages = Math.ceil(
      this.props.totalRows / this.props.rowsPerPage
    );
    const { disabled, waiting } = this.props;
    return (
      <Grid container justify="center" alignItems="center">
        <Select
          disabled={waiting}
          value={prevProps.rowsPerPage}
          onChange={this.handleRowsPerPageChange}
        >
          <MenuItem value={10}>{persian.toPersian(10)}</MenuItem>
          <MenuItem value={20}>{persian.toPersian(20)}</MenuItem>
          <MenuItem value={30}>{persian.toPersian(30)}</MenuItem>
        </Select>
        <IconButton
          disabled={waiting || disabled.last}
          onClick={this.handleClick("last", prevProps)}
        >
          <LastPage />
        </IconButton>
        <IconButton
          disabled={waiting || disabled.next}
          onClick={this.handleClick("next", prevProps)}
        >
          <ChevronRight />
        </IconButton>
        <Typography variant="body2">
          {persian.toPersian(prevProps.page)} از{" "}
          {persian.toPersian(prevProps.totalPages)}
        </Typography>
        <IconButton
          disabled={waiting || disabled.prev}
          onClick={this.handleClick("prev", prevProps)}
        >
          <ChevronLeft />
        </IconButton>
        <IconButton
          disabled={waiting || disabled.first}
          onClick={this.handleClick("first", prevProps)}
        >
          <FirstPage />
        </IconButton>
      </Grid>
    );
  }
}
Pagination.propTypes = {
  classes: PropTypes.object.isRequired,
  totalRows: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func.isRequired,
  disabled: PropTypes.object.isRequired,
  waiting: PropTypes.bool.isRequired
};
export default withStyles(styles)(Pagination);
