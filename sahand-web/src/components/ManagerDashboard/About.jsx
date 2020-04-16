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
    this.handleClick = this.handleClick.bind(this);
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
    this.quill.format("font", "IRANSans");
    this.quill.format("size", "Normal");
    this.quill.on("text-change", this.handleTextChange("about"));
    const req = axios.create({
      baseURL: configs.apiUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("access-token")
      }
    });
    req.get("/school/about").then(res => {
      const data = res.data;
      this.quill.setContents(data.about);
      this.setState({
        name: data.name,
        logoSrc: configs.publicUrl + data.avatar,
        changed: false
      });
    });
  }
  handleTextChange(name) {
    switch (name) {
      case "about":
        return (delta, oldDelta, source) => {
          this.setState({ changed: true });
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
      case "name":
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
        case "logo":
          $("#file-input").trigger("click");
          break;
        case "file":
          this.setState(
            {
              logoFile: document.getElementById("file-input").files[0],
              changed: false,
              waiting: true
            },
            () => {
              if (this.state.logoFile) {
                const req = axios.create({
                  baseURL: configs.apiUrl,
                  headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: localStorage.getItem("access-token")
                  }
                });
                const formData = new FormData();
                formData.append("avatar", this.state.logoFile);
                req
                  .put("/school/avatar", formData)
                  .then(res => {
                    this.setState({
                      logoSrc: configs.publicUrl + res.data.url,
                      waiting: false,
                      changed: true
                    });
                  })
                  .catch(err => {
                    switch (err.response.data.errorNumber) {
                      case "088":
                        this.setState({
                          message: "فایل لوگو نامعتبر است",
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
                  });
              }
            }
          );

          break;
        case "update":
          if (this.checkErrors()) {
            const req = axios.create({
              baseURL: configs.apiUrl,
              headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('access-token')
              }
            });
            this.setState({waiting: true, changed:false}, ()=>{
              req.put('/school/about', {
                SchoolName: this.state.name,
                AboutSchool: this.quill.getContents()
              }).then(()=>{
                this.setState({message:'اطلاعات با موفقیت ثبت شد', messageOpen: true, messageType: 'success'});
              }).catch(err=>{
                switch (err.response.data.errorNumber) {
                  case "089":
                    this.setState({
                      message: "متنی که در توضیح مدرسه‌ی خود نوشته‌اید نامعتبر است",
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
              })
            })
            
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
          case "name":
            this.setState({
              messageOpen: true,
              messageType: "error",
              message: "نام مدرسه نامعتبر است",
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
                  onClick={this.handleClick("logo")}
                  type="file"
                />
              )}
              <Input
                id="file-input"
                type="file"
                multiple={false}
                onInput={this.handleClick("file")}
                accept=".jpg, .jpeg, .png"
                style={{ display: "none" }}
                required={false}
              />
            </Grid>
            <Grid item>
              <TextField
                label="نام مدرسه"
                onChange={this.handleTextChange("name")}
                value={name}
                className={classes.primary}
                error={errors.name}
                fullWidth
              />
            </Grid>
            <Grid item className={classes.primary} xs={12}>
              <br />
              <Typography variant="body1">درباره‌ی مدرسه:</Typography>
              <br />
              <div id="editor" style={{ width: "100%", height: "375px" }} />
            </Grid>
            <Grid item>
              <Button
                disabled={waiting || !changed}
                className={classes.primary}
                variant="contained"
                color="secondary"
                onClick={this.handleClick("update")}
                fullWidth
              >
                {waiting && (
                  <CircularProgress
                    className={classes.buttonProgress}
                    size={24}
                  />
                )}
                ویرایش
              </Button>
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
