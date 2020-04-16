import React, { Component } from "react";
import {
  Grid,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  Switch,
  Typography,
  CircularProgress
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import MuiPickersUtilsProvider from "material-ui-pickers/MuiPickersUtilsProvider";
import JalaliUtils from "material-ui-pickers-jalali-utils";
import jMoment from "moment-jalaali";
import persian from "persian";
//import { DatePicker } from "material-ui-pickers";
import _ from "lodash";
import Joi from "joi-browser";
import green from "@material-ui/core/colors/green";
import axios from "axios";
import configs from "../../configs";
import PopMessages from "../common/PopMessages";

const Promise = global.Promise;
const persianStringRegExp = /^[\u0621-\u0628\u062A-\u063A\u0641-\u0642\u0644-\u0648\u064E-\u0651\u0655\u067E\u0686\u0698\u06A9\u06AF\u06BE\u06CC\s]+$/;
const persianAlphaNum = /^[\u0621-\u0628\u062A-\u063A\u0641-\u0642\u0644-\u0648\u064E-\u0651\u0655\u067E\u0686\u0698\u06A9\u06AF\u06BE\u06CC\s\u06F0-\u06F9]+$/;
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
class ManagerInfoForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: "",
      lname: "",
      userName: "",
      faname: "",
      email: "",
      mobile: "",
      address: "",
      degree: "زیر دیپلم",
      major: "",
      birthDay: jMoment(),
      sname: "",
      stype: "دبستان",

      fnameerr: false,
      lnameerr: false,
      userNameerr: false,
      fanameerr: false,
      emailerr: false,
      mobileerr: false,
      addresserr: false,
      degreeerr: false,
      majorerr: false,
      birthDayerr: false,
      snameerr: false,
      stypeerr: false,

      errorMessages: [],
      loading: false,
      canLogin: false,
      isActive: false,
      disable: true,
      waiting: false,

      fnameupdate: null,
      lnameupdate: null,
      userNameupdate: null,
      fanameupdate: null,
      emailupdate: null,
      mobileupdate: null,
      addressupdate: null,
      degreeupdate: null,
      majorupdate: null,
      birthDayupdate: null,
      snameupdate: null,
      stypeupdate: null,
      canLoginupdate: null,
      isActiveupdate: null
    };
    this.datePicker = null;
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSwitchChange = this.handleSwitchChange.bind(this);
    this.handleBtnClick = this.handleBtnClick.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  componentDidMount() {
    const { record } = this.props;
    this.datePicker = $(
      `#tdatepicker`
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
    this.setState(prevState => {
      return {
        _id: record._id,
        fname: record.fname,
        lname: record.lname,
        userName: record.userName,
        faname: record.faname,
        email: record.email,
        canLogin: record.canLogin,
        isActive: record.isActive,
        birthDay: record.birthday,
        degree: record.degree,
        mobile: "0" + record.mobile,
        address: record.address,
        major: record.major,
        sname: record.sname,
        stype: record.stype,
        disable: true,
        fnameupdate: null,
        lnameupdate: null,
        userNameupdate: null,
        fanameupdate: null,
        emailupdate: null,
        mobileupdate: null,
        addressupdate: null,
        degreeupdate: null,
        majorupdate: null,
        birthDayupdate: null,
        snameupdate: null,
        stypeupdate: null,
        canLoginupdate: null,
        isActiveupdate: null
      };
    });
    this.datePicker.setDate(new Date(this.state.birthDay).valueOf());
  }
  componentWillUnmount() {
    this.setState({
      fnameupdate: null,
      lnameupdate: null,
      userNameupdate: null,
      fanameupdate: null,
      emailupdate: null,
      mobileupdate: null,
      addressupdate: null,
      degreeupdate: null,
      majorupdate: null,
      birthDayupdate: null,
      snameupdate: null,
      stypeupdate: null,
      canLoginupdate: null,
      isActiveupdate: null
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
      case "faname":
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
      case "sname":
        return value => {
          return (
            Joi.string()
              .trim()
              .min(3)
              .max(50)
              .regex(persianAlphaNum)
              .required()
              .validate(persian.toPersian(value)).error !== null
          );
        };
      case "stype":
        return value => {
          return (
            Joi.string()
              .trim()
              .valid("دبستان", "متوسطه‌ی اول", "متوسطه‌ی دوم")
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
      case "degree":
        return value => {
          return (
            Joi.string()
              .trim()
              .valid("زیر دیپلم", "دیپلم", "کارشناسی", "کارشناسی ارشد", "دکتری")
              .validate(value).error !== null
          );
        };
      case "major":
        return value => {
          return (
            Joi.string()
              .trim()
              .min(3)
              .max(50)
              .regex(persianStringRegExp)
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
      case "address":
        return value => {
          return (
            Joi.string()
              .min(6)
              .max(100)
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
              .validate(jMoment(value).toISOString()).error !== null
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
            fanameerr: false,
            emailerr: false,
            mobileerr: false,
            addresserr: false,
            degreeerr: false,
            majorerr: false,
            birthDayerr: false,
            snameerr: false,
            stypeerr: false,
            fnameupdate: null,
            lnameupdate: null,
            userNameupdate: null,
            fanameupdate: null,
            emailupdate: null,
            mobileupdate: null,
            addressupdate: null,
            degreeupdate: null,
            majorupdate: null,
            birthDayupdate: null,
            snameupdate: null,
            stypeupdate: null,
            canLoginupdate: null,
            isActiveupdate: null
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
                fanameupdate: null,
                emailupdate: null,
                mobileupdate: null,
                addressupdate: null,
                degreeupdate: null,
                majorupdate: null,
                birthDayupdate: null,
                snameupdate: null,
                stypeupdate: null,
                canLoginupdate: null,
                isActiveupdate: null,
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
    }
  }
  update(prevState) {
    let data = {
      _id: prevState._id,
      FirstName: prevState.fname,
      LastName: prevState.lname,
      ID: prevState.userName,
      FatherName: prevState.faname,
      Email: prevState.email,
      Mobile: prevState.mobile,
      Address: prevState.address,
      EducationalDegree: prevState.degree,
      Major: prevState.major,
      BirthDay: prevState.birthDay,
      CanLogin: prevState.canLogin,
      IsActive: prevState.isActive,
      SchoolName: prevState.sname,
      SchoolType: prevState.stype
    };
    let updateFlags = {
      FirstName: prevState.fnameupdate,
      LastName: prevState.lnameupdate,
      ID: prevState.userNameupdate,
      FatherName: prevState.fanameupdate,
      Email: prevState.emailupdate,
      Mobile: prevState.mobileupdate,
      Address: prevState.addressupdate,
      EducationalDegree: prevState.degreeupdate,
      Major: prevState.majorupdate,
      BirthDay: prevState.birthDayupdate,
      CanLogin: prevState.canLoginupdate,
      IsActive: prevState.isActiveupdate,
      SchoolName: prevState.snameupdate,
      SchoolType: prevState.stypeupdate
    };
    const error = {
      "نام ": prevState.fnameerr,
      "نام خانوادگی ": prevState.lnameerr,
      "شماره ملی ": prevState.userNameerr,
      "نام پدر ": prevState.fanameerr,
      "رایانامه ": prevState.emailerr,
      "شماره‌ی همراه ": prevState.mobileerr,
      "آدرس ": prevState.addresserr,
      "مدرک تحصیلی ": prevState.degreeerr,
      "رشته تحصیلی ": prevState.majorerr,
      "تاریخ تولد ": prevState.birthDayerr,
      "نام مدرسه ": prevState.snameerr,
      "نوع مدرسه ": prevState.stypeerr,

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
        data.BirthDay = jMoment(data.BirthDay)
          .utc()
          .toISOString();
        data.SchoolName = persian.toEnglish(data.SchoolName);
        
        let upgradedFields = {};
        for (let field in data) {
          if (updateFlags[field]) {
            upgradedFields[field] = data[field];
          }
        }
        
        if (!_.isEqual(upgradedFields, {})) {
          this.setState({ loading: true });
          req
            .patch(`/manager/${_id}`, JSON.stringify(upgradedFields))
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
      birthDay,
      fname,
      lname,
      faname,
      userName,
      address,
      email,
      disable,
      mobile,
      degree,
      major,
      sname,
      stype,
      fnameerr,
      lnameerr,
      userNameerr,
      fanameerr,
      emailerr,
      mobileerr,
      addresserr,
      degreeerr,
      majorerr,
      snameerr,
      stypeerr,
      birthDayerr,
      canLogin,
      isActive,
      loading
    } = this.state;
    console.log(birthDay);
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
              <TextField
                disabled={disable}
                className={classes.primary}
                label="نام پدر"
                value={faname}
                onChange={this.handleTextChange("faname")}
                fullWidth
                error={fanameerr}
                required
              />
            </Grid>
            <Grid item xs={4}>
              <Select
                className={classes.primary}
                disabled={disable}
                value={degree}
                onChange={this.handleTextChange("degree")}
                fullWidth
                error={degreeerr}
                required
              >
                <MenuItem value="زیر دیپلم">زیر دیپلم</MenuItem>
                <MenuItem value="دیپلم">دیپلم</MenuItem>
                <MenuItem value="کارشناسی">کارشناسی</MenuItem>
                <MenuItem value="کارشناسی ارشد">کارشناسی ارشد</MenuItem>
                <MenuItem value="دکتری">دکتری</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={4}>
              <TextField
                disabled={disable}
                className={classes.primary}
                label="رشته ی تحصیلی"
                value={major}
                onChange={this.handleTextChange("major")}
                fullWidth
                error={majorerr}
                required
              />
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            justify="space-between"
            className={classes.primary}
            spacing={16}
            alignItems="flex-end"
          >
            <Grid item xs={2}>
              <MuiPickersUtilsProvider utils={JalaliUtils} locale="fa">
                <TextField
                  className={classes.primary}
                  error={birthDayerr}
                  fullWidth
                  disabled={disable}
                  required
                  id="tdatepicker"
                />
                {/* <DatePicker
                  className={classes.primary}
                  disabled={disable}
                  clearable={false}
                  label='تاریخ تولد'
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
                /> */}
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item xs={2}>
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
            <Grid item xs={2}>
              <Select
                className={classes.primary}
                disabled={disable}
                value={stype}
                onChange={this.handleTextChange("stype")}
                fullWidth
                error={stypeerr}
                required
              >
                <MenuItem value="دبستان">دبستان</MenuItem>
                <MenuItem value="متوسطه‌ی اول">متوسطه‌ی اول</MenuItem>
                <MenuItem value="متوسطه‌ی دوم">متوسطه‌ی دوم</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={6}>
              <TextField
                className={classes.primary}
                disabled={disable}
                label="نام مدرسه"
                value={persian.toPersian(sname)}
                error={snameerr}
                onChange={this.handleTextChange("sname")}
                fullWidth
                required
              />
            </Grid>

          </Grid>
          <Grid container direction="row" spacing={16} alignItems="flex-end">
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
            <Grid item xs={8}>
              <TextField
                className={classes.primary}
                disabled={disable}
                label="آدرس"
                value={address}
                onChange={this.handleTextChange("address")}
                multiline
                fullWidth
                error={addresserr}
                required
              />
            </Grid>
            <Grid container direction="row" spacing={16} alignItems="flex-end">
              <Grid item xs={2}>
                <Grid
                  container
                  direction="row"
                  spacing={16}
                  justify="space-between"
                  alignItems="center"
                >
                  <Typography variant="body1" className={classes.primary} >اجازه‌ی ورود</Typography>
                  <Switch
                    className={classes.primary}
                    disabled={disable}
                    value="canLogin"
                    onChange={this.handleSwitchChange("canLogin")}
                    checked={canLogin}
                  />
                </Grid>
              </Grid>
              <Grid item xs={2}>
                <Grid
                  container
                  direction="row"
                  spacing={16}
                  justify="space-between"
                  alignItems="center"
                >
                  <Typography variant="body1" className={classes.primary}>فعال بودن</Typography>
                  <Switch
                    className={classes.primary}
                    disabled={disable}
                    value="isActive"
                    onChange={this.handleSwitchChange("isActive")}
                    checked={isActive}
                  />
                </Grid>
              </Grid>
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
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

ManagerInfoForm.propTypes = {
  classes: PropTypes.object.isRequired,
  record: PropTypes.object.isRequired,
  waiting: PropTypes.bool.isRequired,
  onWaiting: PropTypes.func.isRequired,
  onRegister: PropTypes.func.isRequired
};

export default withStyles(styles)(ManagerInfoForm);
