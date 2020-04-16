import React, { Component } from "react";
import {
  Grid,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  CircularProgress
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import moment from "moment";
import persian from "persian";
import Joi from "joi-browser";
import PopMessages from "../common/PopMessages";
import green from "@material-ui/core/colors/green";
import axios from "axios";
import configs from "../../configs";

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

class AddManagerForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: "",
      lname: "",
      userName: "",
      faname: "",
      email: "",
      mobile: "",
      haddress: "",
      degree: "زیر دیپلم",
      major: "",
      birthDay: new Date().toISOString(),

      fnameerr: true,
      lnameerr: true,
      userNameerr: true,
      fanameerr: true,
      emailerr: true,
      mobileerr: true,
      haddresserr: true,
      degreeerr: false,
      majorerr: true,
      birthDayerr: false,

      errorMessages: [],
      loading: false,
      success: false,
      shouldSearch: true
    };
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleBtnClick = this.handleBtnClick.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleErrorExit = this.handleErrorExit.bind(this);
    this.datePicker = null;
  }
  componentDidMount() {
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
    this.datePicker.setDate(new Date().valueOf());
  }
  handleDateChange(date) {
    const validator = this.validate("birthDay");
    this.setState({ birthDay: date, birthDayerr: validator(date) });
  }
  handleTextChange(name) {
    const validator = this.validate(name);
    return e => {
      this.setState({
        [name]: e.target.value,
        [name + "err"]: validator(e.target.value)
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
      case "grade":
        return value => {
          return (
            Joi.string()
              .trim()
              .valid("پیش‌دبستانی", "اول", "دوم", "سوم", "چهارم", "پنجم", "ششم")
              .validate(value).error !== null
          );
        };
      case "course":
        return value => {
          return (
            Joi.string()
              .trim()
              .valid("بخوانیم", "بنویسیم", "هنر", "علوم", "ریاضی")
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
      case "haddress":
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
              this.setState({ loading: false });
              this.props.onRegister();
            })
            .catch(err => {
              for (let error of err) {
                if (error === "خطای دسترسی به سرور") {
                  this.setState({ loading: false, shouldSearch: false });
                }
                this.handleError(error);
              }
            });
        };
      case "search":
        return ()=>{
          this.search(this.state)
            .then(success => {
              this.setState({ loading: false, shouldSearch:false });
            })
          .catch(err => {
            for (let error of err) {
              if (error === "خطای دسترسی به سرور") {
                this.setState({ loading: false, shouldSearch: true });
              } else if(error === "معلم در سیستم وجود ندارد"){
                this.setState({loading: false, shouldSearch: false});
              } else {
                this.setState({loading: false, shouldSearch: true});
              }
              this.handleError(error);
            }
          });
        }
    }
  }
  register(prevState) {
    let data = {
      FirstName: prevState.fname,
      LastName: prevState.lname,
      ID: prevState.userName,
      FatherName: prevState.faname,
      Email: prevState.email,
      Mobile: prevState.mobile,
      HomeAddress: prevState.haddress,
      EducationalDegree: prevState.degree,
      Major: prevState.major,
      BirthDay: prevState.birthDay
    };
    const error = {
      "نام ": prevState.fnameerr,
      "نام خانوادگی ": prevState.lnameerr,
      "شماره ملی ": prevState.userNameerr,
      "نام پدر ": prevState.fanameerr,
      "رایانامه ": prevState.emailerr,
      "شماره‌ی همراه ": prevState.mobileerr,
      "آدرس ": prevState.haddresserr,
      "مدرک تحصیلی ": prevState.degreeerr,
      "رشته تحصیلی ": prevState.majorerr,
      "تاریخ تولد ": prevState.birthDayerr
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
          this.setState({ loading: true, success: false }, () => {
            this.post(data)
              .then(() => {
                accept("معلم با موفقیت ثبت شد");
              })
              .catch(err => {
                returnErrors.push("خطای دسترسی به سرور");
                reject(returnErrors);
              });
          });
        }
      }.bind(this)
    );
  }
  search(prevState) {
    const req = axios.create({
      baseURL: configs.apiUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("access-token")
      }
    });
    const NID = persian.toEnglish(prevState.userName);
    console.log(NID);
    return new Promise(
      function(accept, reject){
        if(prevState.userNameerr){
          reject(['شماره ملی معتبر نیست']);
        } else {
          this.setState({ loading: true, success: false }, () => {
            req.get('/teacher/'+NID)
              .then((res) => {
                const data = res.data;
                this.setState({
                  fname: data.FirstName,
                  lname: data.LastName,
                  userName: data.ID,
                  faname: data.FatherName,
                  email: data.Email,
                  mobile: data.Mobile,
                  haddress: data.HomeAddress,
                  degree: data.EducationalDegree,
                  major: data.Major,
                  birthDay: data.BirthDay, 

                  fnameerr: false,
                  lnameerr: false,
                  userNameerr: false,
                  fanameerr: false,
                  emailerr: false,
                  mobileerr: false,
                  haddresserr: data.HomeAddress === '',
                  degreeerr: false,
                  majorerr: false,
                  birthDayerr: false
                })
                accept("معلم با موفقیت ثبت شد");
              })
              .catch(err => {
                console.log(err);
                if(err.response.data.errorNumber === '022'){
                  reject(["معلم در سیستم وجود ندارد"])
                } else {
                  reject(["خطای دسترسی به سرور"]);
                }
              });
          });
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
    data.Mobile = persian.toEnglish(data.Mobile);
    data.Mobile =
      data.Mobile.charAt(0) === "0" ? data.Mobile.slice(1) : data.Mobile;
    data.ID = persian.toEnglish(data.ID);

    return req.post("/teacher", JSON.stringify(data));
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
  render() {
    const { classes } = this.props;
    const {
      fname,
      lname,
      faname,
      userName,
      haddress,
      email,
      mobile,
      degree,
      major,
      fnameerr,
      lnameerr,
      userNameerr,
      fanameerr,
      emailerr,
      mobileerr,
      haddresserr,
      degreeerr,
      majorerr,
      birthDayerr,
      loading,
      shouldSearch
    } = this.state;
    return (
      <Paper style={{ padding: 20 }}>
        {this.state.errorMessages.map((err, id) => {
          console.log(err, id)
          return (
            <PopMessages
              key={id}
              message={err}
              variant="error"
              onClose={this.handleErrorExit(id)}
              open={true}
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
                disabled={!shouldSearch}
                className={classes.primary}
                label="شماره ملی"
                value={persian.toPersian(userName)}
                onChange={this.handleTextChange("userName")}
                fullWidth
                error={userNameerr}
                required
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                className={classes.primary}
                  disabled={shouldSearch}
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
                className={classes.primary}
                  disabled={shouldSearch}
                label="نام خانوادگی"
                value={lname}
                onChange={this.handleTextChange("lname")}
                fullWidth
                error={lnameerr}
                required
              />
            </Grid>
          </Grid>
          <Grid container direction="row" spacing={16} alignItems="flex-end">
            <Grid item xs={4}>
              <TextField
                className={classes.primary}
                  disabled={shouldSearch}
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
                disabled={shouldSearch}
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
                className={classes.primary}
                  disabled={shouldSearch}
                label="رشته‌ی تحصیلی"
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
            <Grid item xs={4}>
              {/* <MuiPickersUtilsProvider utils={JalaliUtils} locale="fa">
                <DatePicker
                  clearable={false}
                  okLabel="تأیید"
                  cancelLabel="لغو"
                  label="تاریخ تولد"
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
                className={classes.primary}
                  disabled={shouldSearch}
                error={birthDayerr}
                fullWidth
                required
                id='tdatepicker'
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                disabled={shouldSearch}
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
                disabled={shouldSearch}
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
                disabled={shouldSearch}
                label="آدرس"
                value={haddress}
                onChange={this.handleTextChange("haddress")}
                multiline
                fullWidth
                error={haddresserr}
                required
              />
            </Grid>
            <Grid container direction="row" alignItems="stretch" spacing={16}>
              <Grid item style={{ flexGrow: 1 }}>
                <Button
                  disabled={loading}
                  className={classes.primary}
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={this.handleBtnClick("drop")}
                >
                  انصراف
                </Button>
              </Grid>
              <Grid item style={{ flexGrow: 1 }}>
                <Button
                  disabled={loading}
                  className={classes.primary}
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={shouldSearch ? this.handleBtnClick("search"): this.handleBtnClick("register")}
                >
                  {loading && (
                    <CircularProgress
                      className={classes.buttonProgress}
                      size={24}
                    />
                  )}
                  {shouldSearch ? "جستجو": "تأیید"}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

AddManagerForm.propTypes = {
  classes: PropTypes.object.isRequired,
  onRegister: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onError: PropTypes.func
};

export default withStyles(styles)(AddManagerForm);
