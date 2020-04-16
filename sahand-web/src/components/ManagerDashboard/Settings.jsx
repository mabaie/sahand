import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import cyan from '@material-ui/core/colors/cyan';
import ChangePassword from '../ManagerDashboard/ChangePassword.jsx';
import About from '../ManagerDashboard/About.jsx';

const styles = theme => {
  return {
    root: {
      flexGrow: 1
    },
    tab: {
      backgroundColor: cyan[200],
      textColorPrimary: "white"
    },
    tabItem: {
      textColorPrimary: "white"
    }
  };
};

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabId: 0
    };
    this.handleTabChange = this.handleTabChange.bind(this);
  }
  handleTabChange(event, value) {
    this.setState({ tabId: value });
  }
  render() {
      const { tabId } = this.state;
      const { classes } = this.props;
    return (
      <div>
          <Tabs
            value={tabId}
            onChange={this.handleTabChange}
            className={classes.tab}
            indicatorColor="secondary"
            textColor="inherit"
            centered
          >
            <Tab className={classes.tabItem} label="تغییر کلمه عبور" />
            <Tab className={classes.tabItem} label="درباره‌ی مدرسه" />
          </Tabs>
          {tabId === 0 && <ChangePassword />}
          {tabId === 1 && <About />}
      </div>
    );
  }
}
Settings.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(Settings);
