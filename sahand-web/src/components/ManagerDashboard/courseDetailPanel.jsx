import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import CourseInfo from "./CourseInfo";
import cyan from '@material-ui/core/colors/cyan';
import ScheduleTable from '../../components/common/weekScheduler';
import configs from '../../configs';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import green from "@material-ui/core/colors/green";

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
    },
    buttonProgress: {
      color: green[500],
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: -12,
      marginLeft: -12
    }
  };
};

class CenteredTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      timeTable: {},
      periods: [],
      loading: false,
      timelineChanged: false,
    };
    this.handleScheduleChange = this.handleScheduleChange.bind(this);
    this.handleBtnClick = this.handleBtnClick.bind(this);
  }
  handleBtnClick(name) {
    switch (name) {
      case 'register': return () => {
        if (this.state.timelineChanged) {
          const req = axios.create({
            baseURL: configs.apiUrl,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': localStorage.getItem('access-token'),
            }
          });
          this.setState({ loading: true });
          req.patch(`/timetable/${this.props.record._id}`, this.state.periods).then(() => {
            this.setState({ loading: false });
          }).catch(() => {
            alert('خطای دسترسی به سرور');
          });
        } else {
          alert('چیزی تغییر نکرده است');
        }
      }
    }
  }

  createTimetable(timeTable) {
    let table = {
      day0: [],
      day1: [],
      day2: [],
      day3: [],
      day4: [],
      day5: [],
      day6: []
    };
    let selectedColor = ["#11ff118f"];
    timeTable.map(course => {
      let backgroundColor;
      while (
        selectedColor.indexOf((backgroundColor = this.getRandomColor())) !== -1
      );
      let periodTemplate = {
        title: course.coname,
        id: course._id,
        backgroundColor: course._id === this.props.record._id ? "#11ff118f" : backgroundColor,
        disabled: course._id !== this.props.record._id
      };
      const dayPeriods = course["periods"];
      for (let day in dayPeriods) {
        if (table[day].find(period => period.title === periodTemplate.title)) {
          table[day]["periods"] = table[day]["periods"].concat(dayPeriods[day]);
        } else {
          const newPeriod = { periods: dayPeriods[day] };
          _.merge(newPeriod, periodTemplate);
          table[day].push(newPeriod);
        }
      }
    });
    return table;
  }
  handleChange = (event, value) => {
    this.setState({ value });
  };
  getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    color += "8f";
    return color;
  }
  componentDidMount() {
    const req = axios.create({
      baseURL: configs.apiUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("access-token")
      }
    });
    const { record } = this.props;
    req.get("/timetable/" + record.class_id).then(res => {
      this.timeTable = this.createTimetable(res.data);
      this.setState({
        timeTable: this.timeTable,
      });
    });
  }
  handleScheduleChange(schedule) {

    if (schedule.length) {
      this.setState({ periods: schedule[0] ? schedule[0].periods : [], timelineChanged: true });
    } else {
      this.setState({ timelineChanged: false });
    }
  }
  render() {
    const { classes, record, waiting, onWaiting, onRegister } = this.props;
    const { value, loading } = this.state;
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
          <Tab className={classes.tabItem} label="دانش آموزان" />
          <Tab className={classes.tabItem} label="برنامه کلاسی" />
        </Tabs>
        {value === 0 && (
          <CourseInfo
            record={record}
            waiting={waiting}
            onWaiting={onWaiting}
            onRegister={onRegister}
          />
        )}
        {value === 1 &&
          <Grid
            container
            direction="column"
            alignItems="stretch"
          >
            <Grid item style={{ flexGrow: 1, marginTop: 16 }}>
              <ScheduleTable
                scheduleList={this.state.timeTable}
                title={record.coname}
                backgroundColor="#11ff118f"
                start={7}
                end={15}
                height={80}
                onChangeSchedule={this.handleScheduleChange}
              />
            </Grid>
            <Grid item style={{ flexGrow: 1, marginTop: 16, padding: 16 }}>
              <Button
                disabled={loading}
                variant="contained"
                color="secondary"
                fullWidth
                onClick={this.handleBtnClick("register")}
              >
                {loading && (
                  <CircularProgress
                    className={classes.buttonProgress}
                    size={24}
                  />
                )}
                ویرایش
        </Button>
            </Grid>
          </Grid>
        }
        {value === 2 && <h1>Item Three</h1>}
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
