import React, { Component } from "react";
import PropTypes from "prop-types";
import { TableCell, Typography } from "@material-ui/core";
import persian from "persian";
class StudentData extends Component {
  render() {
    const { record } = this.props;
    return (
      <React.Fragment>
        <TableCell>
          <Typography variant="body1">{record.fname}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1">{record.lname}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1">
            {persian.toPersian(record.userName)}
          </Typography>
        </TableCell>
      </React.Fragment>
    );
  }
}
StudentData.propTypes = {
  record: PropTypes.object.isRequired
};
export default StudentData;
