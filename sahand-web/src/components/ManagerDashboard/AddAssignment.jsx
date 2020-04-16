import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";
import PopMessages from "../common/PopMessages";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Attach from "@material-ui/icons/AttachFile";
import Delete from "@material-ui/icons/Delete";
import CircularProgress from "@material-ui/core/CircularProgress";
import green from "@material-ui/core/colors/green";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import configs from "../../configs";
import Joi from "joi-browser";
import ReactFileReader from 'react-file-reader';
import $ from "jquery";

const persianAlphaNum = /^[\u0621-\u0628\u062A-\u063A\u0641-\u0642\u0644-\u0648\u064E-\u0651\u0655\u067E\u0686\u0698\u06A9\u06AF\u06BE\u06CC\s\u06F0-\u06F90-9]+$/;

const styles = theme => {
  return {
    root: {},
    primary: {
      maring: theme.spacing.unit,
      marginTop: 0,
      minWidth: 1000
    },
    buttonProgress: {
      color: green[500],
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: -12,
      marginLeft: -12
    },
  };
};

class AddMagazineForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // data states
      title: "",
      date:new Date(),
      description: "",
      attachment:"",
      file:[],
      file_url:[],
      //errors
      errors: {
        title: true,
        description: true
      },
      // control States
      messageOpen: false,
      message: "",
      messageType: "error",
      waiting: false,
      changed: false
    };
    this.handleMessageClose = this.handleMessageClose.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleFiles = this.handleFiles.bind(this);
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
          this.setState({date:date})
        }
      }
    });
  }


  handleTextChange(name) {
    switch (name) {
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
  handleClick(name,index=0) {
    return e => {
      switch (name) {
        case "drop":
          this.props.onCancel();
          break;
        case "register":
          let formdata = new FormData();
          formdata.append("assignment", 
            this.state.file
          );
          let date= new Date(this.state.date)
          // formdata.append("title",this.state.title);
          // formdata.append("deadline",date.toISOString());
          // formdata.append("description",this.state.description);
          if (this.checkErrors()) {
            const req = axios.create({
              baseURL: configs.apiUrl,
              headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("access-token")
              }
            });
            this.setState({ waiting: true }, () => {
              req
                .post("/assignment/" + this.props.record._id, 
                this.state.file_url.length>0?{
                    assignment:this.state.file_url,
                    title:this.state.title,
                    deadline:date.toISOString(),
                    description:this.state.description
                  }:{
                    title:this.state.title,
                    deadline:date.toISOString(),
                    description:this.state.description
                  }
                )
                .then(() => {
                  this.setState({
                    message: "اطلاعات با موفقیت ثبت شد",
                    messageOpen: true,
                    messageType: "success",
                    waiting:false
                  });
                })
                .catch(err => {
                  switch (err.response.data.errorNumber) {
                    case "089":
                      this.setState({
                        message: "عنوان نامعتبر است",
                        messageOpen: true,
                        messageType: "error",
                        waiting:false
                      });
                      break;
                    case "090": this.setState({
                      message: "شرح نامعتبر است",
                      messageOpen: true,
                      messageType: "error",
                      waiting:false
                    }); break;
                      default :
                      this.setState({
                        message: "خطای سرور",
                        messageOpen: true,
                        messageType: "error"
                      });
                      break;
                  }
                });
            });
          }
          break;
        case "DeleteFile":
          this.state.file.splice(index,1);
          this.state.file_url.splice(index,1);
          this.forceUpdate();
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

  handleFiles(files){
    let formdata = new FormData();
    formdata.append("Attachment", files.fileList[0])
    const req = axios.create({
        baseURL: configs.apiUrl,
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: localStorage.getItem("access-token")
        }
    });
    req.post("/school/upload/assignments", formdata).then(res=>{
      this
        .state
        .file_url.push(res.data.uri);
      this.state.file.push(files.fileList[0]);
      this.forceUpdate();
    }).catch (error=> {
        this.setState(
            {message: "سند بارگذاری نشده است.", messageOpen: true, messageType: "error"}
        );
        return;
    })
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
              label="عنوان"
              className={classes.primary}
              onChange={this.handleTextChange("title")}
              value={title}
              error={errors.title}
              fullWidth
            />
          </Grid>
          <Grid item className={classes.primary} xs={12}>
            {this.state.file.map((f,i)=>(
              <Grid container spacing={8} alignItems="center">
                <Grid item>
                  <Button onClick={()=>{
                    window.open(configs.publicUrl + this.state.file_url[i], "_blank")
                  }}>
                    <Typography variant="body1">{f.name}</Typography>
                  </Button>
                </Grid>
                <Grid item>
                  <IconButton color="secondary" onClick={this.handleClick("DeleteFile",i)}>
                    <Delete />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
          </Grid>
          <Grid item className={classes.primary} xs={12}>
            <ReactFileReader fileTypes={[".pdf",".jpg",".png",".mp3",".wav",".flac",".aiff",".ogg",".mp4"]} base64={true} multipleFiles={false} handleFiles={this.handleFiles}>
              <IconButton color="primary">
              {waiting && (
                  <CircularProgress
                    className={classes.buttonProgress}
                    size={24}
                  />
                )}
                <Attach />
              </IconButton>
            </ReactFileReader>
          </Grid>
          <Grid item className={classes.primary} xs={12}>
            <Grid container spacing={8} alignItems="center">
              <Grid item>
                <Typography variant="body1">تاریخ تحویل:</Typography>
              </Grid>
              <Grid item>
                <TextField
                  inputProps={{
                    style: { textAlign: "center" }
                  }}
                  id={"calendar"}
                  disabled={this.state.shouldSearch || this.state.shouldGoNext}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4}>
          
          </Grid>
          <Grid item className={classes.primary} xs={12}>
            <Typography variant="body1">شرح</Typography>
          </Grid>
          <Grid item>
            <TextField
              label="توضیحات تمرین"
              className={classes.primary}
              multiline
              rows="8"
              onChange={this.handleTextChange("description")}
              fullWidth
            />
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
                ارسال
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

AddMagazineForm.propTypes = {
  classes: PropTypes.object.isRequired,
  onRegister: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onError: PropTypes.func,
  record: PropTypes.object.isRequired
};

export default withStyles(styles)(AddMagazineForm);
