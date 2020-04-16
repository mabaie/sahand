import React, { Component } from "react";
import {
  Grid,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import persian from "persian";
import _ from "lodash";
import Joi from "joi-browser";
import green from "@material-ui/core/colors/green";
import axios from "axios";
import configs from "../../configs";
import PopMessages from "../common/PopMessages";

const Promise = global.Promise;
const persianStringRegExp = /^[\u0621-\u0628\u062A-\u063A\u0641-\u0642\u0644-\u0648\u064E-\u0651\u0655\u067E\u0686\u0698\u06A9\u06AF\u06BE\u06CC\s]+$/;
const nationalIdJoi = Joi.extend(joi => ({
  base: joi.string(),
  name: "string",
  rules: [
    {
      name: "isNationalId",
      validate(params, value, state, options) {
        const check = parseInt(value[9]);
        let sum = 0;
        for (let i = 0; i < 9; ++i) {
          sum += parseInt(value[i]) * (10 - i);
        }
        sum %= 11;

        if ((sum < 2 && check == sum) || (sum >= 2 && check + sum == 11)) {
          return value;
        } else {
          return this.createError(
            "string.isNationalId",
            {
              v: value
            },
            state,
            options
          );
        }
      }
    }
  ]
}));

const styles = theme => {
  return {
    root: {
      paddingLeft: theme.spacing.unit * 10,
      paddingRight: theme.spacing.unit * 10
    },
    primary: {
      marginTop: theme.spacing.unit
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

class StudentInfoForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: "",
      lname: "",
      userName: "",
      email: "",
      mobile: "",
      grade: "اول",
      birthDay: new Date().toISOString(),
      course: "بخوانیم",
      haddress: "",

      fnameerr: false,
      lnameerr: false,
      userNameerr: false,
      emailerr: false,
      mobileerr: false,
      gradeerr: false,
      birthDayerr: false,
      haddresserr: false,
      courseerr: false,

      errorMessages: [],
      loading: false,
      disable: true,
      waiting: false,

      fnameupdate: null,
      lnameupdate: null,
      userNameupdate: null,
      emailupdate: null,
      mobileupdate: null,
      gradeupdate: null,
      birthDayupdate: null,
      haddressupdate: null,
      courseupdate: null,

      password_change:false,
      password_new:''
    };
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSwitchChange = this.handleSwitchChange.bind(this);
    this.handleBtnClick = this.handleBtnClick.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  componentDidMount() {
    const { record } = this.props;
    this.datePicker = $(
      `#tdatepicker-${record._id}`
    ).persianDatepicker({
      format: "YYYY/MM/DD",
      maxDate: new Date(),
      toolbox: {
        calendarSwitch: {
          enabled: false
        }
      },
      dayPicker: {
        onSelect: date => {
          this.handleDateChange(new Date(date).toISOString());
        }
      }
    });
    this.datePicker.setDate(new Date(record.birthday).valueOf());

    this.setState(prevState => {
      return {
        _id: record._id,
        fname: record.fname,
        lname: record.lname,
        userName: record.userName,
        email: record.email,
        birthDay: new Date(record.birthday).toISOString(),
        grade: record.grade,
        mobile: "0" + record.mobile,
        course: record.course,
        haddress: record.haddress,
        disable: true,
        fnameupdate: null,
        lnameupdate: null,
        userNameupdate: null,
        emailupdate: null,
        mobileupdate: null,
        gradeupdate: null,
        birthDayupdate: null,
        courseupdate: null,
        haddressupdate: null
      };
    });
  }
  componentWillUnmount() {
    this.setState({
      fnameupdate: null,
      lnameupdate: null,
      userNameupdate: null,
      emailupdate: null,
      mobileupdate: null,
      gradeupdate: null,
      birthDayupdate: null,
      courseupdate: null,
      haddressupdate: null
    });
  }
  handleDateChange(date) {
    const validator = this.validate("birthDay");
    this.setState({
      birthDay: date,
      birthDayerr: validator(date),
      birthDayupdate: true
    });
  }
  handleTextChange(name) {
    const validator = this.validate(name);
    return e => {
      this.setState({
        [name]: e.target.value,
        [name + "err"]: validator(e.target.value),
        [name + "update"]: true
      });
    };
  }
  validate(name) {
    switch (name) {
      case "fname":
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
      case "lname":
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
      case "userName":
        return value => {
          return (
            nationalIdJoi
              .string()
              .trim()
              .min(10)
              .max(10)
              .isNationalId()
              .required()
              .validate(persian.toEnglish(value)).error !== null
          );
        };
      case "haddress":
        return value => {
          return (
            Joi.string()
              .min(6)
              .max(100)
              .validate(value).error !== null
          );
        };
      case "mobile":
        return value => {
          let number = persian.toEnglish(value);
          number = number.charAt(0) === "0" ? number.slice(1) : number;
          return (
            Joi.string()
              .regex(/^9[0-3][0-9]{8}$/)
              .required()
              .validate(number).error !== null
          );
        };
      case "email":
        return value => {
          return (
            Joi.string()
              .email({ minDomainAtoms: 2 })
              .required()
              .validate(value).error !== null
          );
        };
      case "birthDay":
        return value => {
          return (
            Joi.string()
              .isoDate()
              .required()
              .validate(value).error !== null
          );
        };
    }
  }
  handleSwitchChange(name) {
    return e => {
      this.setState({ [name]: e.target.checked, [name + "update"]: true });
    };
  }
  handleBtnClick(name) {
    switch (name) {
      case "edit":
        return () => {
          this.setState({ disable: false });
        };
      case "drop":
        return () => {
          let nextState = { disable: true };
          _.merge(nextState, this.props.record);
          let flags = {
            fnameerr: false,
            lnameerr: false,
            userNameerr: false,
            emailerr: false,
            mobileerr: false,
            gradeerr: false,
            birthDayerr: false,
            courseerr: false,
            haddresserr: false,
            fnameupdate: null,
            lnameupdate: null,
            userNameupdate: null,
            emailupdate: null,
            mobileupdate: null,
            gradeupdate: null,
            birthDayupdate: null,
            haddressupdate: null,
            courseupdate: null
          };
          _.merge(nextState, flags);
          this.setState(() => {
            return nextState;
          });
        };
      case "register":
        return () => {
          this.update(this.state)
            .then(success => {
              this.setState({
                fnameupdate: null,
                lnameupdate: null,
                userNameupdate: null,
                emailupdate: null,
                mobileupdate: null,
                gradeupdate: null,
                birthDayupdate: null,
                courseupdate: null,
                haddress: null,
                loading: false
              });
              // this.setState({loading: false});
              this.props.onRegister();
            })
            .catch(err => {
              for (let error of err) {
                // if(error === 'خطای دسترسی به سرور') {
                // }
                this.handleError(error);
              }
            });
        };
        case "ResetPassword":
            return ()=>{
              const { record } = this.props;
              const req = axios.create({
                baseURL: configs.apiUrl,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("access-token")
                }
              });
              req.post("/school/reset_password_user", 
              {
                ID: record['_id']
              }
              ).then(res=>{
                this.setState({password_change:true,password_new:res.data.password});
              }).catch (error=> {
              })
            }
    }
  }
  update(prevState) {
    let data = {
      _id: prevState._id,
      FirstName: prevState.fname,
      LastName: prevState.lname,
      ID: prevState.userName,
      Email: prevState.email,
      Mobile: prevState.mobile,
      Grade: prevState.grade,
      BirthDay: prevState.birthDay,
      Course: prevState.course,
      HomeAddress: prevState.haddress
    };
    let updateFlags = {
      FirstName: prevState.fnameupdate,
      LastName: prevState.lnameupdate,
      ID: prevState.userNameupdate,
      Email: prevState.emailupdate,
      Mobile: prevState.mobileupdate,
      Grade: prevState.gradeupdate,
      BirthDay: prevState.birthDayupdate,
      Course: prevState.courseupdate,
      HomeAddress: prevState.haddressupdate
    };
    const error = {
      "نام ": prevState.fnameerr,
      "نام خانوادگی ": prevState.lnameerr,
      "شماره ملی ": prevState.userNameerr,
      "رایانامه ": prevState.emailerr,
      "شماره‌ی همراه ": prevState.mobileerr,
      "پایه‌ی تحصیلی ": prevState.gradeerr,
      "تاریخ تولد ": prevState.birthDayerr,
      "درس ": prevState.courseerr,
      "آدرس ": prevState.haddresserr
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
          this.post(data, updateFlags)
            .then(() => {
              console.log(data);
              accept("مدیر با موفقیت ثبت شد");
            })
            .catch(err => {
              if (err === "داده ای تغییر نکرده است") {
                returnErrors.push("داده ای تغییر نکرده است");
              } else {
                returnErrors.push("خطای دسترسی به سرور");
              }
              reject(returnErrors);
            });
        }
      }.bind(this)
    );
  }
  handleError(message) {
    this.setState(prevState => {
      return { errorMessages: prevState.errorMessages.concat(message) };
    });
  }
  handleErrorExit(id) {
    return () => {
      this.setState(prevState => {
        prevState.errorMessages.splice(id, 1);
        return { errorMessages: prevState.errorMessages };
      });
    };
  }

  post(data, updateFlags) {
    return new Promise(
      function(accept, reject) {
        const req = axios.create({
          baseURL: configs.apiUrl,
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("access-token")
          }
        });
        const _id = data._id;
        delete data._id;
        data.Mobile = persian.toEnglish(data.Mobile);
        data.Mobile =
          data.Mobile.charAt(0) === "0" ? data.Mobile.slice(1) : data.Mobile;
        data.ID = persian.toEnglish(data.ID);
        let upgradedFields = {};
        for (let field in data) {
          if (updateFlags[field]) {
            upgradedFields[field] = data[field];
          }
        }
        
        if (!_.isEqual(upgradedFields, {})) {
          this.setState({ loading: true });
          console.log(upgradedFields);
          req
            .patch(`/teacher/${_id}`, JSON.stringify(upgradedFields))
            .then(() => {
              accept();
            })
            .catch(err => {
              reject(err);
            });
        } else {
          reject("داده ای تغییر نکرده است");
        }
      }.bind(this)
    );
  }
  render() {
    const { classes, waiting } = this.props;
    const {
      fname,
      lname,
      userName,
      email,
      disable,
      mobile,
      haddress,
      fnameerr,
      lnameerr,
      userNameerr,
      emailerr,
      mobileerr,
      birthDayerr,
      haddresserr,
      loading
    } = this.state;
    const {record} = this.props;
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
                disabled={disable}
                label="نام"
                value={fname}
                onChange={this.handleTextChange("fname")}
                fullWidth
                error={fnameerr}
                required
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                disabled={disable}
                label="نام خانوادگی"
                value={lname}
                onChange={this.handleTextChange("lname")}
                fullWidth
                error={lnameerr}
                required
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                disabled={disable}
                label="شماره ملی"
                value={persian.toPersian(userName)}
                onChange={this.handleTextChange("userName")}
                fullWidth
                error={userNameerr}
                required
              />
            </Grid>
          </Grid>
          <Grid container direction="row" spacing={16} alignItems="flex-end">
            <Grid item xs={4}>
              {/* <MuiPickersUtilsProvider utils={JalaliUtils} locale="fa">
                <DatePicker
                  className={classes.primary}
                  disabled={disable}
                  clearable={false}
                  label="تاریخ تولد"
                  okLabel="تأیید"
                  cancelLabel="لغو"
                  labelFunc={date => (date ? date.format("jYYYY/jMM/jDD") : "")}
                  value={jMoment(birthDay)}
                  onChange={this.handleDateChange}
                  animateYearScrolling={true}
                  disableFuture
                  fullWidth
                  error={birthDayerr}
                  required
                />
              </MuiPickersUtilsProvider> */}
              <TextField
                disabled={disable}
                className={classes.primary}
                error={birthDayerr}
                fullWidth
                required
                id={`tdatepicker-${record._id}`}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                className={classes.primary}
                disabled={disable}
                label="تلفن همراه"
                value={persian.toPersian(mobile)}
                onChange={this.handleTextChange("mobile")}
                fullWidth
                error={mobileerr}
                required
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                className={classes.primary}
                disabled={disable}
                label="رایانامه"
                value={email}
                onChange={this.handleTextChange("email")}
                fullWidth
                error={emailerr}
                required
              />
            </Grid>
          </Grid>
          <Grid container direction="row" spacing={16} alignItems="flex-end">

            <Grid item xs={12}>
              <TextField
                className={classes.primary}
                disabled={disable}
                label="آدرس"
                value={haddress}
                onChange={this.handleTextChange("haddress")}
                fullWidth
                error={haddresserr}
                required
              />
            </Grid>
            <Grid container direction="row" alignItems="stretch" spacing={16}>
              <Grid item style={{ flexGrow: 1 }}>
                <Button
                  disabled={waiting || !disable || loading}
                  className={classes.primary}
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={this.handleBtnClick("edit")}
                >
                  ویرایش
                </Button>
              </Grid>
              <Grid item style={{ flexGrow: 1 }}>
                <Button
                  disabled={waiting || disable || loading}
                  className={classes.primary}
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={this.handleBtnClick("drop")}
                >
                  لغو
                </Button>
              </Grid>
              <Grid item style={{ flexGrow: 1 }}>
                <Button
                  disabled={waiting || disable || loading}
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
                  ثبت تغییرات
                </Button>
              </Grid>
              <Grid item style={{ flexGrow: 1 }}>
                <Button
                  disabled={waiting || loading}
                  className={classes.primary}
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={this.handleBtnClick("ResetPassword")}
                >
                  {loading && (
                    <CircularProgress
                      className={classes.buttonProgress}
                      size={24}
                    />
                  )}
                  بازنشانی رمز عبور
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Dialog
          open={this.state.password_change}
          onClose={()=>{
            this.setState({password_change:false})
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"رمز عبور جدید"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {`رمز عبور جدید: ${this.state.password_new}`}
            </DialogContentText>
            <DialogContentText id="alert-dialog-description">
              {`توجه: این رمز یکبار مصرف بوده و قابل بازنشانی دوباره نیست.`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={()=>{
                this.setState({password_change:false})
              }} color="primary" autoFocus>
              بستن
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    );
  }
}

StudentInfoForm.propTypes = {
  classes: PropTypes.object.isRequired,
  record: PropTypes.object.isRequired,
  waiting: PropTypes.bool.isRequired,
  onWaiting: PropTypes.func.isRequired,
  onRegister: PropTypes.func.isRequired
};

export default withStyles(styles)(StudentInfoForm);
