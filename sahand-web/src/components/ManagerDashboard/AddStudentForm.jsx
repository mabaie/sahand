import React, { Component } from "react";
import {
  Grid,
  Paper,
  Button,
  CircularProgress,
  Stepper,
  FormControl,
  InputLabel,
  Step,
  StepContent,
  StepLabel,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  FormGroup,
  FormControlLabel,
  IconButton,
  Table,
  TableRow,
  TableCell,
  Typography,
  TableHead,
} from "@material-ui/core";
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Close from '@material-ui/icons/Clear';
import ArrowRightAlt from '@material-ui/icons/ArrowRightAlt';
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import jMoment from "moment";
import persian from "persian";
import PopMessages from "../common/PopMessages";
import green from "@material-ui/core/colors/green";
import axios from "axios";
import configs from "../../configs";
import Joi from "joi-browser";
import Cookies from "js-cookie";
// import printJS from 'print-js'
import ReactToPrint from 'react-to-print';
import ReactFileReader from 'react-file-reader';
import Momentj from 'moment-jalaali';
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
const academicyearCreator = (y)=>{
  if(Momentj(y).jMonth()<=4 && Momentj(y).jMonth()>0){
    y=y.subtract(1, 'Year');
  }
  return y;
}
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
    },
    printTable: {
      rightMargin: theme.spacing.unit,
      padding: 30,
      alignItems:"center"
    },
    closeIcon:{
      margin: theme.spacing.unit,
      position:'absolute',
      top:0,
      right:0
    },
    image:{
      margin: theme.spacing.unit,
      position:'absolute',
      top:10,
      right:100,
      height:180
    },
    logo:{
      height:20
    },
    paper:{
      width:'710px',
      height:'1072px',
      spacing:16,
    },
    TableStyle:{
      paddingBottom:10
    },
    checkbox:{
      marginLeft:-10
    },
    checkboxList:{
      paddingLeft:20
    }
  };
};

class ParentRegisterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessages: [],
      shouldEnter: false,
      shouldSearch: this.props.required ? true : false,
      shouldGoNext: this.props.required ? false : true,
      loading: false,
      check: false,
      first: true
    };
    this.handleNext = this.handleNext.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleCheckBox = this.handleCheckBox.bind(this);
    this.datePicker = null;
    this.handleDateChange = null;
  }
  componentDidMount() {
    this.handleDateChange = this.props.onDateChange(this.props.name);
    this.datePicker = $(`#${this.props.name}datepicker`).persianDatepicker({
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
    let shouldEnter = Cookies.get(`${this.props.name}shouldEnter`);
    let shouldSearch = Cookies.get(`${this.props.name}shouldSearch`);
    let shouldGoNext = Cookies.get(`${this.props.name}shouldGoNext`);
    let check = Cookies.get(`${this.props.name}check`);
    shouldSearch = shouldSearch
      ? JSON.parse(shouldSearch)
      : this.props.required;
    shouldEnter = shouldEnter ? JSON.parse(shouldEnter) : false;
    shouldGoNext = shouldGoNext
      ? JSON.parse(shouldGoNext)
      : !this.props.required;
    check = check ? JSON.parse(check) : false;
    this.setState({
      shouldEnter: shouldEnter,
      shouldSearch: shouldSearch,
      shouldGoNext: shouldGoNext,
      check: check,
      first: true
    });
  }
  componentWillUnmount() {
    this.setState({ errorMessages: [] });
  }
  handleCheckBox(e) {
    this.setState(
      {
        shouldEnter: false,
        shouldSearch: e.target.checked,
        shouldGoNext: !e.target.checked,
        check: e.target.checked
      },
      this.props.onCheckBoxChange(e.target.checked, this.props.name)
    );
  }
  handleNext() {
    const error = {
      "نام ": this.props.record.fnameerr,
      "نام خانوادگی ": this.props.record.lnameerr,
      "شماره ملی ": this.props.record.userNameerr,
      "نام پدر ": this.props.record.fanameerr,
      "رایانامه ": this.props.record.emailerr,
      "شماره‌ی همراه ": this.props.record.mobileerr,
      "مدرک تحصیلی ": this.props.record.degreeerr,
      "رشته تحصیلی ": this.props.record.majorerr,
      "تاریخ تولد ": this.props.record.birthDayerr,
      "شغل ": this.props.record.joberr,
      "آدرس منزل ": this.props.record.haddresserr,
      "آدرس محل کار ": this.props.record.waddresserr,
      "تلفن منزل": this.props.record.homephoneerr
    };
    if (this.state.shouldSearch) {
      if (this.props.record.userNameerr) {
        this.handleError("شماره ملی معتبر نیست");
      } else {
        this.setState(
          { loading: true, first: false },
          this.props.onGetParent(this.props.name)
        );
      }
    } else if (this.state.shouldEnter) {
      let foundError = false;
      for (let err in error) {
        if (error[err]) {
          foundError = true;
          this.handleError(err + "معتبر نیست");
        }
      }
      if (!foundError) {
        this.setState(
          { shouldEnter: false, shouldGoNext: true, first: false },
          this.props.onConfirm(this.props.name)
        );
      }
    } else if (this.state.shouldGoNext) {
      const shouldEnter =
        this.props.required || (!this.props.required && this.props.confirmed)
          ? true
          : false;
      const shouldSearch =
        !this.props.required && !this.props.confirmed && this.state.check
          ? true
          : false;
      Cookies.set(
        `${this.props.name}shouldEnter`,
        (shouldEnter && !shouldSearch).toString(),
        {
          path: ""
        }
      );
      Cookies.set(
        `${this.props.name}shouldSearch`,
        (shouldSearch && !shouldEnter).toString(),
        {
          path: ""
        }
      );
      Cookies.set(
        `${this.props.name}shouldGoNext`,
        (!shouldEnter && !shouldSearch).toString(),
        {
          path: ""
        }
      );
      Cookies.set(`${this.props.name}check`, this.state.check.toString(), {
        path: ""
      });
      this.props.onNext();
    }
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
  componentDidUpdate() {
    this.datePicker.setDate(new Date(this.props.record.birthDay).valueOf())
    if (!this.state.first) {
      if (this.props.NotGotData) {
        this.setState(
          { loading: false, shouldSearch: false, shouldEnter: true },
          this.props.onGotData(this.props.name)
        );
      } else if (this.state.loading && this.props.accessError) {
        this.setState({ loading: false });
      } else if (this.props.gotData) {
        this.setState(
          { loading: false, shouldSearch: false, shouldEnter: true },
          this.props.onGotData(this.props.name)
        );
      }
    }
  }
  handleBack() {
    const shouldEnter =
      this.props.required || (!this.props.required && this.props.confirmed)
        ? true
        : false;
    const shouldSearch =
      !this.props.required && !this.props.confirmed && this.state.check
        ? true
        : false;
    Cookies.set(
      `${this.props.name}shouldEnter`,
      (shouldEnter && !shouldSearch).toString(),
      {
        path: ""
      }
    );
    Cookies.set(
      `${this.props.name}shouldSearch`,
      (shouldSearch && !shouldEnter).toString(),
      {
        path: ""
      }
    );
    Cookies.set(
      `${this.props.name}shouldGoNext`,
      (!shouldEnter && !shouldSearch).toString(),
      {
        path: ""
      }
    );
    Cookies.set(`${this.props.name}check`, this.state.check.toString(), {
      path: ""
    });
    this.props.onPrev(this.props.name);
  }
  render() {
    const { classes, activeStep, required, record } = this.props;
    return (
      <React.Fragment>
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
        {!this.props.required && (
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.check}
                  onChange={this.handleCheckBox}
                  value="shouldEnter"
                />
              }
              label="وارد کردن اطلاعات"
            />
          </FormGroup>
        )}
        <Grid container direction="row" spacing={16} alignItems="flex-end">
          <Grid item xs={4}>
            <TextField
              className={classes.primary}
              label="شماره ملی"
              value={persian.toPersian(record.userName)}
              onChange={this.props.onTextChange(this.props.name + "userName")}
              fullWidth
              error={this.state.shouldSearch && record.userNameerr}
              required={required}
              disabled={this.state.shouldGoNext || this.state.shouldEnter}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  this.handleNext()
                }
            }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              className={classes.primary}
              label="نام"
              value={record.fname}
              onChange={this.props.onTextChange(this.props.name + "fname")}
              fullWidth
              error={this.state.shouldEnter && record.fnameerr}
              required={required}
              disabled={this.state.shouldSearch || this.state.shouldGoNext}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              className={classes.primary}
              label="نام خانوادگی"
              value={record.lname}
              onChange={this.props.onTextChange(this.props.name + "lname")}
              fullWidth
              error={this.state.shouldEnter && record.lnameerr}
              required={required}
              disabled={this.state.shouldSearch || this.state.shouldGoNext}
            />
          </Grid>
        </Grid>
        <Grid container direction="row" spacing={16} alignItems="flex-end">
          <Grid item xs={4}>
            <TextField
              className={classes.primary}
              label="نام پدر"
              value={record.faname}
              onChange={this.props.onTextChange(this.props.name + "faname")}
              fullWidth
              error={this.state.shouldEnter && record.fanameerr}
              required={required}
              disabled={this.state.shouldSearch || this.state.shouldGoNext}
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl
              className={classes.formControl}
              fullWidth
              required={required}
              error={this.state.shouldEnter && record.degreeerr}
              disabled={this.state.shouldSearch || this.state.shouldGoNext}
            >
              <InputLabel>تحصیلات</InputLabel>
              <Select
                value={record.degree}
                onChange={this.props.onTextChange(this.props.name + "degree")}
              >
                <MenuItem value="زیر دیپلم">زیر دیپلم</MenuItem>
                <MenuItem value="دیپلم">دیپلم</MenuItem>
                <MenuItem value="کارشناسی">کارشناسی</MenuItem>
                <MenuItem value="کارشناسی ارشد">کارشناسی ارشد</MenuItem>
                <MenuItem value="دکتری">دکتری</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <TextField
              className={classes.primary}
              label="رشته‌ی تحصیلی"
              value={record.major}
              onChange={this.props.onTextChange(this.props.name + "major")}
              fullWidth
              error={this.state.shouldEnter && record.majorerr}
              required={required}
              disabled={this.state.shouldSearch || this.state.shouldGoNext}
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
            <TextField
              id={this.props.name + "datepicker"}
              disabled={this.state.shouldSearch || this.state.shouldGoNext}
              onChange={this.props.onTextChange(this.props.name + "birthdaykeybord")}
            />

            {/* <MuiPickersUtilsProvider utils={MomentUtils} locale="fa">
              <DatePicker
                clearable={false}
                okLabel="تأیید"
                cancelLabel="لغو"
                label="تاریخ تولد"
                labelFunc={date => (date ? date.format("YYYY/M/D") : "")}
                value={record.birthDay}
                onChange={this.props.onDateChange(this.props.name)}
                animateYearScrolling={false}
                disableFuture
                fullWidth
                error={this.state.shouldEnter && record.birthDayerr}
                required={required}
                disabled={this.state.shouldSearch || this.state.shouldGoNext}
              />
              </MuiPickersUtilsProvider> */}
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="تلفن همراه"
              value={persian.toPersian(record.mobile)}
              onChange={this.props.onTextChange(this.props.name + "mobile")}
              fullWidth
              error={this.state.shouldEnter && record.mobileerr}
              required={required}
              disabled={this.state.shouldSearch || this.state.shouldGoNext}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="رایانامه"
              value={record.email}
              onChange={this.props.onTextChange(this.props.name + "email")}
              fullWidth
              error={this.state.shouldEnter && record.emailerr}
              required={required}
              disabled={this.state.shouldSearch || this.state.shouldGoNext}
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
            <TextField
              label="شغل"
              value={record.job}
              onChange={this.props.onTextChange(this.props.name + "job")}
              fullWidth
              error={this.state.shouldEnter && record.joberr}
              required={required}
              disabled={this.state.shouldSearch || this.state.shouldGoNext}
            />
          </Grid>
          <Grid item xs={8}>
            <TextField
              label="آدرس منزل"
              value={record.haddress}
              onChange={this.props.onTextChange(this.props.name + "haddress")}
              fullWidth
              error={this.state.shouldEnter && record.haddresserr}
              required={required}
              disabled={this.state.shouldSearch || this.state.shouldGoNext}
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
            <TextField
              label="تلفن منزل"
              value={persian.toPersian(record.homephone)}
              onChange={this.props.onTextChange(this.props.name + "homephone")}
              fullWidth
              error={this.state.shouldEnter && record.homephoneerr}
              disabled={this.state.shouldSearch || this.state.shouldGoNext}
            />
          </Grid>
          <Grid item xs={8}>
            <TextField
              label="آدرس محل کار"
              value={record.waddress}
              onChange={this.props.onTextChange(this.props.name + "waddress")}
              fullWidth
              error={this.state.shouldEnter && record.waddresserr}
              required={required}
              disabled={this.state.shouldSearch || this.state.shouldGoNext}
            />
          </Grid>
        </Grid>

        <Grid container direction="row" alignItems="stretch" spacing={16}>
          <Grid item style={{ flexGrow: 1 }}>
            <Button
              disabled={activeStep === 0 || this.state.loading}
              onClick={this.handleBack}
              className={classes.primary}
              variant="contained"
              color="secondary"
              fullWidth
            >
              قبلی
            </Button>
          </Grid>
          <Grid item style={{ flexGrow: 1 }}>
            <Button
              onClick={this.props.onCancel}
              className={classes.primary}
              variant="contained"
              color="secondary"
              fullWidth
            >
              لغو
            </Button>
          </Grid>
          <Grid item style={{ flexGrow: 1 }}>
            <Button
              className={classes.primary}
              variant="contained"
              color="secondary"
              fullWidth
              disabled={this.state.loading}
              onClick={this.handleNext}
            >
              {this.state.loading && (
                <CircularProgress
                  className={classes.buttonProgress}
                  size={24}
                />
              )}
              {this.state.shouldSearch && "جستجو"}
              {this.state.shouldEnter && "تأیید"}
              {this.state.shouldGoNext && "بعدی"}
            </Button>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}
ParentRegisterForm.propTypes = {
  classes: PropTypes.object.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  activeStep: PropTypes.number.isRequired,
  required: PropTypes.bool.isRequired,
  record: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  onTextChange: PropTypes.func.isRequired,
  onDateChange: PropTypes.func.isRequired,
  onGetParent: PropTypes.func.isRequired,
  accessError: PropTypes.bool.isRequired,
  gotData: PropTypes.bool.isRequired,
  NotGotData: PropTypes.bool.isRequired,
  onGotData: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  confirmed: PropTypes.bool.isRequired,
  onCheckBoxChange: PropTypes.func.isRequired
};

const ParentRegisterFormWrapper = withStyles(styles)(ParentRegisterForm);
class StudentRegisterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessages: [],
      shouldEnter: false,
      shouldSearch: this.props.required ? true : false,
      shouldGoNext: this.props.required ? false : true,
      loading: false,
      check: false,
      waitingImage: false,
      imageTitle:'بارگذاری عکس',
      file: this.props.record.image.length==0? null:{url:this.props.record.image}
    };
    this.handleNext = this.handleNext.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleCheckBox = this.handleCheckBox.bind(this);
    this.handleDateChange = null;
    this.handleFiles = this.handleFiles.bind(this);
    this.handleRemoveImage = this.handleRemoveImage.bind(this);
  }
  componentDidMount() {
    this.handleDateChange = this.props.onDateChange(this.props.name);
    this.datePicker = $(`#${this.props.name}datepicker`).persianDatepicker({
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
    const shouldEnter = Cookies.get(`${this.props.name}shouldEnter`)
      ? Cookies.get(`${this.props.name}shouldEnter`) === "true"
      : false;
    const shouldSearch = Cookies.get(`${this.props.name}shouldSearch`)
      ? Cookies.get(`${this.props.name}shouldSearch`) === "true"
      : this.props.required
        ? true
        : false;
    const shouldGoNext = Cookies.get(`${this.props.name}shouldGoNext`)
      ? Cookies.get(`${this.props.name}shouldGoNext`) === "true"
      : this.props.required
        ? false
        : true;

    const check = Cookies.get(`${this.props.name}check`) === "true";

    this.setState({
      shouldEnter: shouldEnter,
      shouldSearch: shouldSearch,
      shouldGoNext: shouldGoNext,
      check: check
    });
  }
  componentWillUnmount() {
    this.setState({ errorMessages: [] });
  }
  componentDidUpdate() {
    if((this.state.file === null || this.state.file.url !== this.props.record.image) && 
      this.props.record.image.length !== 0)
      this.setState({file: {url:this.props.record.image}});
  }
  handleCheckBox(e) {
    this.setState(
      {
        shouldEnter: false,
        shouldSearch: e.target.checked,
        shouldGoNext: !e.target.checked,
        check: e.target.checked
      },
      this.props.onCheckBoxChange(e.target.checked, this.props.name)
    );
  }
  handleNext() {
    const error = {
      "نام ": this.props.record.fnameerr,
      "نام خانوادگی ": this.props.record.lnameerr,
      "شماره ملی ": this.props.record.userNameerr,
      "نام پدر ": this.props.record.fanameerr,
      "رایانامه ": this.props.record.emailerr,
      "شماره‌ی همراه ": this.props.record.mobileerr,
      "پایه‌ی تحصیلی ": this.props.record.gradeerr,
      "تاریخ تولد ": this.props.record.birthDayerr,
      "محل تولد":this.props.record.birthplaceerr,
      "محل صدور":this.props.record.issueplaceerr,
      "دین":this.props.record.religionerr,
      "مذهب":this.props.record.mazhaberr,
      "ملیت":this.props.record.citizenshiperr,
      "سال تحصیلی":this.props.record.academicyearerr,
    };
    if (this.state.shouldSearch) {
      if (this.props.record.userNameerr) {
        this.handleError("شماره ملی معتبر نیست");
      } else {
        this.setState(
          { loading: true },
          this.props.onGetStudent(this.props.name)
        );
      }
    } else if (this.state.shouldEnter) {
      let foundError = false;
      for (let err in error) {
        if (error[err]) {
          foundError = true;
          this.handleError(err + "معتبر نیست");
        }
      }
      if (!foundError) {
        this.setState(
          { shouldEnter: false, shouldGoNext: true },
          this.props.onConfirm(this.props.name)
        );
      }
    } else if (this.state.shouldGoNext) {
      const shouldEnter =
        this.props.required && this.props.confirmed ? true : false;
      const shouldSearch = !this.props.confirmed ? true : false;
      Cookies.set(
        `${this.props.name}shouldEnter`,
        (shouldEnter && !shouldSearch).toString(),
        {
          path: ""
        }
      );
      Cookies.set(
        `${this.props.name}shouldSearch`,
        (shouldSearch && !shouldEnter).toString(),
        {
          path: ""
        }
      );
      Cookies.set(
        `${this.props.name}shouldGoNext`,
        (!shouldEnter && !shouldSearch).toString(),
        {
          path: ""
        }
      );
      Cookies.set(`${this.props.name}check`, this.state.check.toString(), {
        path: ""
      });
      this.props.onNext();
    }
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
  componentDidUpdate() {
    this.datePicker.setDate(new Date(this.props.record.birthDay).valueOf())
    if (this.props.NotGotData) {
      this.setState(
        { loading: false, shouldSearch: false, shouldEnter: true },
        this.props.onGotData(this.props.name)
      );
    } else if (this.state.loading && this.props.accessError) {
      this.setState({ loading: false });
    } else if (this.props.gotData) {
      this.setState(
        { loading: false, shouldSearch: false, shouldEnter: true },
        this.props.onGotData(this.props.name)
      );
    }
  }
  handleBack() {
    const shouldEnter =
      this.props.required && this.props.confirmed ? true : false;
    const shouldSearch = !this.props.confirmed ? true : false;
    Cookies.set(`${this.props.name}shouldEnter`, shouldEnter && !shouldSearch, {
      path: ""
    });
    Cookies.set(
      `${this.props.name}shouldSearch`,
      shouldSearch && !shouldEnter,
      {
        path: ""
      }
    );
    Cookies.set(
      `${this.props.name}shouldGoNext`,
      !shouldEnter && !shouldSearch,
      {
        path: ""
      }
    );
    this.props.onPrev(this.props.name);
  }
  handleFiles(files){
    this.setState({file: files.fileList[0]});
    let formdata = new FormData();
    this.setState({waitingImage:true});
    formdata.append("Attachment", this.state.file)
    const req = axios.create({
        baseURL: configs.apiUrl,
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: localStorage.getItem("access-token")
        }
    });
    req.post("/school/upload/profile", formdata).then(res=>{
      this
      .state
        .file["url"] = res.data.uri;
        this.setState({waitingImage:false,imageTitle:'حذف عکس'});
      this.props.onImageChange(this.state.file.url);
    }).catch (error=> {
        this.setState({waitingImage:false,file:null,imageTitle:'بارگذاری عکس',});
        // this.setState(
        //     {message: "تصویر بارگذاری نشده است", messageOpen: true, messageType: "error"}
        // );
    })
  }
  handleRemoveImage(){
    this.setState({waitingImage:false,imageTitle:'بارگذاری عکس',file:null});
    this.props.onImageChange("");
  }
  render() {
    const { classes, activeStep, required, record } = this.props;
    console.log(record.academicyear);
    return (
      <React.Fragment>
        {this.state.errorMessages.map((err, id) => {
          console.log('error is: ',err)
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
        {!this.props.required && (
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.check}
                  onChange={this.handleCheckBox}
                  value="shouldEnter"
                />
              }
              label="وارد کردن اطلاعات"
            />
          </FormGroup>
        )}
        {
          this.state.file !== null && 
          <img
            className={classes.image}
            src={configs.publicUrl + '/' + this.state.file.url}
          />
        }
        <Grid container direction="row" spacing={16} alignItems="flex-end">
          <Grid item xs={4}>
            <TextField
              className={classes.primary}
              label="شماره ملی"
              value={persian.toPersian(record.userName)}
              onChange={this.props.onTextChange(this.props.name + "userName")}
              fullWidth
              error={this.state.shouldSearch && record.userNameerr}
              required={required}
              disabled={this.state.shouldGoNext || this.state.shouldEnter}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  this.handleNext()
                }
            }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              className={classes.primary}
              label="نام"
              value={record.fname}
              onChange={this.props.onTextChange(this.props.name + "fname")}
              fullWidth
              error={this.state.shouldEnter && record.fnameerr}
              required={required}
              disabled={this.state.shouldSearch || this.state.shouldGoNext}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              className={classes.primary}
              label="نام خانوادگی"
              value={record.lname}
              onChange={this.props.onTextChange(this.props.name + "lname")}
              fullWidth
              error={this.state.shouldEnter && record.lnameerr}
              required={required}
              disabled={this.state.shouldSearch || this.state.shouldGoNext}
            />
          </Grid>
        </Grid>
        <Grid container direction="row" spacing={16} alignItems="flex-end">
          <Grid item xs={4}>
            <TextField
              className={classes.primary}
              label="نام پدر"
              value={record.faname}
              onChange={this.props.onTextChange(this.props.name + "faname")}
              fullWidth
              error={this.state.shouldEnter && record.fanameerr}
              required={required}
              disabled={this.state.shouldSearch || this.state.shouldGoNext}
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl
              className={classes.formControl}
              fullWidth
              required={required}
              error={this.state.shouldEnter && record.gradeerr}
              disabled={this.state.shouldSearch || this.state.shouldGoNext}
            >
              <InputLabel>پایه‌ی تحصیلی</InputLabel>
              <Select
                value={record.grade}
                onChange={this.props.onTextChange(this.props.name + "grade")}
              >
                <MenuItem value="پیش‌دبستانی">پیش‌دبستانی</MenuItem>
                <MenuItem value="اول">اول</MenuItem>
                <MenuItem value="دوم">دوم</MenuItem>
                <MenuItem value="سوم">سوم</MenuItem>
                <MenuItem value="چهارم">چهارم</MenuItem>
                <MenuItem value="پنجم">پنجم</MenuItem>
                <MenuItem value="ششم">ششم</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            {/* <MuiPickersUtilsProvider utils={JalaliUtils} locale="fa">
              <DatePicker
                clearable={false}
                okLabel="تأیید"
                cancelLabel="لغو"
                label="تاریخ تولد"
                labelFunc={date => (date ? date.format("jYYYY/jMM/jDD") : "")}
                value={jMoment(record.birthDay)}
                onChange={this.props.onDateChange(this.props.name)}
                animateYearScrolling={true}
                disableFuture
                fullWidth
                error={this.state.shouldEnter && record.birthDayerr}
                required={required}
                disabled={this.state.shouldSearch || this.state.shouldGoNext}
              />
            </MuiPickersUtilsProvider> */}
            <TextField
              id={this.props.name + "datepicker"}
              disabled={this.state.shouldSearch || this.state.shouldGoNext}
              onChange={this.props.onTextChange(this.props.name + "birthdaykeybord")}
            />
          </Grid>
        </Grid>
        <Grid container direction="row" spacing={16} alignItems="flex-end">
          <Grid item xs={4}>
            <TextField
              className={classes.primary}
              label="تابعیت"
              value={record.citizenship}
              onChange={this.props.onTextChange(this.props.name + "citizenship")}
              fullWidth
              error={this.state.shouldEnter && record.citizenshiperr}
              required={required}
              disabled={this.state.shouldSearch || this.state.shouldGoNext}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              className={classes.primary}
              label="محل تولد"
              value={persian.toPersian(record.birthplace)}
              onChange={this.props.onTextChange(this.props.name + "birthplace")}
              fullWidth
              error={this.state.shouldEnter && record.birthplaceerr}
              required={required}
              disabled={this.state.shouldSearch || this.state.shouldGoNext}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              className={classes.primary}
              label="محل صدور"
              value={record.issueplace}
              onChange={this.props.onTextChange(this.props.name + "issueplace")}
              fullWidth
              error={this.state.shouldEnter && record.issueplaceerr}
              required={required}
              disabled={this.state.shouldSearch || this.state.shouldGoNext}
            />
          </Grid>
        </Grid>
        <Grid container direction="row" spacing={16} alignItems="flex-end">
          <Grid item xs={4}>
            <TextField
              className={classes.primary}
              label="دین"
              value={persian.toPersian(record.religion)}
              onChange={this.props.onTextChange(this.props.name + "religion")}
              fullWidth
              error={this.state.shouldEnter && record.religionerr}
              required={required}
              disabled={this.state.shouldSearch || this.state.shouldGoNext}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              className={classes.primary}
              label="مذهب"
              value={record.mazhab}
              onChange={this.props.onTextChange(this.props.name + "mazhab")}
              fullWidth
              error={this.state.shouldEnter && record.mazhaberr}
              required={required}
              disabled={this.state.shouldSearch || this.state.shouldGoNext}
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl
              className={classes.formControl}
              fullWidth
              required={required}
              error={this.state.shouldEnter && record.gradeerr}
              disabled={this.state.shouldSearch || this.state.shouldGoNext}
            >
              <InputLabel>سال تحصیلی</InputLabel>
              <Select
                value={record.academicyear}
                onChange={this.props.onTextChange(this.props.name + "academicyear")}
              >
                <MenuItem value='current year'>{persian.toPersian(Momentj(academicyearCreator(jMoment())).jYear()+'-'+(Momentj(academicyearCreator(jMoment())).jYear()+1))}</MenuItem>
                <MenuItem value='next year'>{persian.toPersian(Momentj(academicyearCreator(jMoment()).add(1, 'years')).jYear()+'-'+(Momentj(academicyearCreator(jMoment()).add(1, 'years')).jYear()+1))}</MenuItem>
              </Select>
            </FormControl>
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
            <TextField
              label="تلفن همراه"
              value={persian.toPersian(record.mobile)}
              onChange={this.props.onTextChange(this.props.name + "mobile")}
              fullWidth
              error={this.state.shouldEnter && record.mobileerr}
              required={required}
              disabled={this.state.shouldSearch || this.state.shouldGoNext}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="رایانامه"
              value={record.email}
              onChange={this.props.onTextChange(this.props.name + "email")}
              fullWidth
              error={this.state.shouldEnter && record.emailerr}
              required={required}
              disabled={this.state.shouldSearch || this.state.shouldGoNext}
            />
          </Grid>
          <Grid item xs={4}>
          {this.state.imageTitle=='بارگذاری عکس'?
            <ReactFileReader
              disabled={this.state.shouldSearch || this.state.shouldGoNext} 
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
            <Button disabled={this.state.shouldSearch || this.state.shouldGoNext} color="primary" fullWidth onClick={this.handleRemoveImage}>
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
        <Grid container direction="row" alignItems="stretch" spacing={16}>
          <Grid item style={{ flexGrow: 1 }}>
            <Button
              disabled={activeStep === 0 || this.state.loading}
              onClick={this.handleBack}
              className={classes.primary}
              variant="contained"
              color="secondary"
              fullWidth
            >
              قبلی
            </Button>
          </Grid>
          <Grid item style={{ flexGrow: 1 }}>
            <Button
              onClick={this.props.onCancel}
              className={classes.primary}
              variant="contained"
              color="secondary"
              fullWidth
            >
              لغو
            </Button>
          </Grid>
          <Grid item style={{ flexGrow: 1 }}>
            <Button
              className={classes.primary}
              variant="contained"
              color="secondary"
              fullWidth
              disabled={this.state.loading}
              onClick={this.handleNext}
            >
              {this.state.loading && (
                <CircularProgress
                  className={classes.buttonProgress}
                  size={24}
                />
              )}
              {this.state.shouldSearch && "جستجو"}
              {this.state.shouldEnter && "تأیید"}
              {this.state.shouldGoNext && "بعدی"}
            </Button>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}
StudentRegisterForm.propTypes = {
  classes: PropTypes.object.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  activeStep: PropTypes.number.isRequired,
  required: PropTypes.bool.isRequired,
  record: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  onImageChange: PropTypes.func.isRequired,
  onTextChange: PropTypes.func.isRequired,
  onDateChange: PropTypes.func.isRequired,
  onGetStudent: PropTypes.func.isRequired,
  accessError: PropTypes.bool.isRequired,
  gotData: PropTypes.bool.isRequired,
  NotGotData: PropTypes.bool.isRequired,
  onGotData: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  confirmed: PropTypes.bool.isRequired,
  onCheckBoxChange: PropTypes.func.isRequired
};

const StudentRegisterFormWrapper = withStyles(styles)(StudentRegisterForm);

function getSteps() {
  return ["ثبت سرپرست اول", "ثبت سرپرست دوم", "ثبت دانش آموز"];
}
function getStepContent(
  step,
  nextHandler,
  prevHandler,
  cancelHandler,
  activeStep,
  records,
  onTextChange,
  onImageChange,
  onDateChange,
  handleGetParent,
  handleGotDataAck,
  handleConfirm,
  handleGetStudent,
  handleCheckBoxChange
) {
  switch (step) {
    case 0:
      return (
        <ParentRegisterFormWrapper
          onNext={nextHandler}
          onPrev={prevHandler}
          onCancel={cancelHandler}
          activeStep={activeStep}
          record={{
            birthDay: records.p1birthDay,
            fname: records.p1fname,
            lname: records.p1lname,
            faname: records.p1faname,
            userName: records.p1userName,
            email: records.p1email,
            mobile: records.p1mobile,
            degree: records.p1degree,
            major: records.p1major,
            job: records.p1job,
            haddress: records.p1haddress,
            waddress: records.p1waddress,
            homephone: records.p1homephone,
            majorerr: records.p1majorerr,
            birthDayerr: records.p1birthDayerr,
            fnameerr: records.p1fnameerr,
            lnameerr: records.p1lnameerr,
            fanameerr: records.p1fanameerr,
            userNameerr: records.p1userNameerr,
            emailerr: records.p1emailerr,
            mobileerr: records.p1mobileerr,
            degreeerr: records.p1degreeerr,
            joberr: records.p1joberr,
            haddresserr: records.p1haddresserr,
            waddresserr: records.p1waddresserr,
            homephoneerr: records.p1homephoneerr,
          }}
          name="p1"
          onTextChange={onTextChange}
          onDateChange={onDateChange}
          onGetParent={handleGetParent}
          accessError={records.p1accessError}
          gotData={records.p1GotData}
          NotGotData={records.p1NotGotData}
          onGotData={handleGotDataAck}
          onConfirm={handleConfirm}
          onCheckBoxChange={handleCheckBoxChange}
          required
          confirmed={records.p1entered}
        />
      );
    case 1:
      return (
        <ParentRegisterFormWrapper
          onNext={nextHandler}
          onPrev={prevHandler}
          onCancel={cancelHandler}
          activeStep={activeStep}
          record={{
            birthDay: records.p2birthDay,
            fname: records.p2fname,
            lname: records.p2lname,
            faname: records.p2faname,
            userName: records.p2userName,
            email: records.p2email,
            mobile: records.p2mobile,
            degree: records.p2degree,
            major: records.p2major,
            job: records.p2job,
            haddress: records.p2haddress,
            waddress: records.p2waddress,
            homephone: records.p2homephone,
            majorerr: records.p2majorerr,
            birthDayerr: records.p2birthDayerr,
            fnameerr: records.p2fnameerr,
            lnameerr: records.p2lnameerr,
            fanameerr: records.p2fanameerr,
            userNameerr: records.p2userNameerr,
            emailerr: records.p2emailerr,
            mobileerr: records.p2mobileerr,
            degreeerr: records.p2degreeerr,
            joberr: records.p2joberr,
            haddresserr: records.p2haddresserr,
            waddresserr: records.p2waddresserr,
            homephoneerr: records.p2homephoneerr,
          }}
          name="p2"
          onTextChange={onTextChange}
          onDateChange={onDateChange}
          onGetParent={handleGetParent}
          accessError={records.p2accessError}
          gotData={records.p2GotData}
          NotGotData={records.p2NotGotData}
          onGotData={handleGotDataAck}
          onCheckBoxChange={handleCheckBoxChange}
          onConfirm={handleConfirm}
          confirmed={records.p2entered}
          required={false}
        />
      );
    case 2:
      return (
        <StudentRegisterFormWrapper
          onNext={nextHandler}
          onPrev={prevHandler}
          onCancel={cancelHandler}
          activeStep={activeStep}
          record={{
            birthDay: records.s1birthDay,
            fname: records.s1fname,
            lname: records.s1lname,
            faname: records.s1faname,
            userName: records.s1userName,
            email: records.s1email,
            mobile: records.s1mobile,
            image: records.s1image,
            birthplace: records.s1birthplace,
            issueplace: records.s1issueplace,
            religion: records.s1religion,
            mazhab: records.s1mazhab,
            citizenship: records.s1citizenship,
            academicyear:records.s1academicyear,
            grade: records.s1grade,
            birthDayerr: records.s1birthDayerr,
            fnameerr: records.s1fnameerr,
            lnameerr: records.s1lnameerr,
            fanameerr: records.s1fanameerr,
            userNameerr: records.s1userNameerr,
            emailerr: records.s1emailerr,
            mobileerr: records.s1mobileerr,
            gradeerr: records.s1gradeerr,
            birthplaceerr: records.s1birthplaceerr,
            issueplaceerr: records.s1issueplaceerr,
            religionerr: records.s1religionerr,
            mazhaberr: records.s1mazhaberr,
            citizenshiperr: records.s1citizenshiperr,
            academicyearerr:records.s1academicyearerr,
          }}
          name="s1"
          onImageChange={onImageChange}
          onTextChange={onTextChange}
          onDateChange={onDateChange}
          onGetStudent={handleGetStudent}
          accessError={records.s1accessError}
          gotData={records.s1GotData}
          NotGotData={records.s1NotGotData}
          onGotData={handleGotDataAck}
          onCheckBoxChange={handleCheckBoxChange}
          onConfirm={handleConfirm}
          confirmed={records.s1entered}
          required
        />
      );

    default:
      return "Unknown step";
  }
}

class AddManagerForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      print:false,
      printTable:false,
      printObject:null,
      //states for parent one
      p1fname: "",
      p1lname: "",
      p1userName: "",
      p1faname: "",
      p1email: "example@example.com",
      p1mobile: "",
      p1homephone: "",
      p1degree: "کارشناسی",
      p1major: "نامشخص",
      p1job: "نامشخص",
      p1haddress: "",
      p1waddress: "",
      p1birthDay: jMoment(),
      p1fnameerr: true,
      p1lnameerr: true,
      p1userNameerr: true,
      p1fanameerr: true,
      p1emailerr: false,
      p1mobileerr: true,
      p1homephoneerr: false,
      p1degreeerr: false,
      p1majorerr: false,
      p1birthDayerr: false,
      p1joberr: false,
      p1haddresserr: true,
      p1waddresserr: true,
      p1entered: false,
      p1accessError: false,
      p1GotData: false,
      p1NotGotData: false,

      //states for parent two
      p2fname: "",
      p2lname: "",
      p2userName: "",
      p2faname: "",
      p2email: "example@example.com",
      p2mobile: "",
      p2degree: "کارشناسی",
      p2major: "نامشخص",
      p2job: "نامشخص",
      p2haddress: "",
      p2homephone: "",
      p2waddress: "",
      p2birthDay: jMoment(),
      p2fnameerr: true,
      p2lnameerr: true,
      p2userNameerr: true,
      p2fanameerr: true,
      p2emailerr: false,
      p2mobileerr: true,
      p2degreeerr: false,
      p2majorerr: false,
      p2birthDayerr: false,
      p2joberr: false,
      p2haddresserr: true,
      p2waddresserr: true,
      p2homephoneerr: false,
      p2entered: false,
      p2accessError: false,
      p2GotData: false,
      p2NotGotData: false,

      //state for student
      s1fname: "",
      s1image: "",
      s1lname: "",
      s1userName: "",
      s1faname: "",
      s1email: "example@example.com",
      s1mobile: "",
      s1birthDay: jMoment(),
      s1grade: "اول",
      s1birthplace: "",
      s1issueplace: "",
      s1religion: "اسلام",
      s1mazhab: "شیعه",
      s1citizenship: "ایران",
      s1academicyear:'current year',
      s1entered: false,
      s1accessError: false,
      s1GotData: false,
      s1NotGotData: false,

      s1fnameerr: true,
      s1lnameerr: true,
      s1userNameerr: true,
      s1fanameerr: true,
      s1emailerr: false,
      s1mobileerr: true,
      s1birthDayerr: false,
      s1gradeerr: false,
      s1birthplaceerr: false,
      s1issueplaceerr: false,
      s1religionerr: false,
      s1mazhaberr: false,
      s1citizenshiperr: false,
      s1academicyearerr:false,

      //control states
      activeStep: 0,
      errorMessages: [],
      loading: false,
      school_name:"",
      school_logo:"",
    };
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleBtnClick = this.handleBtnClick.bind(this);
    this.handleGetParent = this.handleGetParent.bind(this);
    this.handleGetStudent = this.handleGetStudent.bind(this);
    this.handleGotDataAck = this.handleGotDataAck.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
    this.clearCookies = this.clearCookies.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
  }
  handleImageChange(url){
    this.setState({s1image:url});
  }
  handleCheckBoxChange(check, name) {
    this.setState({ [name + "entered"]: check });
  }
  handleConfirm(name) {
    this.setState({ [name.slice(0, 2) + "entered"]: true });
  }
  handleCancel() {
    this.clearCookies();
    this.props.onCancel();
  }
  handleGotDataAck(name) {
    this.setState({ [name + "GotData"]: false, [name + "NotGotData"]: false });
  }
  handleDateChange(name) {
    const validator = this.validate("birthDay");
    return date => {
      this.setState({
        [name + "birthDay"]: date,
        [name + "birthDayerr"]: validator(date)
      });
    };
  }
  handleErrorExit(id) {
    return () => {
      this.setState(prevState => {
        prevState.errorMessages.splice(id, 1);
        console.log('on exit call ',prevState.errorMessages)
        return {
          errorMessages: prevState.errorMessages,
          p1accessError: false,
          p2accessError: false,
          loading: false
        };
      });
    };
  }
  handleError(message, name) {
    this.setState(prevState => {
      return {
        errorMessages: prevState.errorMessages.concat(message),
        [name + "accessError"]: true
      };
    });
  }
  handleGetParent(name) {
    const req = axios.create({
      baseURL: configs.apiUrl,
      headers: {
        Authorization: localStorage.getItem("access-token")
      }
    });

    const id = persian.toEnglish(this.state[`${name}userName`]);
    const otherParentId =
      name === "p1"
        ? persian.toEnglish(this.state["p2" + "userName"])
        : persian.toEnglish(this.state["p1" + "userName"]);
    if (id === otherParentId) {
      this.handleError("شماره ملی تکراریست", name);
    } else {
      req
        .get(`/parent/${id}`)
        .then(res => {
          this.setState({
            [name + "fname"]: res.data.FirstName,
            [name + "lname"]: res.data.LastName,
            [name + "faname"]: res.data.FatherName,
            [name + "birthDay"]: res.data.BirthDay,
            [name + "haddress"]: res.data.HomeAddress
              ? res.data.HomeAddress
              : "",
            [name + "waddress"]: res.data.WorkAddress
              ? res.data.WorkAddress
              : "",
            [name + "degree"]: res.data.EducationalDegree
              ? res.data.EducationalDegree
              : "زیر دیپلم",
            [name + "email"]: res.data.Email,
            [name + "job"]: res.data.Job ? res.data.Job : "",
            [name + "major"]: res.data.Major,
            [name + "mobile"]: res.data.Mobile,
            [name + "homephone"]: res.data.HomePhone?res.data.HomePhone:"",
            [name + "fnameerr"]: false,
            [name + "lnameerr"]: false,
            [name + "fanameerr"]: false,
            [name + "birthDayerr"]: false,
            [name + "haddresserr"]: res.data.HomeAddress === "",
            [name + "waddresserr"]: res.data.WorkAddress === "",
            [name + "degreeerr"]: false,
            [name + "emailerr"]: false,
            [name + "joberr"]: res.data.Job === "",
            [name + "majorerr"]: false,
            [name + "mobileerr"]: false,
            [name + "homephoneerr"]: false,
            [name + "GotData"]: true
          });
          if(name=="p1"){
            this.setState({
              s1faname:   this.state.p1fname,
              s1fanameerr:this.state.p1fnameerr,
              s1lname:    this.state.p1lname,
              s1lnameerr: this.state.p1lnameerr,
              s1email:    this.state.p1email,
              s1emailerr: this.state.p1emailerr,
              s1mobile:   this.state.p1mobile,
              s1mobileerr:this.state.p1mobileerr
            });
          }
        })
        .catch(error => {
          switch (error.response.data.errorNumber) {
            case "021":
              this.handleError("چنین کاربری در سیستم وجود دارد", name);
              break;
            case "022":
              this.setState(
                { [name + "NotGotData"]: true },
                this.handleError("چنین کاربری در سیستم وجود ندارد", name)
              );
              break;
            default:
              this.handleError("خطای دسترسی به سرور", name);
              break;
          }
        });
    }
  }

  handleGetStudent(name) {
    const req = axios.create({
      baseURL: configs.apiUrl,
      headers: {
        Authorization: localStorage.getItem("access-token")
      }
    });

    const id = persian.toEnglish(this.state[`${name}userName`]);
    let parentIds = [persian.toEnglish(this.state["p1" + "userName"])];
    if (this.state["p2entered"]) {
      parentIds.push(persian.toEnglish(this.state["p2" + "userName"]));
    }
    for (let parentId of parentIds) {
      if (id === parentId) {
        return this.handleError("شماره ملی تکراریست", name);
      }
    }

    req
      .get(`/student/${id}`)
      .then(res => {
        this.setState({
          [name + "fname"]: res.data.FirstName,
          [name + "lname"]: res.data.LastName,
          [name + "faname"]: res.data.FatherName,
          [name + "birthDay"]: res.data.BirthDay,
          [name + "grade"]: res.data.Grade ? res.data.Grade : "اول",
          [name + "email"]: res.data.Email,
          [name + "mobile"]: res.data.Mobile,
          [name + "image"]: res.data.hasOwnProperty('Image')? res.data.Image:"",
          [name + "birthplace"]: res.data.hasOwnProperty("BirthPlace")?res.data.BirthPlace:"",
          [name + "issueplace"]: res.data.hasOwnProperty("IssuePlace")?res.data.IssuePlace:"",
          [name + "religion"]: res.data.hasOwnProperty("Religion")?res.data.Religion:"اسلام",
          [name + "mazhab"]: res.data.hasOwnProperty("Mazhab")?res.data.Mazhab:"شیعه",
          [name + "citizenship"]: res.data.hasOwnProperty("Citizenship")?res.data.Citizenship:"ایران",
          [name + "academicyear"]: 'current year',
          [name + "fnameerr"]: false,
          [name + "lnameerr"]: false,
          [name + "fanameerr"]: false,
          [name + "birthDayerr"]: false,
          [name + "gradeerr"]: false,
          [name + "emailerr"]: false,
          [name + "mobileerr"]: false,
          [name + "birthplaceerr"]: false,
          [name + "issueplaceerr"]: false,
          [name + "religionerr"]: false,
          [name + "mazhaberr"]: false,
          [name + "citizenshiperr"]: false,
          [name + "academicyearerr"]:false,
          [name + "GotData"]: true
        });
      })
      .catch(error => {
        switch (error.response.data.errorNumber) {
          case "021":
            this.handleError("چنین کاربری در سیستم وجود دارد", name);
            break;
          case "022":
            this.setState(
              { [name + "NotGotData"]: true },
              this.handleError("چنین کاربری در سیستم وجود ندارد", name)
            );
            break;
          default:
            this.handleError("خطای دسترسی به سرور", name);
            break;
        }
      });
  }
  handleTextChange(name) {
    const validator = this.validate(name.slice(2));
    const fieldName = name.slice(2);
    return e => {
      this.setState({
        [name]:
          fieldName === "userName"
            ? e.target.value.slice(0, 10)
            : e.target.value,
        [name + "err"]: validator(
          fieldName === "userName"
            ? e.target.value.slice(0, 10)
            : e.target.value
        )
      });
      if(name=="p1fname"){
        this.setState({s1faname:e.target.value,s1fanameerr:validator(e.target.value)});
      }else if(name=="p1lname"){
        this.setState({s1lname:e.target.value ,s1lnameerr:validator(e.target.value)});
      }else if(name=="p1email"){
        this.setState({s1email:e.target.value ,s1emailerr:validator(e.target.value)});
      }else if(name == "p1mobile"){
        this.setState({s1mobile:e.target.value,s1mobileerr:validator(e.target.value)});
      }else if(name == "p1haddress"){
        this.setState({p2haddress:e.target.value,p2haddresserr:validator(e.target.value)});
      }else if(name == "p1homephone"){
        this.setState({p2homephone:e.target.value,p2homephoneerr:validator(e.target.value)});
      }
    };
  }
  handleNext = data => {
    this.setState(state => ({
      activeStep: state.activeStep + 1
    }));
  };

  handleBack = name => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
      [name.slice(0, 2) + "entered"]: false
    }));
  };
  handleReset = () => {
    this.clearCookies();
    this.setState({
      //states for parent one
      p1fname: "",
      p1lname: "",
      p1userName: "",
      p1faname: "",
      p1email: "example@example.com",
      p1mobile: "",
      p1homephone: "",
      p1degree: "کارشناسی",
      p1major: "نامشخص",
      p1job: "نامشخص",
      p1haddress: "",
      p1waddress: "",
      p1birthDay: jMoment(),
      p1fnameerr: true,
      p1lnameerr: true,
      p1userNameerr: true,
      p1fanameerr: true,
      p1emailerr: false,
      p1mobileerr: true,
      p1homephoneerr: false,
      p1degreeerr: false,
      p1majorerr: false,
      p1birthDayerr: false,
      p1joberr: false,
      p1haddresserr: true,
      p1waddresserr: true,
      p1entered: false,
      p1accessError: false,
      p1GotData: false,
      p1NotGotData: false,

      //states for parent two
      p2fname: "",
      p2lname: "",
      p2userName: "",
      p2faname: "",
      p2email: "example@example.com",
      p2mobile: "",
      p2degree: "کارشناسی",
      p2major: "نامشخص",
      p2job: "نامشخص",
      p2haddress: "",
      p2homephone: "",
      p2waddress: "",
      p2birthDay: jMoment(),
      p2fnameerr: true,
      p2lnameerr: true,
      p2userNameerr: true,
      p2fanameerr: true,
      p2emailerr: false,
      p2mobileerr: true,
      p2degreeerr: false,
      p2majorerr: false,
      p2birthDayerr: false,
      p2joberr: false,
      p2haddresserr: true,
      p2waddresserr: true,
      p2homephoneerr: false,
      p2entered: false,
      p2accessError: false,
      p2GotData: false,
      p2NotGotData: false,

      //state for student
      s1fname: "",
      s1image: "",
      s1lname: "",
      s1userName: "",
      s1faname: "",
      s1email: "",
      s1mobile: "",
      s1birthDay: jMoment(),
      s1grade: "اول",
      s1birthplace: "",
      s1issueplace: "",
      s1religion: "اسلام",
      s1mazhab: "شیعه",
      s1citizenship: "ایران",
      s1academicyear:'current year',
      s1entered: false,
      s1accessError: false,
      s1GotData: false,
      s1NotGotData: false,

      s1fnameerr: true,
      s1lnameerr: true,
      s1userNameerr: true,
      s1fanameerr: true,
      s1emailerr: true,
      s1mobileerr: true,
      s1birthDayerr: false,
      s1gradeerr: false,
      s1birthplaceerr: false,
      s1issueplaceerr: false,
      s1religionerr: false,
      s1mazhaberr: false,
      s1citizenshiperr: false,
      s1academicyearerr:false,

      //control states
      activeStep: 0,
      errorMessages: [],
      loading: false,
      school_name:"",
      school_logo:"",
    });
  };
  clearCookies() {
    Cookies.set("p1shouldEnter", "false", {
      path: ""
    });
    Cookies.set("p1shouldSearch", "true", {
      path: ""
    });
    Cookies.set("p1shouldGoNext", "false", {
      path: ""
    });
    Cookies.set("p1check", "false", {
      path: ""
    });
    Cookies.set("p2shouldEnter", "false", {
      path: ""
    });
    Cookies.set("p2shouldSearch", "false", {
      path: ""
    });
    Cookies.set("p2shouldGoNext", "true", {
      path: ""
    });
    Cookies.set("p2check", "false", {
      path: ""
    });
    Cookies.set("s1shouldEnter", "false", {
      path: ""
    });
    Cookies.set("s1shouldSearch", "true", {
      path: ""
    });
    Cookies.set("s1shouldGoNext", "false", {
      path: ""
    });
    Cookies.set("s1check", "false", {
      path: ""
    });
  }
  handleBtnClick(name) {
    switch (name) {
      case "drop":
        return () => {
          this.clearCookies();
          this.props.onCancel();
        };
      case "registerPrint":
        return () => {
          this.setState(
            { print:true,loading: true },
            function() {
              this.register(this.state)
                .then(
                  function(success) {
                    this.clearCookies();
                  }.bind(this)
                )
                .catch(
                  function(err) {
                    for (let error of err) {
                      this.handleError(error);
                    }
                  }.bind(this)
                );
            }.bind(this)
          );
        };
      case "register":
        return () => {
          this.setState(
            { loading: true },
            function() {
              this.register(this.state)
                .then(
                  function(success) {
                    this.clearCookies();
                    this.props.onRegister();
                  }.bind(this)
                )
                .catch(
                  function(err) {
                    for (let error of err) {
                      this.handleError(error);
                    }
                  }.bind(this)
                );
            }.bind(this)
          );
        };
    }
  }
  register() {
    return new Promise(
      function(accept, reject) {
        const skipP2 = !this.state.p2entered;
        let postQuery = {};
        for (let field in this.state) {
          const type = field.slice(0, 2).toUpperCase();
          const key = field.slice(2);
          if (skipP2) {
            if (type === "P2") {
              continue;
            }
          }
          switch (key) {
            case "fname":
              postQuery[
                (type === "P1" || type === "P2" ? type : "") + "FirstName"
              ] = this.state[field];
              break;
            case "lname":
              postQuery[
                (type === "P1" || type === "P2" ? type : "") + "LastName"
              ] = this.state[field];
              break;
            case "userName":
              postQuery[
                (type === "P1" || type === "P2" ? type : "") + "ID"
              ] = persian.toEnglish(this.state[field]);
              break;
            case "faname":
              postQuery[
                (type === "P1" || type === "P2" ? type : "") + "FatherName"
              ] = this.state[field];
              break;
            case "email":
              postQuery[
                (type === "P1" || type === "P2" ? type : "") + "Email"
              ] = this.state[field];
              break;
            case "mobile":
              postQuery[
                (type === "P1" || type === "P2" ? type : "") + "Mobile"
              ] =
                persian.toEnglish(this.state[field]).charAt(0) === "0"
                  ? persian.toEnglish(this.state[field].slice(1))
                  : persian.toEnglish(this.state[field]);
              break;
            case "degree":
              postQuery[
                (type === "P1" || type === "P2" ? type : "") +
                  "EducationalDegree"
              ] = this.state[field];
              break;
            case "major":
              postQuery[
                (type === "P1" || type === "P2" ? type : "") + "Major"
              ] = this.state[field];
              break;
            case "job":
              postQuery[
                (type === "P1" || type === "P2" ? type : "") + "Job"
              ] = this.state[field];
              break;
            case "haddress":
              postQuery[
                (type === "P1" || type === "P2" ? type : "") + "HomeAddress"
              ] = this.state[field];
              break;
            case "waddress":
              postQuery[
                (type === "P1" || type === "P2" ? type : "") + "WorkAddress"
              ] = this.state[field];
              break;
            case "homephone":
              if(this.state[field].length!=0){
                postQuery[
                  (type === "P1" || type === "P2" ? type : "") + "HomePhone"
                ] = persian.toEnglish(this.state[field]).charAt(0) === "0"
                ? persian.toEnglish(this.state[field].slice(1))
                : persian.toEnglish(this.state[field]);
              }
              break;
            case "grade":
              postQuery["Grade"] = this.state[field];
              break;
            case "image":
              if(this.state[field].length!==0)
                postQuery["Image"] = this.state[field];
              break;
            case "birthDay":
              postQuery[
                (type === "P1" || type === "P2" ? type : "") + "BirthDay"
              ] = this.state[field]
              break;
            case  "birthplace":
            if(this.state[field].length!=0)
              postQuery[
                (type === "P1" || type === "P2" ? type : "") + "BirthPlace"
              ] = this.state[field]
              break;
            case "issueplace":
            if(this.state[field].length!=0)
              postQuery[
                (type === "P1" || type === "P2" ? type : "") + "IssuePlace"
              ] = this.state[field]
              break;
            case "religion":
            if(this.state[field].length!=0)
              postQuery[
                (type === "P1" || type === "P2" ? type : "") + "Religion"
              ] = this.state[field]
              break;
            case "mazhab":
            if(this.state[field].length!=0)
              postQuery[
                (type === "P1" || type === "P2" ? type : "") + "Mazhab"
              ] = this.state[field]
              break;
            case "citizenship":
            if(this.state[field].length!=0)
              postQuery[
                (type === "P1" || type === "P2" ? type : "") + "Citizenship"
              ] = this.state[field]
              break;
            case "academicyear":
              postQuery[
                (type === "P1" || type === "P2" ? type : "") + "AcademicYear"
              ] = this.state[field]=="current year"? (new Date()).toISOString():(jMoment().add(1, 'years')).toISOString()
              break;
            default:
              break;
          }
        }
        const req = axios.create({
          baseURL: configs.apiUrl,
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("access-token")
          }
        });
        req
          .post("/student", postQuery)
          .then(res => {
            if(this.state.print){
              this.setState({printObject:postQuery,printTable:true});
            }
            accept(res);
          })
          .catch(() => {
            reject(["خطای دسترسی به سرور"]);
          });
      }.bind(this)
    );
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
              .regex(/^9[0-9][0-9]{8}$/)
              .required()
              .validate(number).error !== null
          );
        };
      case "homephone":
        return value => {
          if(value.length==0){
            return (
              false
            )
          }
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
      case "birthDay":
        return value => {
          return (
            Joi.string()
              .isoDate()
              .required()
              .validate(value).error !== null
          );
        };
      case "birthdaykeybord":
        return value => {
          let date = persian.toEnglish(value);
          return (
            Joi.string()
              .regex(/^1[3-4]\d{2}[/](0?[1-9]|1[0-2])[/](0?[1-9]|[12][0-9]|3[01])$/)
              .required()
              .validate(date).error !== null
          );
        };
      case "job":
        return value => {
          return (
            Joi.string()
              .trim()
              .min(3)
              .max(30)
              .regex(persianStringRegExp)
              .validate(value).error !== null
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
      case "waddress":
        return value => {
          return (
            Joi.string()
              .min(6)
              .max(100)
              .validate(value).error !== null
          );
        };
      case  "birthplace":
        return value => {
          return (
            Joi.string()
              .trim()
              .min(0)
              .max(50)
              .regex(persianStringRegExp)
              .required()
              .validate(value).error !== null
          );
        };
      case "issueplace":
        return value => {
          return (
            Joi.string()
              .trim()
              .min(0)
              .max(50)
              .regex(persianStringRegExp)
              .required()
              .validate(value).error !== null
          );
        };
      case "religion":
        return value => {
          return (
            Joi.string()
              .trim()
              .min(0)
              .max(50)
              .regex(persianStringRegExp)
              .required()
              .validate(value).error !== null
          );
        };
      case "mazhab":
        return value => {
          return (
            Joi.string()
              .trim()
              .min(0)
              .max(50)
              .regex(persianStringRegExp)
              .required()
              .validate(value).error !== null
          );
        };
      case "citizenship":
        return value => {
          return (
            Joi.string()
              .trim()
              .min(0)
              .max(50)
              .regex(persianStringRegExp)
              .required()
              .validate(value).error !== null
          );
        };
        case "academicyear":
        return value => {
          return (
            Joi.string()
              .trim()
              .valid("current year", "next year")
              .validate(value).error !== null
          );
        };
    }
  }
  componentDidMount() {
    const req = axios.create({
      baseURL: configs.apiUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("access-token")
      }
    });
    req.get("/school/about").then(res => {
      const data = res.data;
      delete data.about;
      this.setState({school_name: data.name,school_logo: configs.publicUrl + data.avatar});
    });
  }
  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep, loading } = this.state;
    const p1=[
      'شکستگی و دررفته گی ها',
      'صدمات گردن',
      'صدمات شانه ',
      'صدمات آرنج، بازو ، مچ و انگشتان',
      'صدمات ساق',
      'صدمات قفسه سینه',
      'صدمات پشت و کمر',
      'صدمات زانو',
      'صدمات لگن و مفصل ران',
      ' صدمات مچ پا',
                        ];
    const p2_0=[
'خوراکی',
'تنفسی',
'پوستی',
'آسم'];
const p2_1=[
  'صافی کف پا',
  'کیفوزیس (خمیدگی ستون فقرات به عقب)',
  'لوردوزیس(قوس کمر)'
];
const p2_2=[
'بیماری های ریوی و سرفه مزمن',
'بیماری های قلبی و عروقی',
'التهاب مفصل',
'صرع ',
'دیابت',
'اختلالات غدد',
'سردردهای متوالی و سرگیجه',
'بیماری های خونی و خونریزی های خود به خودی',
'کم خونی',
'بیماری های کلیوی و مجاری ادراری',
'هر نوع ضایعات پوستی',
'هپاتیت',
'مشکل گوارشی و روده ای',
];
const p2_3=[
  'کم شنوایی در گوش راست',
  'چپ',
  'اوتیت',
  'تنگی شیپور استاش'
]
    const p3=[
'بی قراری در خواب ',
'هیپراکتیو یا زیاد فعال بودن(H.A)',
'شب ادراری(‌B.W)',
'حرف زدن در خواب',
'اضطراب(A.S)',
'راه رفتن درخواب',
'گوشه‌گیری(W.D)',
'ناخن جویدن(N.B)',
'پرخاشگری',
'ترس از مدرسه(S.P)',
'اختلالات تکلمی(S.D)'
    ]
    return (
      <Paper style={{ padding: 20 }}>
        {this.state.errorMessages.map((err, id) => {
          console.log('error message:',err)
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
        {!this.state.printTable &&
          <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => {
            return (
              <Step key={label}>
                <StepLabel icon={persian.toPersian(index + 1)}>
                  {label}
                </StepLabel>
                <StepContent>
                  {getStepContent(
                    index,
                    this.handleNext,
                    this.handleBack,
                    this.handleCancel,
                    activeStep,
                    this.state,
                    this.handleTextChange,
                    this.handleImageChange,
                    this.handleDateChange,
                    this.handleGetParent,
                    this.handleGotDataAck,
                    this.handleConfirm,
                    this.handleGetStudent,
                    this.handleCheckBoxChange
                  )}
                </StepContent>
              </Step>
            );
          })}
        </Stepper>
        }
          {activeStep === steps.length && !this.state.printTable && (
            <React.Fragment>
              <Grid container direction="row" alignItems="stretch" spacing={16}>
                <Grid item style={{ flexGrow: 1 }}>
                  <Button
                    disabled={loading}
                    onClick={this.handleReset}
                    className={classes.primary}
                    variant="contained"
                    color="secondary"
                    fullWidth
                  >
                    پیمایش مجدد مراحل
                  </Button>
                </Grid>
                <Grid item style={{ flexGrow: 1 }}>
                  <Button
                    onClick={this.handleCancel}
                    className={classes.primary}
                    variant="contained"
                    color="secondary"
                    disabled={loading}
                    fullWidth
                  >
                    لغو
                  </Button>
                </Grid>
                <Grid item style={{ flexGrow: 1 }}>
                  <Button
                    className={classes.primary}
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={this.handleBtnClick("register")}
                    disabled={loading}
                  >
                    {loading && (
                      <CircularProgress
                        className={classes.buttonProgress}
                        size={24}
                      />
                    )}
                    تأیید نهایی
                  </Button>
                </Grid>
                <Grid item style={{ flexGrow: 1 }}>
                <Button
                    className={classes.primary}
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={this.handleBtnClick("registerPrint")}
                    disabled={loading}
                  >
                    {loading && (
                      <CircularProgress
                        className={classes.buttonProgress}
                        size={24}
                      />
                    )}
                    تأیید نهایی و چاپ
                  </Button>
                </Grid>
              </Grid>
            </React.Fragment>
          )}
          <IconButton 
                color="secondary" 
                size="small" 
                aria-label="close" 
                className={classes.closeIcon}
                onClick={this.handleCancel}
                >
                <Close />
              </IconButton>
          {activeStep === steps.length && this.state.printTable && 
            <Grid spacing={16} alignItems="center" justify='center'>
              <Grid fullWidth item>
                <ReactToPrint
                  trigger={() => <Button className={classes.primary}
                    variant="contained"
                    color="secondary">چاپ مشخصات</Button>}
                  content={() => this.componentRef}
                  pageStyle= 'height: 100px;'
                />
              </Grid>
              <Grid fullWidth item>
              <Typography paragraph={true} variant="body1"> برای چاپ نوع کاغذ A4 در حالت عمودی انتخاب شود.</Typography>
              </Grid>
              <Grid className={classes.printTable} justify='center'>
              <div dir='rtl' ref={el => (this.componentRef = el)}>
              <div className={classes.paper}>
              <Grid container direction='column' spacing={20}>
                <Grid item>
                  <Typography fullWidth align='center' paragraph={true} variant="body1">سامانه‌ی هوشمند نظارت بر دانش‌آموز (سهند)</Typography>
                </Grid>
                <Grid item>
                    <Grid container justify="center" spacing={6}>
                    <Grid item>
                    <img
                          className={classes.logo}
                          src={this.state.school_logo}
                        />
                  </Grid>
                  <Grid item>
                  <Typography variant="title" paragraph={true}>{this.state.school_name}</Typography>
                  </Grid>
                </Grid>
                </Grid>
                <Grid item>
                <Grid container justify="center" spacing={2}>
                <Grid item xs={5}>
                <Typography fullWidth align='center' variant="body1">ثبت‌نام سال تحصیلی {persian.toPersian(Momentj(academicyearCreator(jMoment(this.state.printObject.AcademicYear))).jYear()+'-'+(Momentj(academicyearCreator(jMoment(this.state.printObject.AcademicYear))).jYear()+1))}</Typography>
                </Grid>
                <Grid item xs={5}>
                <Typography fullWidth align='center' variant="body1">تاریخ: {persian.toPersian(Momentj().format("HH:mm    jYYYY/jMM/jDD"))}</Typography>
                </Grid>
                </Grid>
                </Grid>
                <Grid item>
                <Typography fullWidth align='left' variant="body1">مشخصات دانش‌آموز</Typography>
                </Grid>
                <Grid item>
                <Table className={classes.TableStyle}>
                  <TableRow>
                  <TableCell variant='body'>نام: {this.state.printObject.FirstName}</TableCell>
                  <TableCell variant='body'>نام خانوادگی: {this.state.printObject.LastName}</TableCell>
                  <TableCell variant='body'>کد ملی: {persian.toPersian(this.state.printObject.ID)}</TableCell>
                  <TableCell variant='body'>نام پدر: {this.state.printObject.FatherName}</TableCell>
                  </TableRow>
                  <TableRow>
                  <TableCell variant='body'>پایه: {this.state.printObject.Grade}</TableCell>
                  <TableCell variant='body'>تاریخ تولد: {persian.toPersian(Momentj(this.state.printObject.BirthDay).format('jYYYY/jM/jD'))}</TableCell>
                  <TableCell variant='body'>محل تولد: {this.state.printObject.BirthPlace}</TableCell>
                  <TableCell variant='body'>محل صدور: {this.state.printObject.IssuePlace}</TableCell>
                  </TableRow>
                  <TableRow>
                  <TableCell variant='body'>دین: {this.state.printObject.Religion}</TableCell>
                  <TableCell variant='body'>مذهب: {this.state.printObject.Mazhab}</TableCell>
                  <TableCell variant='body' colSpan="2">تابعیت: {this.state.printObject.Citizenship}</TableCell>
                  </TableRow>
                  <TableRow>
                  <TableCell variant='body'>تلفن منزل: {!this.state.printObject.P1HomePhone?'وارد نشده':persian.toPersian(this.state.printObject.P1HomePhone)}</TableCell>
                  <TableCell colSpan="3" variant='body'>آدرس منزل: {persian.toPersian(this.state.printObject.P1HomeAddress)}</TableCell>
                  </TableRow>
                </Table>
                </Grid>
                <Grid item>
                <Typography fullWidth align='left' variant="body1">مشخصات سرپرست اول</Typography>
                </Grid>
                <Grid item>
                <Table className={classes.TableStyle}>
                  <TableRow>
                    <TableCell variant='body'>نام: {this.state.printObject.P1FirstName}</TableCell>
                    <TableCell variant='body'>نام خانوادگی: {this.state.printObject.P1LastName}</TableCell>
                    <TableCell variant='body'>کد ملی: {persian.toPersian(this.state.printObject.P1ID)}</TableCell>
                    <TableCell variant='body'>نام پدر: {this.state.printObject.P1FatherName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant='body'>تاریخ تولد: {persian.toPersian(Momentj(this.state.printObject.P1BirthDay).format('jYYYY/jM/jD'))}</TableCell>
                    <TableCell variant='body'>تحصیلات: {this.state.printObject.P1EducationalDegree}</TableCell>
                    <TableCell variant='body'>رشته تحصیلی: {this.state.printObject.P1Major}</TableCell>
                    <TableCell variant='body'>شغل: {this.state.printObject.P1Job}</TableCell>
                  </TableRow>
                  <TableRow>
                  <TableCell variant='body'>همراه: {persian.toPersian(this.state.printObject.P1Mobile)}</TableCell>
                    <TableCell variant='body'>{"رایانامه: " + this.state.printObject.P1Email}</TableCell>
                    <TableCell colSpan="2" variant='body'>آدرس محل کار: {this.state.printObject.P1WorkAddress}</TableCell>
                  </TableRow>
                </Table>
                </Grid>
                
                {this.state.p2entered &&
                <Grid item>
                <Typography fullWidth align='left' variant="body1">مشخصات سرپرست دوم</Typography>
                </Grid>
                }
                {this.state.p2entered &&
                <Grid item>
                  <Table className={classes.TableStyle}>
                  <TableRow>
                    <TableCell variant='body'>نام: {this.state.printObject.P2FirstName}</TableCell>
                    <TableCell variant='body'>نام خانوادگی: {this.state.printObject.P2LastName}</TableCell>
                    <TableCell variant='body'>کد ملی: {persian.toPersian(this.state.printObject.P2ID)}</TableCell>
                    <TableCell variant='body'>نام پدر: {this.state.printObject.P2FatherName}</TableCell>
                  </TableRow>
                  <TableRow>
                    
                    <TableCell variant='body'>تاریخ تولد: {persian.toPersian(Momentj(this.state.printObject.P2BirthDay).format('jYYYY/jM/jD'))}</TableCell>
                    <TableCell variant='body'>تحصیلات: {this.state.printObject.P2EducationalDegree}</TableCell>
                    <TableCell variant='body'>رشته تحصیلی: {this.state.printObject.P2Major}</TableCell>
                    <TableCell variant='body'>شغل: {this.state.printObject.P2Job}</TableCell>
                  </TableRow>
                  <TableRow>
                  <TableCell variant='body'>همراه: {persian.toPersian(this.state.printObject.P2Mobile)}</TableCell>
                    <TableCell variant='body'>{"رایانامه: " + this.state.printObject.P2Email}</TableCell>
                    <TableCell colSpan="2" variant='body'>آدرس محل کار: {this.state.printObject.P2WorkAddress}</TableCell>
                  </TableRow>
                </Table>
                </Grid>
                }
                
                </Grid>
                </div>
                <div className={classes.paper}>
                <Typography fullWidth align='center' paragraph={true} variant="body1">بسمه تعالی</Typography>
                <Grid container justify="center" spacing={6}>
                    <Grid item>
                    <img
                          className={classes.logo}
                          src={this.state.school_logo}
                        />
                  </Grid>
                  <Grid item>
                  <Typography paragraph={true} variant="title">{this.state.school_name}</Typography>
                  </Grid>
                </Grid>
                <Typography fullWidth align='center' paragraph={true} variant="title">آیین نامه تربیتی دبستان</Typography>
                <Typography fullWidth align='left' paragraph={true} variant="body1">در نظام آفرینش انسان تنها موجودی است که مسئول و مکلف آفریده شده است . لذا ضرورتا توانایی مسئولیت در فطرت او نهفته است .</Typography>
                <Typography fullWidth align='left' paragraph={true} variant="body1">مسئولیت پذیری رابطه انسان را با خود ، اجتماع و خداوند شکل می دهد و سبب رشد و پرورش هماهنگ او می گردد و این همان چیزی است که ما برای پرورش فرزندانمان به آن نیازمندیم ؛ لذا می خواهیم فرزندانی داشته باشیم که در عین گذر از مراحل رشد، از کودکی تا بزرگسالی مسئولیت های هر یک از این مراحل را درک و از عوارض ناشی از عدم حس مسئولیت ، بی تفاوتی و کسالت روحی نیز در امان باشد.</Typography>
                <Typography fullWidth align='left' paragraph={true} variant="body1">رعایت انضباط یکی از عوامل مقبولیت فرد در نظر دیگران است ، مقبولیت نیز ضمن ایجاد اعتماد به نفس ، امینیت خاطر ، شادی و آرامش روحی به عنوان یک امر اجتماعی منجر به حفظ حدود و مقررات در خانه ، مدرسه و جامعه می گردد.</Typography>
                <Typography fullWidth align='left' paragraph={true} variant="body1">انضباط چه در بعد فردی و چه در زندگی جمعی و روابط اجتماعی نیروهای ذهنی و جسمی دانش آموز را سامان بخشیده و از اتلاف وقت جلوگیری و او را یاری می نماید تا با موفقیت بیشتر به اهداف خود جامع عمل بپوشاند و در مجموع آمادگی پذیرش و درک مقررات و قوانین را در او نهادینه می کند.</Typography>
                <Typography fullWidth align='left' paragraph={true} variant="body1">انتظار داریم که با عنایت هر چه دقیق تر به نکات زیر ، محیطی مناسب برای پرورش عزیزانمان فراهم کنیم:</Typography>
                <Typography fullWidth align='left' paragraph={true} variant="body1">{persian.toPersian('1-ساعت کار مدرسه از ساعت 7:30الی 15:30تعیین شده است . از آنجا که یکی از اهداف مهم آموزش و پرورش ، پرورش دادن روحیه نظم و انضباط می باشد ، دانش آموز می بایستی در راس ساعت مقرر در کلاس حضور داشته باشد.')}</Typography>
                <Typography fullWidth align='left' paragraph={true} variant="body1">{persian.toPersian('2-چنانچه دانش آموزی نتواند در ساعت مقرر در مدرسه حضور یابد علت غیبت یا تاخیر باید در اولین ساعات همان روز توسط ولی دانش آموز به صورت تلفنی یا حضور به اطلاع دفتر مدرسه برسد.')}</Typography>
                <Typography fullWidth align='left' paragraph={true} variant="body1">{persian.toPersian('3-خواهشمندیم قبل از تنظیم برنامه مسافرت برای فرزندانتان با اولیا مدرسه تبادل نظر بفرمایید.')}</Typography>
                <Typography fullWidth align='left' paragraph={true} variant="body1">{persian.toPersian('4-نظارت مستقیم اولیا در امور تحصیلی موجب پیشرفت آنهاست ، چنانچه به هنگام نظارت مطالبی به نظرتان برسد پس از مشورت با مربیان به مورد اجرا بگذارید . در ضمن برای هماهنگی و اتفاق نظر با مسئولین مدرسه ، می توانید در مدرسه حضور یابید و در جریان وضع تحصیلی و اخلاقی فرزندتان قرار بگیرید.')}</Typography>
                <Typography fullWidth align='left' paragraph={true} variant="body1">{persian.toPersian('5-پاسخ مثبت شما به دعوتنامه هایی که جهت شرکت اولیا در جلسات آموزشی و تربیتی ارسال می گردد و حضور به موقع، منظم و فعال شما در این جلسات در پیشرفت و بهبود وضع تربیتی و آموزشی دانش آموزان بسیار موثر است .')}</Typography>
                <Typography fullWidth align='left' paragraph={true} variant="body1">{persian.toPersian('6-رعایت سادگی و حفظ شعائر اسلامی نشان دهنده شخصیت گرانقدر شما و فرزندتان است .')}</Typography>
                <Typography fullWidth align='left' paragraph={true} variant="body1">{persian.toPersian('7-کانون گرم و ارتباط خانواده ، آرامش و نظم محیط زندگی کودک (خانه) ، ایجاد فرصت کافی برای مرور دروس در زمان معین در هر روز ، استراحت به موقع و تغذیه سالم به یادگیری بهتر و شادابی فرزندمان در مدرسه کمک می کند .')}</Typography>
                <Typography fullWidth align='left' paragraph={true} variant="body1">{persian.toPersian('8-مدرسه برای هدایت هوشمند تحصیلی از سامانه سهند استفاده خواهد کرد. اطلاعات شخصی و تحصیلی ثبت شده در این سامانه نزد مدرسه محفوظ خواهد ماند.')}</Typography>
                <Typography fullWidth align='right' paragraph={true} variant="body1">امضای ولی و تاریخ:            </Typography>
                </div>
                <div className={classes.paper}>
                <Typography fullWidth align='center' paragraph={true} variant="body1">بسمه تعالی</Typography>
                <Grid container justify="center" spacing={6}>
                    <Grid item>
                    <img
                          className={classes.logo}
                          src={this.state.school_logo}
                        />
                  </Grid>
                  <Grid item>
                  <Typography paragraph={true} variant="title">{this.state.school_name}</Typography>
                  </Grid>
                </Grid>
                <Typography paragraph={true} fullWidth align='center' variant="title">فرم اطلاعات بهداشتی – ورزشی – رفتاری</Typography>
                <Grid container justify="center" spacing={32}>
                    <Grid item>
                    <Typography paragraph={true} fullWidth align='center' variant="body1">نام و نام خانوادگی: {this.state.printObject.FirstName+"  "+this.state.printObject.LastName}</Typography>
                  </Grid>
                  <Grid item>
                  <Typography paragraph={true} variant="body1">تاریخ تولد: {persian.toPersian(Momentj(this.state.printObject.BirthDay).format('jYYYY/jM/jD'))}</Typography>
                  </Grid>
                </Grid>
                <Typography fullWidth align='left'> آیا فرزندمان تا کنون دچار آسیب‌های زیر شده است ؟</Typography>
                <Grid className={classes.checkboxList} container spacing={10} direction='row'>
                  {
                    p1.map(title=>{
                      return(
                        <FormControlLabel
                          control={
                            <Checkbox 
                              className={classes.checkbox}
                            />
                          }
                          label={<Typography align='left' variant="body2">{title}</Typography>}
                          labelPlacement='start'
                        />
                      )
                    })
                  }
                </Grid>
                <Typography paragraph={true} fullWidth align='left' variant="body1">آیا هنوز عوارض این صدمه باقی است ؟ ..........................</Typography>
                <Typography paragraph={true} fullWidth align='left' variant="body1">آیا توصیه‌هایی مبنی بر محدودیت ورزشی داشته است : ..........................</Typography>
                <Typography fullWidth align='left' variant="body1">آیا فرزندمان در حال حاضر دچار عارضه می‌باشد ؟ نوع عارضه یا نوع بیماری را با علامت ( * ) مشخص نمایید .</Typography>
                <Grid className={classes.checkboxList} container spacing={10} direction='row'>
                  <FormControlLabel
                    control={
                      <ArrowRightAlt/>
                    }
                    label='هرگونه آلرژی یا حساسیت'
                    labelPlacement='start'
                  />
                  {
                    p2_0.map(title=>{
                      return(
                        <FormControlLabel
                          control={
                            <Checkbox 
                              className={classes.checkbox}
                            />
                          }
                          label={<Typography align='left' variant="body2">{title}</Typography>}
                          labelPlacement='start'
                        />
                      )
                    })
                  }
                </Grid>
                <Grid className={classes.checkboxList} container spacing={10} direction='row'>
                  <FormControlLabel
                    control={
                      <ArrowRightAlt/>
                    }
                    label='اسکلتی و ستون فقرات'
                    labelPlacement='start'
                  />
                  {
                    p2_1.map(title=>{
                      return(
                        <FormControlLabel
                          control={
                            <Checkbox 
                              className={classes.checkbox}
                            />
                          }
                          label={<Typography align='left' variant="body2">{title}</Typography>}
                          labelPlacement='start'
                        />
                      )
                    })
                  }
                </Grid>
                <Grid className={classes.checkboxList} container spacing={10} direction='row'>
                  {
                    p2_2.map(title=>{
                      return(
                        <FormControlLabel
                          control={
                            <Checkbox 
                              className={classes.checkbox}
                            />
                          }
                          label={<Typography align='left' variant="body2">{title}</Typography>}
                          labelPlacement='start'
                        />
                      )
                    })
                  }
                </Grid>
                <Grid className={classes.checkboxList} container spacing={10} direction='row'>
                  <FormControlLabel
                    control={
                      <ArrowRightAlt/>
                    }
                    label='شنوایی'
                    labelPlacement='start'
                  />
                  {
                    p2_3.map(title=>{
                      return(
                        <FormControlLabel
                          control={
                            <Checkbox 
                              className={classes.checkbox}
                            />
                          }
                          label={<Typography align='left' variant="body2">{title}</Typography>}
                          labelPlacement='start'
                        />
                      )
                    })
                  }
                </Grid>
                <Typography paragraph={true} fullWidth align='left' variant="body1">توضیحات در مورد عارضه ای که به آن اشاره نشده: ..........................</Typography>
                <Typography paragraph={true} fullWidth align='left' variant="body1">در صورتی که پسرمان داروی خاصی را مصرف می‌کند، نام دارو و میزان مصرف آن را شرح دهید: ..........................</Typography>
                <Typography paragraph={true} fullWidth align='left' variant="body1">آیا پسرمان سابقه جراحی دارد؟ ....... در صورت داشتن لطفا شرح دهید در کدام عضو بپده است: ..........................</Typography>
                <Typography fullWidth align='left' variant="body1">وجود هر یک از موارد زیر را مشخص کنید :</Typography>
                <Grid className={classes.checkboxList} container spacing={10} direction='row'>
                  {
                    p3.map(title=>{
                      return(
                        <FormControlLabel
                          control={
                            <Checkbox 
                              className={classes.checkbox}
                            />
                          }
                          label={<Typography align='left' variant="body2">{title}</Typography>}
                          labelPlacement='start'
                        />
                      )
                    })
                  }
                </Grid>
                <Typography paragraph={true} fullWidth align='left' variant="body1">در صورتیکه فرزندتان نیاز به مراقبت ویژه ای در مدرسه دارد ، ذکر بفرمایید .................................................................</Typography>
                <Typography fullWidth align='left' paragraph={true} variant="body1">اینجانب ...................... ولی {this.state.printObject.FirstName+"  "+this.state.printObject.LastName} اعلام می دارم که تمامی اطلاعات مربوطه را با دقت و صحت کامل تکمیل نموده و درصورت عدم صحت ، مسئولیت بروز هر گونه آسیبی که ناشی از بیماری های مزبور باشد , را به عهده می گیرم .</Typography>
                <Typography fullWidth align='right' variant="body1">امضای ولی و تاریخ:            </Typography>
                </div>
                <div className={classes.paper} style={{height:700}} >
                <Typography fullWidth align='center' paragraph={true} variant="body1">بسمه تعالی</Typography>
                <Grid container justify="center" spacing={6}>
                    <Grid item>
                    <img
                          className={classes.logo}
                          src={this.state.school_logo}
                        />
                  </Grid>
                  <Grid item>
                  <Typography paragraph={true} variant="title">{this.state.school_name}</Typography>
                  </Grid>
                </Grid>
                <Typography fullWidth align='center' paragraph={true} variant="title">فرم وضعیت ورود و خروج دانش آموز</Typography>
                <Typography fullWidth align='left' paragraph={true} variant="title">نام و نام خانوادگی: {this.state.printObject.FirstName+"  "+this.state.printObject.LastName}</Typography>
                <Table className={classes.TableStyle}>
                  <TableHead>
                  <TableRow>
                    <TableCell variant='title'>ورود </TableCell>
                    <TableCell variant='title'>خروج</TableCell>
                  </TableRow>
                  </TableHead>
                  <TableRow>
                    <TableCell variant='title'><FormControlLabel
                          control={
                            <Checkbox/>
                          }
                          label='توسط ولی یا شخص دیگر‬'
                        /></TableCell>
                    <TableCell variant='title'><FormControlLabel
                          control={
                            <Checkbox/>
                          }
                          label='توسط ولی یا شخص دیگر‬'
                        /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant='body'><FormControlLabel
                          control={
                            <Checkbox/>
                          }
                          label='‫سرویس‬ ‫با‬'
                        /> </TableCell>
                    <TableCell variant='body'><FormControlLabel
                          control={
                            <Checkbox/>
                          }
                          label='‫سرویس‬ ‫با‬'
                        /></TableCell>
                  </TableRow>
                </Table>
                <Typography fullWidth align='left' paragraph={true} variant="body1">در صورتیکه محدودیت خاصی جهت تحویل فرزندمان وجود دارد لطفاً ذکر فرمایید .‬</Typography>
                <Typography fullWidth align='center' paragraph={true} variant="body1">پرکننده‌ی فرم:                                      امضا</Typography>
                <div style={
                  {
                    width:'100%',
                  border: '4px solid black'
                  }
                }/>
                <Typography fullWidth align='center' paragraph={true} variant="title">دانش آموزانی که از سرویس ایاب و ذهاب استفاده می کنند قسمت زیر را پر نمایند.</Typography>
                <Grid container justify="center" spacing={6}>
                    <Grid item>
                    <img
                          className={classes.logo}
                          src={this.state.school_logo}
                        />
                  </Grid>
                  <Grid item>
                  <Typography paragraph={true} variant="title">{this.state.school_name}</Typography>
                  </Grid>
                </Grid>
                <Typography paragraph={true} variant="title">آدرس منزل دانش آموزان سرویسی</Typography>
                <Typography fullWidth align='left' paragraph={true} variant="body1">نام و نام خانوادگی: {this.state.printObject.FirstName+"  "+this.state.printObject.LastName}</Typography>
                <Typography fullWidth align='left' paragraph={true} variant="body1">لطفاً آدرس دقیق به همراه کروکی جهت ارائه به مسئولین سرویس ها نوشته شود.</Typography>
                </div>
                </div>
              </Grid>
            </Grid>
          }
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
