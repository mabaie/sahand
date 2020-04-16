import React, { Component } from "react";
import {
  Grid,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  CircularProgress,
  FormLabel,
  FormControl,
  Typography
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import jMoment from "moment-jalaali";
import Joi from "joi-browser";
import PopMessages from "../common/PopMessages";
import green from "@material-ui/core/colors/green";
import axios from "axios";
import configs from "../../configs";
import _ from "lodash";
import ScheduleTable from "../common/weekScheduler";

const Promise = global.Promise;
const persianStringRegExp = /^[\u0621-\u0628\u062A-\u063A\u0641-\u0642\u0644-\u0648\u064E-\u0651\u0655\u067E\u0686\u0698\u06A9\u06AF\u06BE\u06CC\s]+$/;

const styles = theme => {
  return {
    root: {
      paddingLeft: theme.spacing.unit * 10,
      paddingRight: theme.spacing.unit * 10
    },
    primary: {
      rightMargin: theme.spacing.unit * 3
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

jMoment.loadPersian({ dialect: "persian-modern", usePersianDigits: true });
class AddCourseForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coname: "",
      teacher: 0,
      cname: 0,
      grade: 0,
      periods: {},
      capacity: 0,
      selected: 0,
      conameerr: true,
      data: {},

      errorMessages: [],
      loading: true,
      schedule: false,
      reload: false,
      exportData: false
    };
    this.lastSelected = 0;
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleBtnClick = this.handleBtnClick.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleErrorExit = this.handleErrorExit.bind(this);
    this.handleReload = this.handleReload.bind(this);
    this.handleExportData = this.handleExportData.bind(this);
    this.handleScheduleChange = this.handleScheduleChange.bind(this);

    this.teachers = [];
    this.classes = [];
    this.grades = [];
    this.cnames = [];
    this.timeTable = {
      day0: [],
      day1: [],
      day2: [],
      day3: [],
      day4: [],
      day5: [],
      day6: []
    };
    this.newCourseColor = "rgba(82, 155, 255, 0.5)";
  }
  componentDidMount() {
    const req = axios.create({
      baseURL: configs.apiUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("access-token")
      }
    });
    req
      .get("/classes")
      .then(res => {
        this.classes = res.data;
        console.log('class list:',res.data);
        this.grades = _.uniq(this.classes.map(obj => obj.grade)).sort(
          (x, y) => {
            switch (x) {
              case "پیش‌دبستانی": return true;
              case "اول":
                return y === "پیش‌دبستانی";
              case "دوم":
                return y === "پیش‌دبستانی" || y === "اول";
              case "سوم":
                return y === "پیش‌دبستانی" || y === "اول" || y === "دوم";
              case "چهارم":
                return y === "پیش‌دبستانی" || y !== "پنجم" && y !== "ششم";
              case "پنجم":
                return y === "پیش‌دبستانی" || y !== "ششم";
              case "ششم":
                return false;
            }
          }
        );
        this.cnames = _.uniq(
          this.classes
            .filter(e => e.grade === this.grades[this.state.grade])
            .map(obj => obj.cname)
        ).sort();
        const selected = this.classes.findIndex(
          el => el.cname === this.cnames[0] && el.grade === this.grades[0]
        );
        req
          .get("/teachers")
          .then(res => {
            this.teachers = res.data;
            req.get("/timetable/" + this.classes[selected]._id).then(res => {
              this.timeTable = this.createTimetable(res.data);
              
              this.lastSelected = selected;
              this.setState({
                loading: false,
                selected: selected
              });
            });
          })
          .catch(() => {
            this.handleError("خطای دسترسی به سرور");
          });
      })
      .catch(() => {
        this.handleError("خطای دسترسی به سرور");
      });
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
        backgroundColor: backgroundColor,
        disabled: true
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
  handleTextChange(name) {
    const validator = this.validate(name);
    return e => {
      if (name === "coname") {
        this.setState({
          [name]: e.target.value,
          [name + "err"]: validator(e.target.value)
        });
      } else if (name === "grade") {
        this.cnames = _.uniq(
          this.classes
            .filter(el => el.grade === this.grades[e.target.value])
            .map(obj => obj.cname)
        ).sort();

        this.setState(prevState => {
          const selected = this.classes.findIndex(el => {
            return (
              el.cname === this.cnames[0] &&
              el.grade === this.grades[e.target.value]
            );
          });

          return {
            grade: e.target.value,
            cname: 0,
            selected: selected,
            reload: true
          };
        });
      } else if (name === "cname") {
        this.setState(prevState => {
          const selected = this.classes.findIndex(
            el =>
              el.cname === this.cnames[e.target.value] &&
              el.grade === this.grades[prevState.grade]
          );
          return { cname: e.target.value, selected: selected, reload: true };
        });
      } else {
        this.setState({
          [name]: e.target.value
        });
      }
    };
  }
  getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    color += "8f";
    return color;
  }

  validate(name) {
    switch (name) {
      case "coname":
        return value => {
          return (
            Joi.string()
              .trim()
              .min(3)
              .max(50)
              .regex(persianStringRegExp)
              .required()
              .validate(value).error !== null
          );
        };
    }
  }
  handleBtnClick(name) {
    switch (name) {
      case "drop":
        return () => {
          this.props.onCancel();
        };
      case "register":
        return () => {
          this.register(this.state)
            .then(success => {
              this.setState(
                { exportData: true, loading: true, data: success },
                this.handleExportData(success)
              );
            })
            .catch(err => {
              for (let error of err) {
                if (error === "خطای دسترسی به سرور") {
                  this.setState({ loading: false, exportData: false });
                }
                this.handleError(error);
              }
            });
        };
    }
  }
  handleExportData(data) {
    if (data) {
      let reqData = this.getId();
      reqData["coname"] = data.Name;
      reqData["periods"] = data.Periods;
      this.post(reqData)
        .then(() => {
          this.timeTable = {};
          this.setState(
            { loading: false, exportData: false, reload: true },
            this.props.onRegister()
          );
        })
        .catch(err => {
          this.handleError("خطای دسترسی به سرور");
          this.timeTable = {};
          this.setState({ loading: false, exportData: false, reload: true });
        });
    } else {
      this.handleError("زمانی را انتخاب نکرده اید");
      this.setState({ loading: false, exportData: false });
    }
  }
  buildQuery(data) {
    const days = JSON.parse(data);
    let index = 0;
    for (let day of days) {
      for (let period of day.periods) {
        if (!this.timeTable[period.backgroundColor]) {
          this.timeTable[period.backgroundColor] = {
            [index]: [
              {
                start: new Date(moment(period.start, "hh:mm").toISOString()),
                end: new Date(moment(period.end, "hh:mm").toISOString())
              }
            ],
            _id: this.getId(period.backgroundColor)
          };
        } else {
          if (this.timeTable[period.backgroundColor][index]) {
            if (
              this.timeTable[period.backgroundColor][index].findIndex(el => {
                return (
                  new Date(el.start).getTime() ===
                    new Date(moment(period.start, "hh:mm")).getTime() &&
                  new Date(el.end).getTime() ===
                    new Date(moment(period.end, "hh:mm")).getTime()
                );
              }) === -1
            ) {
              this.timeTable[period.backgroundColor][index].push({
                start: new Date(moment(period.start, "hh:mm").toISOString()),
                end: new Date(moment(period.end, "hh:mm").toISOString())
              });
            }
          } else {
            this.timeTable[period.backgroundColor][index] = [
              {
                start: new Date(moment(period.start, "hh:mm").toISOString()),
                end: new Date(moment(period.end, "hh:mm").toISOString())
              }
            ];
          }
        }
      }
      index++;
    }
    return Object.values(this.timeTable);
  }
  getId(rgb) {
    // if(rgb === this.newCourseColor){
    return {
      class_id: this.classes[this.state.selected]._id,
      teacher_id: this.teachers[this.state.teacher]._id
    };
    //}
  }
  register(prevState) {
    let data = {
      Name: prevState.coname,
      Capacity: prevState.capacity,
      Grade: prevState.grade,
      Periods: prevState.periods
    };
    const error = {
      "نام ": prevState.conameerr,
      "ظرفیت ": prevState.capacityerr,
      "پایه ": prevState.gradeerr
    };
    return new Promise(
      function(accept, reject) {
        let returnErrors = [];
        for (let err in error) {
          if (error[err]) {
            returnErrors.push(err + "معتبر نیست");
          }
        }
        if (returnErrors.length > 0) {
          reject(returnErrors);
        } else {
          accept(data);
        }
      }.bind(this)
    );
  }
  post(data) {
    
    const req = axios.create({
      baseURL: configs.apiUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("access-token")
      }
    });
    return req.post("/course", JSON.stringify(data));
  }
  handleErrorExit(id) {
    return () => {
      this.setState(prevState => {
        prevState.errorMessages.splice(id, 1);
        return { errorMessages: prevState.errorMessages };
      });
    };
  }
  handleError(message) {
    this.setState(prevState => {
      return { errorMessages: prevState.errorMessages.concat(message) };
    });
  }
  handleReload() {
    this.setState({ reload: false });
  }
  handleScheduleChange(schedule) {
      //console.log(schedule[0]);
      this.setState({ periods: schedule[0] ? schedule[0].periods:[] });
  }
  componentDidUpdate() {
    if (this.lastSelected !== this.state.selected) {
      const req = axios.create({
        baseURL: configs.apiUrl,
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("access-token")
        }
      });
      if (this.classes[this.state.selected]) {
        req
          .get("/timetable/" + this.classes[this.state.selected]._id)
          .then(res => {
            this.timeTable = this.createTimetable(res.data);
            this.lastSelected = this.state.selected;
            this.forceUpdate();
          });
      } 
    }
  }
  render() {
    const { classes } = this.props;
    const {
      coname,
      grade,
      teacher,
      cname,
      selected,
      conameerr,

      loading
    } = this.state;
    return (
      <Paper style={{ padding: 20 }}>
        {this.state.errorMessages.map((err, id) => {
          return (
            <PopMessages
              key={id}
              message={err}
              variant="error"
              onExited={this.handleErrorExit(id)}
            />
          );
        })}
        <Grid
          container
          direction="column"
          className={classes.root}
          alignItems="stretch"
        >
          <Grid container direction="row" spacing={16} alignItems="flex-end">
            <Grid item xs={4}>
              <TextField
                className={classes.primary}
                label="نام"
                value={coname}
                onChange={this.handleTextChange("coname")}
                fullWidth
                error={conameerr}
                required
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl required fullWidth>
                <FormLabel>مدرس</FormLabel>
                <Select
                  value={teacher}
                  onChange={this.handleTextChange("teacher")}
                >
                  {this.teachers.map((teacher, index) => {
                    return (
                      <MenuItem key={index} value={index}>
                        {teacher.fname +
                          " " +
                          teacher.lname +
                          " " +
                          teacher.userName.slice(-4, -1)}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl required fullWidth>
                <FormLabel>پایه</FormLabel>
                <Select
                  value={grade}
                  onChange={this.handleTextChange("grade")}
                  fullWidth
                  required
                >
                  {this.grades.map((grade, index) => {
                    return (
                      <MenuItem key={index} value={index}>
                        {grade}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid container direction="row" spacing={16} alignItems="flex-end">
              <Grid item xs={6}>
                <FormControl required fullWidth>
                  <FormLabel>نام کلاس</FormLabel>
                  <Select
                    value={cname}
                    onChange={this.handleTextChange("cname")}
                  >
                    {this.cnames.map((cname, index) => {
                      return (
                        <MenuItem key={index} value={index}>
                          {cname}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">
                  ظرفیت:{" "}
                  {this.classes[selected] ? this.classes[selected].capacity : 0}{" "}
                  نفر
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid
            container
            direction="row"
            justify="space-between"
            className={classes.primary}
            spacing={16}
            alignItems="flex-end"
          />
          <Grid container direction="row" spacing={16} alignItems="flex-end">
            <Grid item xs={12} style={{ margin: 32 }}>
            <div>
              <ScheduleTable
                scheduleList={this.timeTable}
                title={coname}
                backgroundColor="#11ff118f"
                start={7}
                end={15}
                height={80}
                onChangeSchedule={this.handleScheduleChange}
              />
              </div>
            </Grid>
          </Grid>

          <Grid container direction="row" alignItems="stretch" spacing={16}>
            <Grid item style={{ flexGrow: 1, marginTop: 16 }}>
              <Button
                className={classes.primary}
                variant="contained"
                color="secondary"
                fullWidth
                onClick={this.handleBtnClick("drop")}
              >
                انصراف
              </Button>
            </Grid>
            <Grid item style={{ flexGrow: 1, marginTop: 16 }}>
              <Button
                disabled={loading}
                className={classes.primary}
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
                تأیید
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

AddCourseForm.propTypes = {
  classes: PropTypes.object.isRequired,
  onRegister: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onError: PropTypes.func
};

export default withStyles(styles)(AddCourseForm);
