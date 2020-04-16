import React, { Component } from "react";
import PropTypes from "prop-types";
import { TableCell, Typography } from "@material-ui/core";
import persian from "persian";
import jMoment from 'moment-jalaali';

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
        <TableCell>
          <Typography variant="body1">{record.grade}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1">{record.p1fname ? record.p1fname + ' ' + record.p1lname: '--------'}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1">{record.p2fname ? record.p2fname + ' ' + record.p2lname: '--------'}</Typography>
        </TableCell>
        <TableCell>
        <Typography variant="body1">{persian.toPersian(jMoment(record.modified_at).format('HH:mm jYYYY/jM/jD'))}</Typography>
          
        </TableCell>
      </React.Fragment>
    );
  }
}
StudentData.propTypes = {
  record: PropTypes.object.isRequired
};
export default StudentData;
