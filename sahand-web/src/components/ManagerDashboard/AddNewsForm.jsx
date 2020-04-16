import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";
import PopMessages from "../common/PopMessages";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import green from "@material-ui/core/colors/green";
import TextField from "@material-ui/core/TextField";
import Quill from "Quill";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import configs from "../../configs";
import Joi from "joi-browser";

const persianAlphaNum = /^[\u0621-\u0628\u062A-\u063A\u0641-\u0642\u0644-\u0648\u064E-\u0651\u0655\u067E\u0686\u0698\u06A9\u06AF\u06BE\u06CC\s\u06F0-\u06F90-9]+$/;

const styles = theme => {
  return {
    root: {},
    primary: {
      maring: theme.spacing.unit,
      marginTop: theme.spacing.unit,
      minWidth: 1000
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

class AddNewsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // data states
      title: "",
      news: {},
      //errors
      errors: {
        title: true,
        news: true
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
    this.handleTextChange = this.handleTextChange.bind(this);
  }
  componentDidMount() {
    this.quill = new Quill("#editor", {
      modules: {
        toolbar: [
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ script: "sub" }, { script: "super" }], // superscript/subscript
          [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
          [{ direction: "rtl" }], // text direction
          [{ align: ["right", "center", ""] }],
          [{ color: [] }, { background: [] }],
          ["link", "image"]
        ]
      },
      theme: "snow"
    });
    this.quill.format("directrion", "rtl");
    this.quill.format("align", "right");
    this.quill.format("size", "Normal");
    this.quill.on("text-change", this.handleTextChange("news"));
  }
  handleTextChange(name) {
    switch (name) {
      case "news":
        return (delta, oldDelta, source) => {
          this.setState(state => {
            let errors = state["errors"];
            errors["news"] = this.quill.getText().trim().length === 0;
            return { changed: true, errors: errors };
          });
        };
      default:
        return e => {
          const newVal = e.target.value;
          this.setState(state => {
            let errors = state.errors;
            errors[name] = this.validate(name, newVal);
            return { [name]: newVal, errors: errors, changed: true };
          });
        };
    }
  }

  validate(name, val) {
    switch (name) {
      case "title":
        return (
          Joi.string()
            .trim()
            .min(2)
            .max(50)
            .regex(persianAlphaNum)
            .required()
            .validate(val).error !== null
        );
      default:
        return false;
    }
  }
  handleClick(name) {
    return e => {
      switch (name) {
        case "drop":
          this.props.onCancel();
          break;
        case "register":
          if (this.checkErrors()) {
            const req = axios.create({
              baseURL: configs.apiUrl,
              headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("access-token")
              }
            });
            this.setState({ waiting: true, changed: false }, () => {
              req
                .post("/school/news", {
                  Title: this.state.title,
                  News: this.quill.getContents()
                })
                .then(() => {
                  this.setState({
                    message: "اطلاعات با موفقیت ثبت شد",
                    messageOpen: true,
                    messageType: "success"
                  });
                })
                .catch(err => {
                  switch (err.response.data.errorNumber) {
                    case "089":
                      this.setState({
                        message: "عنوان خبر نامعتبر است",
                        messageOpen: true,
                        messageType: "error"
                      });break;
                    case "090": this.setState({
                      message: "شرح خبر نامعتبر است",
                      messageOpen: true,
                      messageType: "error"
                    }); break;
                      default :
                      this.setState({
                        message: "خطای دسترسی به سرور",
                        messageOpen: true,
                        messageType: "error"
                      });
                      break;
                  }
                });
            });
          }
          break;
      }
    };
  }
  checkErrors() {
    const { errors } = this.state;
    for (let error in errors) {
      if (errors[error]) {
        switch (error) {
          case "news":
            this.setState({
              messageOpen: true,
              messageType: "error",
              message: "شرح خبر نامعتبر است",
              waiting: false,
              changed: true
            });
            return false;
          case "title":
            this.setState({
              messageOpen: true,
              messageType: "error",
              message: "عنوان خبر نامعتبر است",
              waiting: false,
              changed: true
            });
            return false;
        }
      }
    }
    return true;
  }
  handleMessageClose(event, reason) {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ messageOpen: false, waiting: false, changed: true },()=>{
      if(this.state.messageType === "success"){
        this.props.onRegister();
      }
    });
  }
  render() {
    const { classes } = this.props;
    const {
      messageOpen,
      messageType,
      message,
      waiting,
      changed,
      title,
      errors
    } = this.state;
    return (
      <div style={{ padding: 32 }}>
        <Grid
          container
          className={classes.root}
          direction="column"
          alignItems="center"
          spacing={16}
        >
          <PopMessages
            open={messageOpen}
            variant={messageType}
            message={message}
            onClose={this.handleMessageClose}
          />
          <Grid item>
            <TextField
              label="عنوان خبر"
              className={classes.primary}
              onChange={this.handleTextChange("title")}
              value={title}
              error={errors.title}
              fullWidth
            />
          </Grid>
          <Grid item className={classes.primary} xs={12}>
            <br />
            <Typography variant="body1">شرح خبر</Typography>
            <br />
            <div id="editor" style={{ width: "100%", height: "220px" }} />
          </Grid>
          <Grid
            container
            item
            direction="row"
            alignItems="stretch"
            spacing={16}
          >
            <Grid item style={{ flexGrow: 1, marginTop: 16 }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={this.handleClick("drop")}
                fullWidth
              >
                انصراف
              </Button>
            </Grid>
            <Grid item style={{ flexGrow: 1, marginTop: 16 }}>
              <Button
                disabled={waiting || !changed}
                variant="contained"
                color="secondary"
                onClick={this.handleClick("register")}
                fullWidth
              >
                {waiting && (
                  <CircularProgress
                    className={classes.buttonProgress}
                    size={24}
                  />
                )}
                انتشار
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

AddNewsForm.propTypes = {
  classes: PropTypes.object.isRequired,
  onRegister: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onError: PropTypes.func
};

export default withStyles(styles)(AddNewsForm);
