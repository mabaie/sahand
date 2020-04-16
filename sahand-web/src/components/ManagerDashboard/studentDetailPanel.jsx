import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import StudentInfo from "./StudentInfo";
import ParentInfo from "./ParentInfo";
import cyan from '@material-ui/core/colors/cyan';

const styles = theme => {
  return {
    root: {
      flexGrow: 1
    },
    tab: {
      backgroundColor: cyan[200],
      textColorPrimary: 'white',
    },
    tabItem: {
        textColorPrimary: 'white',
    }
  };
};

class CenteredTabs extends React.Component {
  state = {
    value: 0
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes, record, waiting, onWaiting, onRegister } = this.props;
    const { value } = this.state;
    return (
      <React.Fragment>
        <Tabs
          value={value}
          onChange={this.handleChange}
          className={classes.tab}
          indicatorColor="secondary"
          textColor="inherit"
          centered
        >
          <Tab className={classes.tabItem} label="مشخصات دانش‌آموز" />
          <Tab className={classes.tabItem} label="مشخصات سرپرست اول" />
          {record.p2_id && <Tab className={classes.tabItem} label="مشخصات سرپرست دوم" />}
        </Tabs>
        {value === 0 && (
          <StudentInfo
            record={record}
            waiting={waiting}
            onWaiting={onWaiting}
            onRegister={onRegister}
          />
        )}
        {value === 1 && <ParentInfo
            record={record}
            waiting={waiting}
            onWaiting={onWaiting}
            onRegister={onRegister}
            name={'p1'}
          />}
        {value === 2 && <ParentInfo
            record={record}
            waiting={waiting}
            onWaiting={onWaiting}
            onRegister={onRegister}
            name={'p2'}
          />}
      </React.Fragment>
    );
  }
}

CenteredTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  record: PropTypes.object.isRequired,
  waiting: PropTypes.bool.isRequired,
  onWaiting: PropTypes.func.isRequired,
  onRegister: PropTypes.func.isRequired
};

export default withStyles(styles)(CenteredTabs);
