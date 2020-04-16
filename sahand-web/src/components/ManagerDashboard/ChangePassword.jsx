import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import PopMessages from "../common/PopMessages";
import CircularProgress from "@material-ui/core/CircularProgress";
import green from "@material-ui/core/colors/green";
import axios from "axios";
import configs from "../../configs";

const styles = theme => {
  return {
    root: {
      padding: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 12,
      margin: theme.spacing.unit * 10
    },
    primary: {
      maring: theme.spacing.unit,
      marginTop: theme.spacing.unit * 2,
      marginLeft: theme.spacing.unit * 5,
      marginRight: theme.spacing.unit * 5
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
class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPass: "",
      newPass: "",
      newPassConf: "",
      errors: {
        newPass: true,
        currentPass: true,
        newPassConf: true,
        misMatch: false
      },
      messageOpen: false,
      waiting: false,
      message: "",
      messageType: "error"
    };
    this.handleRegister = this.handleRegister.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleMessageClose = this.handleMessageClose.bind(this);
    this.clientSideErrorChecking = this.clientSideErrorChecking.bind(this);
  }
  handleRegister() {
    if (this.clientSideErrorChecking()) {
      this.setState({ waiting: true }, () => {
        const { currentPass, newPass, newPassConf } = this.state;
        const req = axios.create({
          baseURL: configs.apiUrl,
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("access-token")
          }
        });
        req
          .post("/change-password", {
            OldPass: currentPass,
            NewPass: newPass,
            NewPassConfirm: newPassConf
          })
          .then(() => {
            this.setState({
              message: "کلمه‌ی عبور با موفقیت تغییر یافت",
              messageOpen: true,
              messageType: "success"
            });
          })
          .catch(err => {
            if (err.response.data) {
              switch (err.response.data.errorNumber) {
                case "040":
                  this.setState({
                    message: "کلمه‌ی عبور قبلی اشتباه است",
                    messageOpen: true,
                    messageType: "error"
                  });
                  break;
                  default :
                      this.setState({
                        message: "خطای دسترسی به سرور",
                        messageOpen: true,
                        messageType: "error"
                      });
                      break;
              }
            }
          });
      });
    }
  }
  clientSideErrorChecking() {
    const { errors } = this.state;
    for (let error in errors) {
      if (errors[error]) {
        switch (error) {
          case "currentPass":
            this.setState({
              message: "کلمه‌ی عبور قبلی نامتعبر است",
              messageOpen: true,
              messageType: "error"
            });
            return false;
          case "newPass":
            this.setState({
              message: "کلمه‌ی عبور جدید نامتعبر است",
              messageOpen: true,
              messageType: "error"
            });
            return false;
          case "newPassConf":
            this.setState({
              message: "تکرار کلمه‌ی عبور نامعتبر است",
              messageOpen: true,
              messageType: "error"
            });
            return false;
          case "misMatch":
            this.setState({
              message: "کلمه‌ی عبور جدید با تکرار آن هم‌خوانی ندارد",
              messageOpen: true,
              messageType: "error"
            });
            return false;
        }
      }
    }
    return true;
  }
  handleTextChange(name) {
    return e => {
      const newValue = e.target.value;
      this.setState(prevState => {
        let errors = {};
        Object.assign(errors, prevState["errors"]);
        errors[name] = this.validate(newValue);
        errors["misMatch"] = this.findMisMatch(name, newValue, prevState);
        return {
          [name]: newValue.slice(0, 29),
          ["errors"]: errors
        };
      });
    };
  }
  findMisMatch(name, value, prevState) {
    if (name === "currentPass") {
      return prevState.errors["misMatch"];
    }
    const otherValue =
      name === "newPass" ? prevState["newPassConf"] : prevState["newPass"];
    return otherValue !== value;
  }
  validate(value) {
    return value.length < 6 || value.length > 30;
  }
  handleMessageClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ messageOpen: false, waiting: false });
  };
  render() {
    const { classes } = this.props;
    const {
      newPass,
      currentPass,
      newPassConf,
      errors,
      waiting,
      messageOpen,
      message,
      messageType
    } = this.state;
    return (
      <div styles={{ padding: 16 }}>
        <Grid container direction="column" alignItems="center" spacing={16}>
          <PopMessages
            open={messageOpen}
            variant={messageType}
            message={message}
            onClose={this.handleMessageClose}
          />
          <Paper className={classes.root}>
            <form>
              <Grid item>
                <Typography variant="body1" className={classes.primary}>
                  لطفا کلمه‌ی عبور قبلی و کلمه‌ی عبور جدید را با دقت وارد نمایید
                </Typography>
              </Grid>
              <Grid item>
                <TextField
                  className={classes.primary}
                  label="کلمه‌ی عبور قبلی"
                  onChange={this.handleTextChange("currentPass")}
                  value={currentPass}
                  type="password"
                  error={errors["currentPass"]}
                  fullWidth
                />
              </Grid>
              <Grid item>
                <TextField
                  className={classes.primary}
                  label="کلمه‌ی عبور جدید "
                  onChange={this.handleTextChange("newPass")}
                  value={newPass}
                  type="password"
                  error={errors["newPass"]}
                  fullWidth
                />
              </Grid>
              <Grid item>
                <TextField
                  className={classes.primary}
                  label="تکرار کلمه‌ی عبور جدید"
                  onChange={this.handleTextChange("newPassConf")}
                  value={newPassConf}
                  type="password"
                  error={errors["newPassConf"]}
                  fullWidth
                />
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  className={classes.primary}
                  color="secondary"
                  onClick={this.handleRegister}
                  disabled={waiting}
                  fullWidth
                >
                  {waiting && (
                    <CircularProgress
                      className={classes.buttonProgress}
                      size={24}
                    />
                  )}
                  ثبت
                </Button>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </div>
    );
  }
}
ChangePassword.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(ChangePassword);
