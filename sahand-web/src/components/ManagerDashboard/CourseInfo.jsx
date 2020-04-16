import React, { Component } from "react";
import {
  Grid,
  Paper,
  Button,
  CircularProgress,
  Checkbox,
  Dialog,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import jMoment from "moment-jalaali";
import green from "@material-ui/core/colors/green";
import axios from "axios";
import configs from "../../configs";
import PopMessages from "../common/PopMessages";
import persian from "persian";
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
      _id: "",
      open: false,
      checked: [1],
      selectedStudents: [],
      errorMessages: [],
      selectDelete: [],
      loading: true
    };
    this.handleBtnClick = this.handleBtnClick.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleCheckDelete = this.handleCheckDelete.bind(this);
    this.students = [];
    this.sstudents = [];
  }

  handleToggle = value => () => {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked
    });
  };
  componentDidMount() {
    const { record } = this.props;
    const req = axios.create({
      baseURL: configs.apiUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("access-token")
      }
    });
    req.get(`/students/${record._id}`).then(res => {
      this.students = res.data;
      req
        .get(`/sstudents/${record._id}`)
        .then(res => {
          this.sstudents = res.data;
        })
        .then(() => {
          this.setState({ _id: record._id, loading: false });
        })
        .catch(err => {
          alert("خطای سرور");
          this.setState({loading: false});
        });
    });
  }

  handleBtnClick(name) {
    return () => {
      let sstudents = [];
      let req;
      switch (name) {
        case "add":
          this.setState({ open: true });
          break;
        case "drop":
          this.setState({ open: false });
          break;
        case "register":
          sstudents = this.state.selectedStudents.map(
            student => this.sstudents[student]._id
          );
          req = axios.create({
            baseURL: configs.apiUrl,
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("access-token")
            }
          });
          this.setState({loading: true},function(){req
            .post(
              `/course/students/${this.state._id}`,
              JSON.stringify(sstudents)
            )
            .then(() => {
              const { record } = this.props;
              const req = axios.create({
                baseURL: configs.apiUrl,
                headers: {
                  "Content-Type": "application/json",
                  Authorization: localStorage.getItem("access-token")
                }
              });
              req
                .get(`/students/${record._id}`)
                .then(res => {
                  this.students = res.data;
                  req
                    .get(`/sstudents/${record._id}`)
                    .then(res => {
                      
                      this.sstudents = res.data;
                      this.setState({ open: false, selectDelete:[], selectedStudents:[], loading: false });
                    })
                    .catch(err => {
                      alert("خطای سرور");
                      this.setState({loading: false})
                    });
                })
                .catch(err => {
                  alert("خطای سرور");
                  this.setState({loading: false});
                });
            })
            .catch(err => {
              alert("خطای سرور");
              this.setState({loading: false});
            })}.bind(this));
          break;
        case "delete":
  
          req = axios.create({
            baseURL: configs.apiUrl,
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("access-token")
            }
          });
          this.setState({loading: true},function(){req
            .delete(`/course/${this.state._id}/students`, {
              data: JSON.stringify(this.state.selectDelete)
            })
            .then(() => {
              const { record } = this.props;
              req
                .get(`/students/${record._id}`)
                .then(res => {
                  this.students = res.data;
                  req
                    .get(`/sstudents/${record._id}`)
                    .then(res => {
                      
                      this.sstudents = res.data;
                      this.setState({ selectDelete: [], selectedStudents: [], loading: false });
                    })
                    .catch(err => {
                      alert("خطای سرور");
                      this.setState({loading: false});
                    });
                })
                .catch(err => {
                  alert("خطای سرور");
                  this.setState({loading: false});
                });
            })}.bind(this))
          break;
      }
    };
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
  componentDidUpdate() {
    
  }
  handleCheckDelete(id) {
    return e => {
      const checked = e.target.checked;
      this.setState(prevState => {
        let nextState = Object.assign(prevState.selectDelete);
        if (checked) {
          nextState = nextState.concat(id);
        } else {
          const idx = nextState.indexOf(id);
          
          nextState.splice(idx, 1);
        }
        return { selectDelete: nextState };
      });
    };
  }
  render() {
    const { classes, waiting } = this.props;
    const { loading } = this.state;
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
        <Dialog open={this.state.open} maxWidth={false} fullWidth>
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
                  <Table fullWidth>
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
        </Dialog>
        <Grid
          container
          direction="column"
          className={classes.root}
          alignItems="stretch"
        >
          <Grid container direction="row" spacing={16} alignItems="flex-end">
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
                  {this.students.map(student => {
                    return (
                      <TableRow key={student._id}>
                        <TableCell>
                          <Checkbox
                            onChange={this.handleCheckDelete(student._id)}
                          />
                        </TableCell>
                        <TableCell>{student.fname}</TableCell>
                        <TableCell>{student.lname}</TableCell>
                        <TableCell>
                          {persian.toPersian(student.userName)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Grid>
          </Grid>
          <Grid container direction="row" alignItems="stretch" spacing={16}>
            <Grid item style={{ flexGrow: 1, marginTop: 16 }}>
              <Button
                disabled={waiting || loading}
                className={classes.primary}
                variant="contained"
                color="secondary"
                fullWidth
                onClick={this.handleBtnClick("add")}
              >
                {loading && (
                  <CircularProgress
                    className={classes.buttonProgress}
                    size={24}
                  />
                )}
                افزودن دانش آموز
              </Button>
            </Grid>
            <Grid item style={{ flexGrow: 1, marginTop: 16 }}>
              <Button
                disabled={waiting || loading}
                className={classes.primary}
                variant="contained"
                color="secondary"
                fullWidth
                onClick={this.handleBtnClick("delete")}
              >
                {loading && (
                  <CircularProgress
                    className={classes.buttonProgress}
                    size={24}
                  />
                )}
                حذف دانش آموز
              </Button>
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
