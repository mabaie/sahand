import React, { Component } from "react";
import PropTypes from "prop-types";
import { TableCell, Typography } from "@material-ui/core";
import persian from "persian";
import jMoment from 'moment-jalaali';
class CourseData extends Component {
  render() {
    const { record } = this.props;
    
    const year = jMoment(record.year);
    
    return (
      <React.Fragment>
        <TableCell>
          <Typography variant="body1">{record.coname}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1">{record.grade}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1">{record.cname}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1">{persian.toPersian(record.students ? record.students.length: 0)}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1">{record.tfname +' '+ record.tlname}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1">{persian.toPersian(year.jYear())+'-'+ persian.toPersian(year.jYear() + 1)}</Typography>
        </TableCell>
      </React.Fragment>
    );
  }
}
CourseData.propTypes = {
  record: PropTypes.object.isRequired
};
export default CourseData;
