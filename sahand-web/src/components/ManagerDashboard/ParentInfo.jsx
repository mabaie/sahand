import React, { Component } from "react";
import {
  Grid,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import MuiPickersUtilsProvider from "material-ui-pickers/MuiPickersUtilsProvider";
import JalaliUtils from "material-ui-pickers-jalali-utils";
import moment from "moment";
import persian from "persian";
import { DatePicker } from "material-ui-pickers";
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
class ParentInfoForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ID: "",
      birthday: moment(),
      degree: "",
      email: "",
      faname: "",
      fname: "",
      lname: "",
      major: "",
      mobile: "",
      haddress: "",
      waddress: "",
      homephone: "",
      job: "",

      IDerr: false,
      birthdayerr: false,
      degreeerr: false,
      emailerr: false,
      fanameerr: false,
      fnameerr: false,
      lnameerr: false,
      majorerr: false,
      mobileerr: false,
      haddresserr: false,
      waddresserr: false,
      homephoneerr: "",
      joberr: "",

      errorMessages: [],
      loading: false,
      disable: true,
      waiting: false,

      IDupdate: null,
      birthdayupdate: null,
      degreeupdate: null,
      emailupdate: null,
      fanameupdate: null,
      fnameupdate: null,
      lnameupdate: null,
      majorupdate: null,
      mobileupdate: null,
      haddressupdate: null,
      waddressupdate: null,
      homephoneupdate: null,
      jobupdate: null,

      password_change:false,
      password_new:''
    };
    this._id = "";
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleBtnClick = this.handleBtnClick.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  componentDidMount() {
    const { record, name } = this.props;
    this._id = record[name + '_id'];

    this.datePicker = $(`#${record.name}datepicker-${record._id}`).persianDatepicker({
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
    this.datePicker.setDate(new Date(record[name + 'birthday']).valueOf());
    this.setState(prevState => {
      return {
        ID: record[name + 'ID'],
        birthday: record[name + 'birthday'], 
        degree: record[name + 'degree'],
        email: record[name + 'email'],
        faname: record[name + 'faname'],
        fname: record[name + 'fname'],
        lname: record[name + 'lname'],
        major: record[name + 'major'],
        mobile: record[name + 'mobile'],
        haddress: record[name + 'haddress'],
        waddress: record[name + 'waddress'],
        homephone: record.hasOwnProperty(name + 'homePhone')? record[name + 'homePhone']:"",
        job: record[name + 'job'],

        disable: true,
        birthdayupdate: null,
        degreeupdate: null,
        emailupdate: null,
        fanameupdate: null,
        fnameupdate: null,
        lnameupdate: null,
        majorupdate: null,
        mobileupdate: null,
        haddressupdate: null,
        waddressupdate: null,
        homephoneupdate: null,
        jobupdate: null,
      };
    });
  }
  componentWillUnmount() {
    this.setState({
      birthdayupdate: null,
      degreeupdate: null,
      emailupdate: null,
      fanameupdate: null,
      fnameupdate: null,
      lnameupdate: null,
      majorupdate: null,
      mobileupdate: null,
      haddressupdate: null,
      waddressupdate: null,
      homephoneupdate: null,
      jobupdate: null,
  });
  }
  handleDateChange(date) {
    const validator = this.validate("birthday");
    this.setState({
      birthday: date,
      birthdayerr: validator(date),
      birthdayupdate: true
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
        case "major":
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
        case "job":
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
        case "haddress":
        return value => {
          return (
            Joi.string()
              .trim()
              .min(3)
              .max(100)
              .required()
              .validate(value).error !== null
          );
        };
        case "waddress":
        return value => {
          return (
            Joi.string()
              .trim()
              .min(3)
              .max(100)
              .required()
              .validate(value).error !== null
          );
        };

      case "ID":
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
              .valid("زیر دیپلم", "دیپلم", "کارشناسی ارشد", "کارشناسی", "دکتری")
              .validate(value).error !== null
          );
        };
      case "mobile":
        return value => {
          let number = persian.toEnglish(value);
          number = number.charAt(0) === "0" ? number.slice(1) : number;
          return (
            Joi.string()
              .regex(/^9[0-9][0-9]{8}$/)
              .required()
              .validate(number).error !== null
          );
        };
      case "homephone":
          return value => {
            let number = persian.toEnglish(value);
            number = number.charAt(0) === "0" ? number.slice(1) : number;
            return (
              Joi.string()
                .regex(/^[1-8][0-9][0-9]{8}$/)
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
      case "birthday":
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
      case "edit":
        return () => {
          this.setState({ disable: false });
        };
      case "drop":
        return () => {
          let nextState = { disable: true };
          _.merge(nextState, this.props.record);
          let flags = {
            IDerr: false,
            birthdayerr: false,
            degreeerr: false,
            emailerr: false,
            fanameerr: false,
            fnameerr: false,
            lnameerr: false,
            majorerr: false,
            mobileerr: false,
            haddresserr: false,
            waddresserr: false,   
            homephoneerr: false,
            joberr: false,   

            IDupdate: null,
            birthdayupdate: null,
            degreeupdate: null,
            emailupdate: null,
            fanameupdate: null,
            fnameupdate: null,
            lnameupdate: null,
            majorupdate: null,
            mobileupdate: null,
            haddressupdate: null,
            waddressupdate: null,
            homephoneupdate: null,
            jobupdate: null,
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
                IDupdate: null,
                birthdayupdate: null,
                p1degreeupdate: null,
                p1emailupdate: null,
                p1fanameupdate: null,
                p1fnameupdate: null,
                p1lnameupdate: null,
                p1majorupdate: null,
                p1mobileupdate: null,
                haddressupdate: null,
                waddressupdate: null,
                homephoneupdate: null,
                jobupdate: null,
                loading: false,
                disable: true
              });
              // this.setState({loading: false});
              //this.props.onRegister();
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
          const { record, name } = this.props;
          const req = axios.create({
            baseURL: configs.apiUrl,
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("access-token")
            }
          });
          req.post("/school/reset_password_user", 
          {
            ID: record[name+'_id']
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
      FirstName: prevState.fname,
      LastName: prevState.lname,
      FatherName: prevState.faname,
      ID: prevState.ID,
      Email: prevState.email,
      Mobile: prevState.mobile,
      Degree: prevState.degree,
      Major: prevState.major,
      BirthDay: prevState.birthday,
      HomeAddress: prevState.haddress,
      WorkAddress: prevState.waddress,
      HomePhone: prevState.homephone,
      Job: prevState.job,
    };
    let updateFlags = {
      FirstName: prevState.fnameupdate,
      LastName: prevState.lnameupdate,
      FatherName: prevState.fanameupdate,
      ID: prevState.IDupdate,
      Email: prevState.emailupdate,
      Mobile: prevState.mobileupdate,
      Degree: prevState.degreeupdate,
      Major: prevState.majorupdate,
      BirthDay: prevState.birthdayupdate,
      HomeAddress: prevState.haddressupdate,
      WorkAddress:  prevState.waddressupdate,
      HomePhone: prevState.homephoneupdate,
      Job: prevState.jobupdate,
    };
    const error = {
      "نام ": prevState.fnameerr,
      "نام خانوادگی ": prevState.lnameerr,
      "نام پدر ": prevState.fanameerr,
      "شماره ملی ": prevState.IDerr,
      "رایانامه ": prevState.emailerr,
      "شماره‌ی همراه ": prevState.mobileerr,
      "مدرک تحصیلی ": prevState.degreeerr,
      "رشته‌ی تحصیلی ": prevState.majorerr,
      "تاریخ تولد ": prevState.birthdayerr,
      "آدرس منزل ": prevState.haddresserr,
      "آدرس محل کار ": prevState.waddresserr,
      "شماره‌ی تلفن خانه": prevState.homephoneerr,
      "شغل ": prevState.joberr,
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
                returnErrors.push("کد ملی تکراری است.");
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
        const _id = this._id;
        data.Mobile = persian.toEnglish(data.Mobile);
        data.Mobile =
        data.Mobile.charAt(0) === "0" ? data.Mobile.slice(1) : data.Mobile;
        data.HomePhone = persian.toEnglish(data.HomePhone);
        data.HomePhone =
        data.HomePhone.charAt(0) === "0" ? data.HomePhone.slice(1) : data.HomePhone;
        data.ID = persian.toEnglish(data.ID);

        let upgradedFields = {};
        for (let field in data) {
          if (updateFlags[field]) {
            upgradedFields[field] = data[field];
          }
        }
        if (!_.isEqual(upgradedFields, {})) {
          this.setState({ loading: true });
          req
            .patch(`/parent/${_id}`, JSON.stringify(upgradedFields))
            .then(() => {
              accept();
            })
            .catch(err => {
              this.setState({ loading: false });
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
      ID,
      birthday,
      degree,
      email,
      faname,
      fname,
      lname,
      major,
      job,
      homephone,
      mobile,
      haddress,
      waddress,
      disable,
      IDerr,
      birthdayerr,
      degreeerr,
      emailerr,
      fanameerr,
      fnameerr,
      lnameerr,
      majorerr,
      joberr,
      homephoneerr,
      mobileerr,
      haddresserr,
      waddresserr,
      loading
    } = this.state;
    const { record } = this.props;
    console.log('res c',record)
    return (
      <Paper style={{ padding: 20 }}>
        {this.state.errorMessages.map((err, id) => {
          
          return (
            <PopMessages
              key={id}
              message={err}
              variant="error"
              open={true}
              onClose={this.handleErrorExit(id)}
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
                value={persian.toPersian(ID)}
                onChange={this.handleTextChange("ID")}
                fullWidth
                error={IDerr}
                required
              />
            </Grid>
          </Grid>
          <Grid container direction="row" spacing={16} alignItems="flex-end">
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
                label="رشته تحصیلی"
                value={persian.toPersian(major)}
                onChange={this.handleTextChange("major")}
                fullWidth
                error={majorerr}
                required
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
          </Grid>
          <Grid container direction="row" spacing={16} alignItems="flex-end">
            <Grid item xs={4}>
              <TextField
                disabled={disable}
                label="نام پدر"
                value={faname}
                onChange={this.handleTextChange("faname")}
                fullWidth
                error={fanameerr}
                required
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                disabled={disable}
                label="شغل"
                value={job}
                onChange={this.handleTextChange("job")}
                fullWidth
                error={joberr}
                required
              />
            </Grid>
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
                  value={moment(birthday)}
                  onChange={this.handleDateChange}
                  animateYearScrolling={true}
                  disableFuture
                  fullWidth
                  error={birthdayerr}
                  required
                />
              </MuiPickersUtilsProvider> */}
              <TextField
                className={classes.primary}
                error={birthdayerr}
                fullWidth
                disabled={disable}
                required
                id={`${record.name}datepicker-${record._id}`}
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
                label="آدرس منزل"
                value={haddress}
                onChange={this.handleTextChange("haddress")}
                fullWidth
                error={haddresserr}
                required
              />
            </Grid>
          </Grid>
          <Grid container direction="row" spacing={16} alignItems="flex-end">
          <Grid item xs={4}>
              <TextField
                disabled={disable}
                label="تلفن منزل"
                value={persian.toPersian(homephone)}
                onChange={this.handleTextChange("homephone")}
                fullWidth
                error={homephoneerr}
                required
              />
            </Grid>
            <Grid item xs={8}>
              <TextField
                className={classes.primary}
                disabled={disable}
                label="آدرس محل کار"
                value={waddress}
                onChange={this.handleTextChange("waddress")}
                fullWidth
                error={waddresserr}
                required
              />
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
              <Grid item style={{ flexGrow: 1 }}>
                <Button
                  disabled={waiting || loading}
                  className={classes.primary}
                  variant="contained"
                  color="primary"
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

ParentInfoForm.propTypes = {
  classes: PropTypes.object.isRequired,
  record: PropTypes.object.isRequired,
  waiting: PropTypes.bool.isRequired,
  onWaiting: PropTypes.func.isRequired,
  onRegister: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired
};

export default withStyles(styles)(ParentInfoForm);
