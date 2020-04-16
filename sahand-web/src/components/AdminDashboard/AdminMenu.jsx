// This file is shared across the demos.

import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ExitToApp from '@material-ui/icons/ExitToApp';
import PersonAdd from '@material-ui/icons/PersonAdd';
import { List } from "@material-ui/core";
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

class Logout extends React.Component{
  handleLogout() {
    localStorage.removeItem('access-token');
    this.props.history.push('/sahand/');
  }
  render () {
    return (<Button onClick={this.handleLogout.bind(this)} style={{marginRight : '6px'}}>{this.props.children}</Button>);
  }
}
Logout.propTypes = {
  history: PropTypes.object.isRequired,
  children: PropTypes.array.isRequired,
}
let LogoutWrapper = withRouter(Logout);

export default function AdminMenu(props) {
  return (
    <List>
      <ListItem button component={Link} to='/sahand/admin/dashboard/managers'>
        <ListItemIcon>
          <PersonAdd />
        </ListItemIcon>
        <ListItemText primary="لیست مدیران" />
      </ListItem>
      <ListItem button component={LogoutWrapper}>
        <ListItemIcon>
          <ExitToApp />
        </ListItemIcon>
        <ListItemText primary="خروج" />
      </ListItem>
    </List>
  );
}
