import React, { Component } from "react";
import {
  Grid,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  CircularProgress,
  Typography,
  FormControl,
  FormLabel
} from "@material-ui/core";
import ProfileImg from "@material-ui/icons/AccountCircle";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import persian from "persian";
import _ from "lodash";
import Joi from "joi-browser";
import green from "@material-ui/core/colors/green";
import axios from "axios";
import configs from "../../configs";
import PopMessages from "../common/PopMessages";
import ReactFileReader from 'react-file-reader';

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
      paddingLeft: theme.spacing.unit * 5 ,
      paddingRight: theme.spacing.unit 
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
    },
    image:{
      marginLeft: 4*theme.spacing.unit,
      width:160,
      align:'center'
    },
    profile:{
      fontSize: 200,
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
      birthDay: new Date().toDateString(),
      citizenship: "",
      birthPlace: "",
      issuePlace: "",
      religion: "",
      mazhab: "",

      fnameerr: false,
      lnameerr: false,
      userNameerr: false,
      emailerr: false,
      mobileerr: false,
      gradeerr: false,
      birthDayerr: false,
      citizenshiperr: false,
      birthPlaceerr: false,
      issuePlaceerr: false,
      mazhaberr: false,


      errorMessages: [],
      loading: false,
      disable: true,
      waiting: false,
      waitingImage: false,

      fnameupdate: null,
      lnameupdate: null,
      userNameupdate: null,
      emailupdate: null,
      mobileupdate: null,
      gradeupdate: null,
      birthDayupdate: null,
      imageUpdate: null,
      citizenshipupdate: null,
      birthPlaceupdate: null,
      issuePlaceupdate: null,
      religionupdate: null,
      mazhabupdate: null,


      imageTitle: 'بارگذاری عکس',
      image:'null'
    };
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSwitchChange = this.handleSwitchChange.bind(this);
    this.handleBtnClick = this.handleBtnClick.bind(this);
    this.handleError = this.handleError.bind(this);
    this.datePicker = null;
    this.handleRemoveImage = this.handleRemoveImage.bind(this);
    this.handleFiles = this.handleFiles.bind(this);
  }

  componentDidMount() {
    const { record } = this.props;

    this.datePicker = $(`#sidatepicker-${record._id}`).persianDatepicker({
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
    //this.datePicker.setDate(new Date(record.birthday).valueOf());
    console.log(record)
    this.setState(prevState => {
      return {
        _id: record._id,
        fname: record.fname,
        lname: record.lname,
        userName: record.userName,
        email: record.email,
        birthDay: record.birthday,
        grade: record.grade,
        mobile: "0" + record.mobile,
        imageTitle: record.hasOwnProperty('image')?'حذف عکس':'بارگذاری عکس',
        image: record.hasOwnProperty('image')?record.image:'null',
        citizenship: record.citizenship,
        birthPlace: record.birthPlace,
        issuePlace: record.issuePlace,
        religion: record.religion,
        mazhab: record.mazhab,

        disable: true,
        fnameupdate: null,
        lnameupdate: null,
        userNameupdate: null,
        emailupdate: null,
        mobileupdate: null,
        gradeupdate: null,
        birthDayupdate: null,
        imageUpdate: null,
        citizenshipupdate: null,
        birthPlaceupdate: null,
        issuePlaceupdate: null,
        religionupdate: null,
        mazhabupdate: null,


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
      imageUpdate: null,
      imageTitle:'بارگذاری عکس',
      citizenshipupdate: null,
      birthPlaceupdate: null,
      issuePlaceupdate: null,
      religionupdate: null,
      mazhabupdate: null,


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
      case "grade":
        return value => {
          return (
            Joi.string()
              .trim()
              .valid("پیش‌دبستانی", "اول", "دوم", "سوم", "چهارم", "پنجم", "ششم")
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
      case "citizenship":
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
      case "birthPlace":
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

      case "issuePlace":
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
      case "religion":
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
      case "mazhab":
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
            citizenshiperr: false,
            birthPlaceerr: false,
            issuePlaceerr: false,
            religionerr: false,
            mazhaberr: false,

            fnameupdate: null,
            lnameupdate: null,
            userNameupdate: null,
            emailupdate: null,
            mobileupdate: null,
            gradeupdate: null,
            birthDayupdate: null,
            imageUpdate: null,
            citizenshipupdate: null,
            birthPlaceupdate: null,
            issuePlaceupdate: null,
            religionupdate: null,
            mazhabupdate: null,


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
                imageUpdate: null,
                citizenshipupdate: null,
                birthPlaceupdate: null,
                issuePlaceupdate: null,
                religionupdate: null,
                mazhabupdate: null,
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
              this.setState({
                loading: false
              });
            });
        };
    }
  }
  update(prevState) {
    let data = (prevState.image=='null' && !prevState.imageUpdate) ? {
      _id: prevState._id,
      FirstName: prevState.fname,
      LastName: prevState.lname,
      ID: prevState.userName,
      Email: prevState.email,
      Mobile: prevState.mobile,
      Grade: prevState.grade,
      BirthDay: prevState.birthDay,
      Citizenship: prevState.citizenship,
      BirthPlace: prevState.birthPlace,
      IssuePlace: prevState.issuePlace,
      Religion: prevState.religion,
      Mazhab: prevState.mazhab,


    }:{
      _id: prevState._id,
      FirstName: prevState.fname,
      LastName: prevState.lname,
      ID: prevState.userName,
      Email: prevState.email,
      Mobile: prevState.mobile,
      Grade: prevState.grade,
      BirthDay: prevState.birthDay,
      Image: prevState.image,
      Citizenship: prevState.citizenship,
      BirthPlace: prevState.birthPlace,
      IssuePlace: prevState.issuePlace,
      Religion: prevState.religion,
      Mazhab: prevState.mazhab,


    };
    let updateFlags = {
      FirstName: prevState.fnameupdate,
      LastName: prevState.lnameupdate,
      ID: prevState.userNameupdate,
      Email: prevState.emailupdate,
      Mobile: prevState.mobileupdate,
      Grade: prevState.gradeupdate,
      BirthDay: prevState.birthDayupdate,
      Image: prevState.imageUpdate,
      Citizenship: prevState.citizenshipupdate,
      BirthPlace: prevState.birthPlaceupdate,
      IssuePlace: prevState.issuePlaceupdate,
      Religion: prevState.religionupdate,
      Mazhab: prevState.mazhabupdate,
    };
    const error = {
      "نام ": prevState.fnameerr,
      "نام خانوادگی ": prevState.lnameerr,
      "شماره ملی ": prevState.userNameerr,
      "رایانامه ": prevState.emailerr,
      "شماره‌ی همراه ": prevState.mobileerr,
      "پایه‌ی تحصیلی ": prevState.gradeerr,
      "تاریخ تولد ": prevState.birthDayerr,
      "تابعیت ": prevState.citizenshiperr,
      "محل تولد ": prevState.birthPlaceerr,
      "محل صدور ": prevState.issuePlaceerr,
      "دین ": prevState.religionerr,
      "مذهب ": prevState.mazhaberr
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
              console.log(err)
              if (err === "داده ای تغییر نکرده است") {
                returnErrors.push("داده ای تغییر نکرده است");
              } else {
                returnErrors.push("شماره ملی تکراری است.");
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
          req
            .patch(`/student/${_id}`, JSON.stringify(upgradedFields))
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
  handleFiles(files){
    console.log('add file')
    let formdata = new FormData();
    this.setState({waitingImage:true});
    formdata.append("Attachment", files.fileList[0])
    const req = axios.create({
        baseURL: configs.apiUrl,
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: localStorage.getItem("access-token")
        }
    });
    req.post("/school/upload/profile", formdata).then(res=>{
        this.setState({waitingImage:false,imageTitle:'حذف عکس',imageUpdate: true,image:res.data.uri});
    }).catch (error=> {
      this.setState({waitingImage:false,imageTitle:'بارگذاری عکس',image:'null'});
        // this.setState(
        //     {message: "تصویر بارگذاری نشده است", messageOpen: true, messageType: "error"}
        // );
    })
  }
  handleRemoveImage(){
    this.setState({waitingImage:false,imageTitle:'بارگذاری عکس',imageUpdate: true,image:'null'});
  }
  render() {
    const { classes, waiting } = this.props;
    const {
      fname,
      lname,
      userName,
      email,
      citizenship,
      birthPlace,
      issuePlace,
      religion,
      mazhab,
      disable,
      mobile,
      fnameerr,
      lnameerr,
      userNameerr,
      emailerr,
      mobileerr,
      birthDayerr,
      gradeerr,
      citizenshiperr,
      birthPlaceerr,
      issuePlaceerr,
      religionerr,
      mazhaberr,
      grade,
      loading
    } = this.state;
    const { record } = this.props;
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
          direction="row"
          className={classes.root}
          alignItems="stretch"
        >
        <Grid container direction="column" xs={10} alignItems="center" spacing={16}>
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
              <FormControl fullWidth align='right'>
              <FormLabel disabled={disable}>تاریخ تولد</FormLabel>
                <TextField
                  className={classes.primary}
                  error={birthDayerr}
                  fullWidth
                  disabled={disable}
                  required
                  id={`sidatepicker-${record._id}`}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
                <TextField
                  className={classes.primary}
                  disabled={disable}
                  label="محل تولد"
                  value={birthPlace}
                  onChange={this.handleTextChange("birthPlace")}
                  fullWidth
                  error={birthPlaceerr}
                  required
                />
            </Grid>
            <Grid item xs={4}>
              <Select
                className={classes.primary}
                disabled={disable}
                value={grade}
                onChange={this.handleTextChange("grade")}
                fullWidth
                error={gradeerr}
                required
              >
                <MenuItem value="پیش‌دبستانی">پیش‌دبستانی</MenuItem>
                <MenuItem value="اول">اول</MenuItem>
                <MenuItem value="دوم">دوم</MenuItem>
                <MenuItem value="سوم">سوم</MenuItem>
                <MenuItem value="چهارم">چهارم</MenuItem>
                <MenuItem value="پنجم">پنجم</MenuItem>
                <MenuItem value="ششم">ششم</MenuItem>
              </Select>
            </Grid>
          </Grid>
          <Grid container direction="row" spacing={16} alignItems="flex-end">
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
            <Grid item xs={4}>
              <TextField
                className={classes.primary}
                disabled={disable}
                label="تابعیت"
                value={citizenship}
                onChange={this.handleTextChange("citizenship")}
                fullWidth
                error={citizenshiperr}
                required
              />
            </Grid>
            <Grid item xs={4}>
                <TextField
                  className={classes.primary}
                  disabled={disable}
                  label="محل صدور"
                  value={issuePlace}
                  onChange={this.handleTextChange("issuePlace")}
                  fullWidth
                  error={issuePlaceerr}
                  required
                />
            </Grid>
            </Grid>
            <Grid container direction="row" spacing={16} alignItems="flex-end">
            <Grid item xs={4}>
                <TextField
                  className={classes.primary}
                  disabled={disable}
                  label="دین "
                  value={religion}
                  onChange={this.handleTextChange("religion")}
                  fullWidth
                  error={religionerr}
                  required
                />
            </Grid>
            <Grid item xs={4}>
                <TextField
                  className={classes.primary}
                  disabled={disable}
                  label="مذهب "
                  value={mazhab}
                  onChange={this.handleTextChange("mazhab")}
                  fullWidth
                  error={mazhaberr}
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
            </Grid>
          </Grid>
          <Grid container alignItems="center" fullWidth direction="column" spacing={16} xs={2}>
            <Grid item>
              {this.state.image!=='null' ?
                <img
                  className={classes.image}
                  src={configs.publicUrl + '/' + this.state.image}
                />:
                <ProfileImg className={classes.profile}/>
              }
            </Grid>
            <Grid fullWidth item>
              {this.state.image=='null'?
                <ReactFileReader
                  disabled={disable} 
                  fileTypes={[".jpg"]} base64={true} multipleFiles={false} handleFiles={this.handleFiles}>
                  <Button color="primary" fullWidth>
                  {this.state.waitingImage && (
                      <CircularProgress
                        className={classes.buttonProgress}
                        size={24}
                      />
                    )}
                    <Typography color='textSecondary'>{this.state.imageTitle}</Typography>
                  </Button>
                </ReactFileReader>:
                <Button disabled={disable} color="primary" fullWidth onClick={this.handleRemoveImage}>
                {this.state.waitingImage && (
                    <CircularProgress
                      className={classes.buttonProgress}
                      size={24}
                    />
                  )}
                  <Typography color='textSecondary'>{this.state.imageTitle}</Typography>
                </Button>
              }
            </Grid>
          </Grid>
        </Grid>
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
