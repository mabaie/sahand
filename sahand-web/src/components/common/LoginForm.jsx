import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  Slide,
  FormControl
} from "@material-ui/core";
import axios from "axios";
import configs from "../../configs";

const loginFormStyle = theme => {
  return {
    root: {
      flexGrow: 1
    },
    textFields: {
      margin: theme.spacing.unit
    }
  };
};

function Transition(props) {
  return <Slide direction="up" {...props} />;
}
class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      username: "",
      password: "",
      from: this.props.match.url,
      login: true,
      accessToken: "",
      newPass: "",
      oldPass: "",
      newPassConfirm: ""
    };

    this.onClose = props.onClose;
  }
  handleExited() {
    this.onClose();
    this.setState({
      open: true,
      from: this.props.match.url
    });
  }
  handleClose() {
    this.setState({
      open: false,
      username: "",
      password: ""
    });
  }
  handleLogin() {
    // this.setState({
    //   open: false,
    //   username: "",
    //   password: "",
    // });
    const server = axios.create({
      baseURL: configs.apiUrl,
      timeout: 5000,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + configs.API_SECRET_KEY
      }
    });
    if (this.state.login) {
      server
        .post("/login", {
          userName: this.state.username,
          Password: this.state.password
        })
        .then(
          function(response) {
            if (response.data.FirstLogin) {
              this.setState({
                login: false,
                accessToken: response.headers.authorization
              });
            } else {
              localStorage.setItem(
                "access-token",
                response.headers.authorization
              );
              if (this.state.from === "/") {
                if (response.data.Type.manager === true) {
                  this.props.history.push("/sahand/manager/dashboard");
                } else if (response.data.Type.admin === true) {
                  this.props.history.push("/sahand/admin/dashboard");
                } else if (response.data.Type.parent === true) {
                  
                  const req = axios.create({
                    baseURL: configs.apiUrl,
                    headers: {
                      Authorization: response.headers.authorization
                    }
                  });
                  req
                    .get("/app/parent/chiled-list")
                    .then(res => {
                      this.props.history.push("/sahand/parent/dashboard");
                
                localStorage.setItem(
                  "student-id",
                res.data[0]._id
                  );
                    })
                    .catch(err => {
                      
                    }); 
              } else if (response.data.Type.teacher === true) {
                
                  
                const req = axios.create({
                  baseURL: configs.apiUrl,
                  headers: {
                    Authorization: response.headers.authorization
                  }
                });
                req
                  .get("/app/teacher/course-list")
                  .then(res => {
                    this.props.history.push("/sahand/teacher/dashboard")
              
              localStorage.setItem(
                "school-id",
              res.data[0].ID
                )
                
              localStorage.setItem(
                "course-id",
              res.data[0].courseList[0].ID
                )
                  })
                  .catch(err => {
                    
                  }); 
                }  
              } else {
                this.props.history.push(this.state.from);
              }
            }
          }.bind(this)
        )
        .catch((err) => {
          if(err.response.data.errorNumber==="019"){
            this.props.onError(" کلمه عبور اشتباه است")
          }else if(err.response.data.errorNumber==="017"){
            this.props.onError("نام کاربری اشتباه است")
          }else{
            this.props.onError("خطای ارتباط با سرور");
          }
          // console.log(err.response.data)
        });
    } else {
      const server = axios.create({
        baseURL: configs.apiUrl,
        timeout: 5000,
        headers: {
          "Content-Type": "application/json",
          Authorization: this.state.accessToken
        }
      });
      server
        .post("/change-password", {
          OldPass: this.state.oldPass,
          NewPass: this.state.newPass,
          NewPassConfirm: this.state.newPassConfirm
        })
        .then(() => {
          this.setState({ login: false, open: false }, this.props.onSuccess('تغییر کلمه‌ی عبور با موفقیت انجام شد'));
        })
        .catch((err) => {
          this.props.onError("خطای ارتباط با سرور");
        });
    }
  }
  handleTextChange(name) {
    return event => {
      return this.setState({
        [name]: event.target.value
      });
    };
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Dialog
          TransitionComponent={Transition}
          onClose={this.handleClose.bind(this)}
          onExited={this.handleExited.bind(this)}
          open={this.state.open}
        >
          <DialogTitle>
            {this.state.login ? "ورود به سیستم" : "تغییر رمز ورود"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {this.state.login
                ? "لطفا نام کاربری و کلمه‌ی عبور خود را وارد نمایید."
                : "لطفا کلمه‌ی عبور فعلی و کلمه‌ی عبور جدید خود را وارد نمایید"}
            </DialogContentText>
            {this.state.login ? (
              <form>
                <TextField
                  className={classes.textFields}
                  autoFocus
                  margin="dense"
                  placeholder="نام کاربری"
                  onChange={this.handleTextChange("username").bind(this)}
                  error={this.state.username.length!==10}
                  helperText={this.state.username.length!==10 ? "تعداد کاراکترهای نام کاربری باید ۱۰ عدد باشد" : ""}
                />
                <br />
                <TextField
                  className={classes.textFields}
                  margin="dense"
                  type="password"
                  placeholder="کلمه‌ی عبور"
                  onChange={this.handleTextChange("password").bind(this)}
                  error={this.state.password.length<6}
                  helperText={this.state.password.length<6 ? "تعداد کاراکترهای کلمه عبور حداقل باید ۶ عدد باشد" : ""}
                />
              </form>
            ) : (
              <FormControl fullWidth>
                <TextField
                  className={classes.textFields}
                  autoFocus
                  margin="dense"
                  label="کلمه‌ی عبور فعلی"
                  type="password"
                  value={this.state.oldPass}
                  onChange={this.handleTextChange("oldPass").bind(this)}
                />
                <TextField
                  className={classes.textFields}
                  margin="dense"
                  type="password"
                  label="کلمه‌ی عبور جدید"
                  value={this.state.newPass}
                  onChange={this.handleTextChange("newPass").bind(this)}
                />
                <TextField
                  className={classes.textFields}
                  margin="dense"
                  type="password"
                  label="تکرار کلمه‌ی عبور جدید"
                  value={this.state.newPassConfirm}
                  onChange={this.handleTextChange("newPassConfirm").bind(this)}
                />
              </FormControl>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              disabled={(((this.state.username.length!==10)||(this.state.password.length<6))&&(this.state.login))}
              onClick={this.handleLogin.bind(this)}
            >
              {this.state.login ? "ورود" : "ثبت"}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={this.handleClose.bind(this)}
            >
              بستن
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
LoginForm.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  history: PropTypes.object,
  location: PropTypes.object,
  match: PropTypes.object,
  onError: PropTypes.func,
  onSuccess: PropTypes.func
};
export default withRouter(withStyles(loginFormStyle)(LoginForm));
