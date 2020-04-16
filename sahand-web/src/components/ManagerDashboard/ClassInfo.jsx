import React, { Component } from "react";
import {
  Grid,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  Dialog,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  CircularProgress
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import jMoment from "moment-jalaali";
import _ from "lodash";
import Joi from "joi-browser";
import green from "@material-ui/core/colors/green";
import axios from "axios";
import configs from "../../configs";
import PopMessages from "../common/PopMessages";
import persian from "persian";

const Promise = global.Promise;
const persianStringRegExp = /^[\u0621-\u0628\u062A-\u063A\u0641-\u0642\u0644-\u0648\u064E-\u0651\u0655\u067E\u0686\u0698\u06A9\u06AF\u06BE\u06CC\s]+$/;

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
      cname: "",
      capacity: 0,
      grade: "اول",

      cnameerr: false,
      capacityerr: false,
      gradeerr: false,

      errorMessages: [],
      loading: false,
      disable: true,
      waiting: false,

      cnameupdate: null,
      capacityupdate: null,
      gradeupdate: null,

      addStudent:false,
      selectedStudents: [],
    };
    this.sstudents=[];
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleBtnClick = this.handleBtnClick.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  componentDidMount() {
    const { record } = this.props;
    this.setState(prevState => {
      return {
        _id: record._id,
        cname: record.cname,
        capacity: record.capacity,
        grade: record.grade,
        disable: true,

        cnameupdate: null,
        capacityupdate: null,
        gradeupdate: null
      };
    });

    const req = axios.create({
      baseURL: configs.apiUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("access-token")
      }
    });
    req
      .get(`/sstudents-grade/${record._id}`)
      .then(res => {
        this.sstudents = res.data;
        this.forceUpdate();
      })
      .catch(err => {
        alert("خطای سرور");
        this.setState({loading: false});
      });
  }
  componentWillUnmount() {
    this.setState({
      cnameupdate: null,
      capacityupdate: null,
      gradeupdate: null
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
      case "cname":
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
      case "capacity":
        return value => {
          return (
            Joi.number()
              .min(1)
              .max(1000)
              .required()
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
            cnameerr: false,
            capacityerr: false,
            gradeerr: false,
            cnameupdate: null,
            capacityupdate: null,
            gradeupdate: null,
            addStudent:false
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
                cnameupdate: null,
                capacityupdate: null,
                gradeupdate: null,
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
      case "addStudent":
        return () => {
          this.setState({
            addStudent:true
          });
        };
      case "registerAdd":
        return () => {
          let sstudents = this.state.selectedStudents.map(
            student => this.sstudents[student]._id
          );
          let req = axios.create({
            baseURL: configs.apiUrl,
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("access-token")
            }
          });
          this.setState({loading: true},function(){
            const { record } = this.props;
            req
            .post(
              `/class/students/${record._id}`,
              JSON.stringify(sstudents)
            )
            .then(() => {
              this.setState({loading: false, addStudent:false});
            })
            .catch(err => {
              alert("خطای سرور");
              this.setState({loading: false});
            })}.bind(this));
        }
    }
  }
  update(prevState) {
    let data = {
      _id: prevState._id,
      Name: prevState.cname,
      Capacity: prevState.capacity,
      Grade: prevState.grade
    };
    let updateFlags = {
      Name: prevState.cnameupdate,
      Capacity: prevState.capacityupdate,
      Grade: prevState.gradeupdate
    };
    const error = {
      "نام ": prevState.cnameerr,
      "ظرفیت ": prevState.capacityerr,
      "پایه‌ی تحصیلی ": prevState.gradeerr
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
              accept("کلاس با موفقیت ثبت شد");
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

        let upgradedFields = {};
        for (let field in data) {
          if (updateFlags[field]) {
            upgradedFields[field] = data[field];
          }
        }
        
        if (!_.isEqual(upgradedFields, {})) {
          this.setState({ loading: true });
          req
            .patch(`/class/${_id}`, JSON.stringify(upgradedFields))
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
  handleCheck(id) {
    return e => {
      const checked = e.target.checked;
      this.setState(prevState => {
        let nextState = Object.assign(prevState.selectedStudents);
        if (checked) {
          if (nextState.findIndex(el => el === id) === -1) {
            return { selectedStudents: nextState.concat([id]) };
          }
        } else {
          const idx = nextState.findIndex(el => el === id);
          nextState.splice(idx, 1);
          return { selectedStudents: nextState };
        }
      });
    };
  }
  render() {
    const { classes, waiting } = this.props;
    const {
      cname,
      capacity,
      disable,
      cnameerr,
      capacityerr,
      gradeerr,
      grade,
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
                disabled={disable}
                label="نام"
                value={cname}
                onChange={this.handleTextChange("cname")}
                fullWidth
                error={cnameerr}
                required
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                disabled={disable}
                label="ظرفیت"
                value={persian.toPersian(capacity)}
                onChange={this.handleTextChange("capacity")}
                fullWidth
                error={capacityerr}
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
            <Grid container direction="row" alignItems="stretch" spacing={16}>
              <Grid item style={{ flexGrow: 1 , marginTop: 16 }}>
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
              <Grid item style={{ flexGrow: 1, marginTop: 16 }}>
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
              <Grid item style={{ flexGrow: 1 , marginTop: 16 }}>
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
              <Grid item style={{ flexGrow: 1 , marginTop: 16 }}>
                <Button
                  disabled={waiting || loading}
                  className={classes.primary}
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={this.handleBtnClick("addStudent")}
                >
                  {loading && (
                    <CircularProgress
                      className={classes.buttonProgress}
                      size={24}
                    />
                  )}
                  افزودن دانش‌آموز به همه دورس
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Dialog open={this.state.addStudent} maxWidth={false}>
          <Paper style={{ padding: 20 }}>
            <Grid
              container
              direction="column"
              className={classes.root}
              alignItems="stretch"
            >
              <Grid
                container
                direction="row"
                spacing={16}
                alignItems="flex-end"
              >
                <Grid item xs={12}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell />
                        <TableCell>نام</TableCell>
                        <TableCell>نام خانوادگی</TableCell>
                        <TableCell>شماره ملی</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.sstudents.map((item, id) => {
                        return (
                          <TableRow key={id}>
                            <TableCell>
                              <Checkbox onChange={this.handleCheck(id)} />
                            </TableCell>
                            <TableCell>{item.fname}</TableCell>
                            <TableCell>{item.lname}</TableCell>
                            <TableCell>{item.userName}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Grid>
              </Grid>

              <Grid
                container
                direction="row"
                alignItems="space-btween"
                spacing={16}
              >
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
                    onClick={this.handleBtnClick("registerAdd")}
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
