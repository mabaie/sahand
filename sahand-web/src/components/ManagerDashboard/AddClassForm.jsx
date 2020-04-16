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
import jMoment from "moment-jalaali";
import persian from "persian";
import Joi from "joi-browser";
import PopMessages from "../common/PopMessages";
import green from "@material-ui/core/colors/green";
import axios from "axios";
import configs from "../../configs";

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
class AddClassForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      grade: "اول",
      capacity: 0,

      nameerr: true,
      gradeerr: false,
      capacityerr: true,

      errorMessages: [],
      loading: false,
      success: false
    };
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleBtnClick = this.handleBtnClick.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleErrorExit = this.handleErrorExit.bind(this);
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
      case "name":
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
      case "grade":
        return value => {
          return (
            Joi.string()
              .trim()
              .valid("پیش‌دبستانی","اول", "دوم", "سوم", "چهارم", "پنجم", "ششم")
              .validate(value).error !== null
          );
        };
      case "capacity":
        return value => {
          return (
            Joi.number()
              .min(1)
              .max(1000)
              .validate(persian.toEnglish(value)).error !== null
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
                  this.setState({ loading: false });
                }
                this.handleError(error);
              }
            });
        };
    }
  }
  register(prevState) {
    let data = {
      Name: prevState.name,
      Capacity: persian.toEnglish(prevState.capacity),
      Grade: prevState.grade
    };
    const error = {
      "نام ": prevState.nameerr,
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
          this.setState({ loading: true, success: false }, () => {
            this.post(data)
              .then(() => {
                accept("کلاس با موفقیت ثبت شد");
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
  post(data) {
    const req = axios.create({
      baseURL: configs.apiUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("access-token")
      }
    });
    return req.post("/class", JSON.stringify(data));
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
      name,
      grade,
      capacity,
      nameerr,
      gradeerr,
      capacityerr,
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
            <Grid item xs={6}>
              <TextField
                className={classes.primary}
                label="نام"
                value={name}
                onChange={this.handleTextChange("name")}
                fullWidth
                error={nameerr}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                className={classes.primary}
                label="ظرفیت"
                value={persian.toPersian(capacity)}
                onChange={this.handleTextChange("capacity")}
                fullWidth
                error={capacityerr}
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
            <Grid item xs={6}>
              <Select
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

          <Grid container direction="row" alignItems="stretch" spacing={16}>
            <Grid item style={{ flexGrow: 1, marginTop: 16 }}>
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

AddClassForm.propTypes = {
  classes: PropTypes.object.isRequired,
  onRegister: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onError: PropTypes.func
};

export default withStyles(styles)(AddClassForm);
