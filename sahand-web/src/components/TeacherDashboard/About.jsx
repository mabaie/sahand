import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";
import PopMessages from "../common/PopMessages";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import green from "@material-ui/core/colors/green";
import TextField from "@material-ui/core/TextField";
import Quill from "Quill";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import $ from "jquery";
import Input from "@material-ui/core/Input";
import axios from "axios";
import configs from "../../configs";
import Joi from "joi-browser";
const persianAlphaNum = /^[\u0621-\u0628\u062A-\u063A\u0641-\u0642\u0644-\u0648\u064E-\u0651\u0655\u067E\u0686\u0698\u06A9\u06AF\u06BE\u06CC\s\u06F0-\u06F90-9]+$/;

const styles = theme => {
  return {
    root: {
      padding: theme.spacing.unit * 2,
      margin: theme.spacing.unit * 10
    },
    primary: {
      maring: theme.spacing.unit,
      marginTop: theme.spacing.unit,
      minWidth: 500
    },
    buttonProgress: {
      color: green[500],
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: -12,
      marginLeft: -12
    },
    avatar: {
      width: 60,
      height: 60
    }
  };
};
class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // data states
      name: "",
      about: {},
      logoFile: "",
      logoSrc: "",
      //errors
      errors: {
        name: false
      },
      // control States
      messageOpen: false,
      message: "",
      messageType: "error",
      waiting: false,
      changed: false
    };
    this.quill = null;
    this.handleMessageClose = this.handleMessageClose.bind(this);
    
  }
  componentDidMount() {
    var options = {
      debug: 'info',
      modules: {
        toolbar: false
      },
      readOnly: true
    };
    this.quill = new Quill("#editor",options);
    this.quill.format("directrion", "rtl");
    this.quill.format("align", "right");
    this.quill.format("font", "IRANSans");
    this.quill.format("size", "Normal");
    
    const req = axios.create({
      baseURL: configs.apiUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("access-token")
      }
    });
    req.get(`/app/teacher/school/about/${localStorage.getItem("school-id")}`).then(res => {
      const data = res.data;
      this.quill.setContents(data.about);
      this.setState({
        name: data.name,
        logoSrc: configs.publicUrl + data.avatar,
        changed: false
      });
    });
  }

  
  handleMessageClose(event, reason) {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ messageOpen: false, waiting: false, changed: true });
  }
  render() {
    const { classes } = this.props;
    const {
      messageOpen,
      messageType,
      message,
      waiting,
      changed,
      name,
      logoSrc,
      errors
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
            <Grid item container direction="row" justify="center">
              {logoSrc && (
                <Avatar
                  component={Button}
                  className={classes.avatar}
                  src={logoSrc}
                  alt="جای لوگو"
                  type="file"
                />
              )}
              
            </Grid>
            <Grid item>
            <Typography variant="body1">نام مدرسه:</Typography>
            <Typography variant="body1">{name}</Typography>
            </Grid>
            <Grid item className={classes.primary} xs={12}>
              <br />
              <Typography variant="body1">درباره‌ی مدرسه:</Typography>
              <br />
              <div id="editor" style={{ width: "100%", height: "auto" }} />
            </Grid>
            
          </Paper>
        </Grid>
      </div>
    );
  }
}
About.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(About);
