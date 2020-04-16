import React, { Component } from "react";
import PropTypes from "prop-types";
import { TableCell, Typography } from "@material-ui/core";
import jMoment from 'moment-jalaali';
import persian from 'persian'
class MagazinData extends Component {
  render() {
    const { record } = this.props;
    return (
      <React.Fragment>
        <TableCell>
          <Typography variant="body1">{record.title}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1">{persian.toPersian(jMoment(record.posted_at).format('HH:mm jYYYY/jM/jD'))}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1">{persian.toPersian(jMoment(record.modified_at).format('HH:mm jYYYY/jM/jD'))}</Typography>
        </TableCell>
      </React.Fragment>
    );
  }
}
MagazinData.propTypes = {
  record: PropTypes.object.isRequired
};
export default MagazinData;
