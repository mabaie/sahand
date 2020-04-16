import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import {
  Dialog,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Grid,
  CircularProgress
} from "@material-ui/core";

import configs from "../../configs";

import "react-rater/lib/react-rater.css";

import persian from "persian";

const styles = theme => {
  return {
    root: {
      flexGrow: 1
    },
    head: {
      backgroundColor: "#000"
    },
    headcell: {
      color: "#fff"
    }
  };
};

class Attendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      waiting: true,
      data: []
    };
  }
  componentDidMount() {
    const req1 = axios.create({
      baseURL: configs.apiUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("access-token")
      }
    });
    this.setState({ waiting: true }, () => {
      req1
        .post(`/app/teacher/student-list`, {
          courseID: localStorage.getItem("course-id")
        })
        .then(response => {
          console.log(response.data);
          this.setState({ waiting: false, data: response.data.studentList });
        })
        .catch(err => {
          if (err.response.data.errorNumber === "082") {
            this.setState({
              waiting: false,
              data: []
            });
          }
        });
    });
  }

  render() {
    const { classes } = this.props;
    let bodyComponent;
    if (this.state.data[0] && !this.state.waiting) {
      bodyComponent = (
        <Table>
          <TableHead className={classes.head}>
            <TableRow>
              <TableCell align="right">
                <Typography variant="body1" className={classes.headcell}>
                  نام
                </Typography>
              </TableCell>

              <TableCell align="right">
                <Typography variant="body1" className={classes.headcell}>
                  نام‌خانوادگی
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.data.map((el, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Typography variant="body1">{el.firstName}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">{el.lastName}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    } else if(!this.state.data[0] && !this.state.waiting){
      bodyComponent = (
        <Typography variant="body1" align="center">
          لیست دانش‌آموزان وجود ندارد
        </Typography>
      );
    } else {
      bodyComponent = <div></div>
    }
    return (
      <div style={{ padding: 32 }}>
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
        <Grid container direction="column" spacing={16}>
          <Grid item xs={12}>
            <Paper className={classes.root}>{bodyComponent}</Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}
Attendance.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(Attendance);
