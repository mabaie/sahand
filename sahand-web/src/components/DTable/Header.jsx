import React, { Component } from "react";
import { TableCell, TableRow, Typography,Checkbox } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';

import PropTypes from 'prop-types';
const styles = theme=>{
  return {
    root: {
      backgroundColor: theme.palette.common.black
    },
    items: {
      color: theme.palette.common.white 
    },
    checkbox:{
      color: theme.palette.common.white 
    }
  }
}
class Header extends Component {
  constructor(props) {
    super(props);
  }
  render(){
    const { children, classes } = this.props;
    return (
      <TableRow className={classes.root}>
        {!isWidthDown('sm', this.props.width) &&
        <TableCell padding='checkbox'>
        <Checkbox className={classes.checkbox}
        onChange={this.props.checkAll}
        />
        </TableCell>}
        {children.map((data, id)=>{
          return (
            <TableCell key={id}>
              <Typography variant="body1" className={classes.items}>{data}</Typography>
            </TableCell>
          );
        })}
      </TableRow>
    );
  }
}
Header.propTypes = {
  children: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
  checkAll: PropTypes.func.isRequired,
} 
export default compose(withWidth(),withStyles(styles))(Header);
