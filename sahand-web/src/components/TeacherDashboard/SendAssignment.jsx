//ساعت خوب- ساعت شوروع و پایان تکلیف و مسواک زده یا خیر همه ی اینها تایید یا رد

import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Delete from "@material-ui/icons/Delete";
import {
  Grid,
  Typography,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Button,
  CircularProgress,
  TextField,
  Paper,
  Dialog,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";
import persian from "persian";
import configs from "../../configs";
// import MuiPickersUtilsProvider from "material-ui-pickers/MuiPickersUtilsProvider";
// import JalaliUtils from 'material-ui-persian-date-picker-utils';
import jMoment from "moment-jalaali";
// import { DatePicker } from "material-ui-pickers";
import ReactFileReader from "react-file-reader";
import Attach from "@material-ui/icons/AttachFile";
import Image from "@material-ui/icons/Image";
import Movie from "@material-ui/icons/LocalMovies";
import Doc from "@material-ui/icons/Note";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

const styles = theme => {
  return {
    root: {
      flexGrow: 1,
      padding: 20
    },
    textField: {
      marginTop: 20,
      marginBottom: 20
    },
    head: {
      backgroundColor: "#000"
    },
    headcell: {
      color: "#fff"
    },
    paper: {
      marginTop: 20,
      padding: 20
    }
  };
};

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      waiting: false,
      open: false,
      selectedDate: new Date(),
      fileName: "",
      file: null,
      pastAssignments: [],
      openarr: []
    };
    this.handleButtons = this.handleButtons.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFiles = this.handleFiles.bind(this);
    this.handleClickDelete = this.handleClickDelete.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  handleClickDelete() {
    this.setState({ file: null, fileName: "" });
  }
  handleButtons(s) {
    const req = axios.create({
      baseURL: configs.apiUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("access-token")
      }
    });
    if (s === "accept") {
      let formdata = new FormData();
      formdata.append("assignment", this.state.file);
      let date = new Date(this.state.selectedDate);
      formdata.append("title", this.state.title);
      formdata.append("deadline", date.toISOString());
      formdata.append("description", this.state.description);
      this.setState(
        {
          waiting: true
        },
        () => {
          req
            .post(
              `/app/assignment/${localStorage.getItem("course-id")}`,
              formdata
            )
            .then(response => {
              this.setState(
                {
                  waiting: true
                },
                () => {
                  req
                    .get(
                      `/app/assignments/${localStorage.getItem("course-id")}`
                    )
                    .then(response => {
                      this.setState({
                        waiting: false,
                        open: true,
                        message: "تمرین شما با موققیت ثبت شد.",
                        pastAssignments: response.data
                      });
                    })
                    .catch(err => {
                      alert("خطای سرور");
                    });
                }
              );
            })
            .catch(err => {
              switch (err.response.data.errorNumber) {
                case "088":
                  this.setState({
                    message: "فایل پیوست نامعتبر است.",
                    open: true,
                    waiting: false
                  });
                  break;
                case "089":
                  this.setState({
                    message: "عنوان نامعتبر است",
                    open: true,
                    waiting: false
                  });
                  break;
                case "090":
                  this.setState({
                    message: "شرح نامعتبر است",
                    open: true,
                    waiting: false
                  });
                  break;
              }
            });
        }
      );
    } else {
      this.setState({
        title: "",
        description: "",
        selectedDate: moment(),
        file: null
      });
    }
  }

  handleClose() {
    this.setState({ open: false });
    this.handleButtons("cancel");
  }

  handleChange(e, s) {
    if (s === "description") {
      this.setState({ description: e });
    } else if (s === "title") {
      this.setState({ title: e });
    }
  }

  handleFiles(files) {
    this.setState({
      fileName: files.fileList[0].name,
      file: files.fileList[0],
      waiting: false
    });
  }
  handleClick(i) {
    var arr = this.state.openarr;
    arr[i] = !this.state.openarr[i];
    this.setState({ openarr: arr });
  }
  componentDidMount() {
    this.calendar = $("#calendar").persianDatepicker({
      format: "YYYY/MM/DD",
      minDate: new Date(),
      toolbox: {
        calendarSwitch: {
          enabled: false
        }
      },
      dayPicker: {
        onSelect: date => {
          this.setState({ selectedDate: date });
        }
      }
    });
    const req = axios.create({
      baseURL: configs.apiUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("access-token")
      }
    });
    this.setState(
      {
        waiting: true
      },
      () => {
        req
          .get(`/app/assignments/${localStorage.getItem("course-id")}`)
          .then(response => {
            this.setState({ waiting: false, pastAssignments: response.data });
          })
          .catch(err => {
            alert("خطای سرور");
          });
      }
    );
  }
  handleClickFile(name) {
    return e => {
      window.open(configs.publicUrl + name, "_blank");
    };
  }
  render() {
    const { classes } = this.props;

    let pastAssignmentsComponents;
    if (!this.state.waiting && !this.state.pastAssignments.length) {
      pastAssignmentsComponents = (
        <Typography variant="body1">هنوز تمرینی ارسال نشده است</Typography>
      );
    } else {
      pastAssignmentsComponents = (
        <Table>
          <TableHead className={classes.head}>
            <TableRow>
              <TableCell />
              <TableCell align="right">
                <Typography variant="body1" className={classes.headcell}>
                  عنوان
                </Typography>
              </TableCell>

              <TableCell align="right">
                <Typography variant="body1" className={classes.headcell}>
                  تاریخ تحویل
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.pastAssignments.map((row, i) => (
              <React.Fragment key={i}>
                <TableRow button onClick={() => this.handleClick(i)}>
                  <TableCell component="th" scope="row">
                    <IconButton>
                      {this.state.openarr[i] ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </TableCell>
                  <TableCell align="right"> {row.title}</TableCell>

                  <TableCell align="right">
                    {persian.toPersian(
                      jMoment(row.deadline).format("jYYYY/jM/jD")
                    )}
                  </TableCell>
                </TableRow>
                {this.state.openarr[i] && (
                  <TableRow align="right">
                    <TableCell colSpan={4}>
                      <Typography variant="body2">جزییات</Typography>
                      <Typography variant="p">{row.description}</Typography>

                      <br />
                      <Typography variant="body2">پیوست</Typography>
                      {this.state.fileName !== "" ? (
                        <IconButton
                          color="secondary"
                          onClick={this.handleClickFile(row.assignment)}
                        >
                          {this.state.fileName === "movie" ? (
                            <Movie />
                          ) : this.state.fileName === "image" ? (
                            <Image />
                          ) : this.state.fileName === "doc" ? (
                            <Doc />
                          ) : (
                            ""
                          )}

                          {row.assignment.length > 0 &&
                          row.assignment.substr(
                            row.assignment.length - 3,
                            3
                          ) === "mp4" ? (
                            <Movie />
                          ) : row.assignment.length > 0 &&
                            row.assignment.substr(
                              row.assignment.length - 3,
                              3
                            ) === "jpg" ? (
                            <Image />
                          ) : row.assignment.length > 0 &&
                            row.assignment.substr(
                              row.assignment.length - 3,
                              3
                            ) === "pdf" ? (
                            <Doc />
                          ) : (
                            ""
                          )}
                        </IconButton>
                      ) : (
                        <Typography variant="p">ندارد</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      );
    }

    return (
      <Grid
        className={classes.root}
        container
        justify="center"
        direction="column"
      >
        <Dialog open={this.state.waiting}>
          <div
            style={{ padding: 20, overflowX: "hidden", overflowY: "hidden" }}
          >
            <Typography variant="body1" align="center">
              منتظر بمانید
            </Typography>
            <CircularProgress
              style={{
                marginTop: 20,
                marginBottom: 20,
                marginLeft: 30,
                marginRight: 30
              }}
            />
          </div>
        </Dialog>
        <Dialog open={this.state.open} onClose={this.handleClose}>
          <div
            style={{ padding: 20, overflowX: "hidden", overflowY: "hidden" }}
          >
            <Typography variant="body1" align="center">
              {this.state.message}
            </Typography>
          </div>
        </Dialog>

        <Card className={classes.card}>
          <CardContent>
            <Grid item>
              <Typography gutterBottom variant="body2">
                موضوع تمرین
              </Typography>
              <TextField
                id="text"
                type="text"
                value={this.state.title}
                onChange={e => this.handleChange(e.target.value, "title")}
                className={classes.textField}
                fullWidth
                multiline
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>

            <Grid item>
              <Typography gutterBottom variant="body2">
                متن تمرین
              </Typography>
              <TextField
                id="text"
                type="text"
                value={this.state.description}
                onChange={e => this.handleChange(e.target.value, "description")}
                className={classes.textField}
                fullWidth
                multiline
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>
            <Grid item>
              <Typography gutterBottom variant="body2">
                مهلت تمرین
              </Typography>
              <TextField
                inputProps={{
                  style: { textAlign: "center" }
                }}
                id={"calendar"}
                disabled={this.state.shouldSearch || this.state.shouldGoNext}
              />
            </Grid>
            <Grid item>
              <Typography gutterBottom variant="body2">
                پیوست
              </Typography>

              {this.state.file === null ? (
                <ReactFileReader
                  fileTypes={[".pdf"]}
                  base64={true}
                  multipleFiles={false}
                  handleFiles={this.handleFiles}
                >
                  <IconButton color="primary">
                    {this.state.waiting && (
                      <CircularProgress
                        className={classes.buttonProgress}
                        size={24}
                      />
                    )}
                    <Attach />
                  </IconButton>
                </ReactFileReader>
              ) : (
                <Grid container spacing={8} alignItems="center">
                  <Grid item>
                    <Typography variant="body1">
                      {this.state.fileName}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <IconButton
                      color="secondary"
                      onClick={this.handleClickDelete}
                    >
                      <Delete />
                    </IconButton>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </CardContent>
          <CardActions>
            <Button
              onClick={() => this.handleButtons("accept")}
              variant="contained"
              color="secondary"
            >
              تایید
            </Button>
            <Button
              onClick={() => this.handleButtons("cancel")}
              variant="contained"
              color="default"
            >
              انصراف
            </Button>
          </CardActions>
        </Card>

        <Paper className={classes.paper}>
          <Typography
            style={{ marginBottom: 10 }}
            component="h2"
            variant="headline"
            gutterBottom
          >
            تمرینات قبلی
          </Typography>

          {pastAssignmentsComponents}
        </Paper>
      </Grid>
    );
  }
}
Settings.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(Settings);
