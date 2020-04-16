import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Attach from "@material-ui/icons/AttachFile";
import Image from "@material-ui/icons/Image";
import Movie from "@material-ui/icons/LocalMovies";
import Doc from "@material-ui/icons/Note";
import ReactFileReader from 'react-file-reader';
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import CircularProgress from "@material-ui/core/CircularProgress";
import green from "@material-ui/core/colors/green";
import PopMessages from "../common/PopMessages";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Quill from "Quill";
import Joi from "joi-browser";
import configs from '../../configs';

const persianAlphaNum = /^[\u0621-\u0628\u062A-\u063A\u0641-\u0642\u0644-\u0648\u064E-\u0651\u0655\u067E\u0686\u0698\u06A9\u06AF\u06BE\u06CC\s\u06F0-\u06F90-9]+$/;

const styles = theme => {
  return {
    primary: {
      marginTop: theme.spacing.unit,
      marginLeft: theme.spacing.unit * 2,
      margigRight: theme.spacing.unit * 2
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
class MagazinDetailPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description:{},
      attachment:"",
      fileName:"",
      errors: {
        title: false,
        description: false
      },
      waiting: false,
      changed: false,
      messageOpen: false,
      messageType: "error",
      message: ""
    };
    this.handleMessageClose = this.handleMessageClose.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleBtnClick = this.handleBtnClick.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleFiles = this.handleFiles.bind(this);
  }
  componentDidMount() {
    const { record } = this.props;
    this.quill = new Quill(`#editor-${record._id}`, {
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
    this.quill.on("text-change", this.handleTextChange("description"));
    this.quill.setContents(record.description);
    this.setState({
      title: record.title, 
      changed: false, 
      attachment:record.attachment,
      fileName:((record.attachment.length>0 && record.attachment.substr(record.attachment.length-3,3)==="mp4")?"movie":
        (record.attachment.length>0 && record.attachment.substr(record.attachment.length-3,3)==="jpg")?"image":
        (record.attachment.length>0 && record.attachment.substr(record.attachment.length-3,3)==="pdf")?"doc":""
      )
    });
  }
  handleBtnClick() {
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
          .put("/school/magazine/" + this.props.record._id, {
            Title: this.state.title,
            Description: this.quill.getContents(),
            Attachment:this.state.attachment
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
                  message: "عنوان نامعتبر است",
                  messageOpen: true,
                  messageType: "error"
                });
                break;
              case "090":
                this.setState({
                  message: "جزئیات نامعتبر است",
                  messageOpen: true,
                  messageType: "error"
                });
                break;
            }
          });
      });
    }
  }
  handleClick(name) {
    return e => {
      switch (name) {
        case "DeleteFile":
          this.setState({attachment:"",fileName:"",changed:true})
          break;
        case "OpenFile":
          window.open(configs.publicUrl + this.state.attachment, "_blank")
          break;
      }
    };
  }
  handleFiles(files){
    let formdata = new FormData();
    formdata.append("Attachment", 
      files.fileList[0]
    )
    const req = axios.create({
      baseURL: configs.apiUrl,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: localStorage.getItem("access-token")
      }
    });
    this.setState({ waiting: true, changed: false },()=>{
      req
        .post("/school/upload/magazine", 
          formdata
        )
        .then((response) => {
          response
            this.setState({fileName:files.fileList[0].name,attachment:response.data.uri, waiting: false, changed: true})
				  })
				  .catch(error => {
            this.setState({
                message: "سند بارگذاری نشده است",
                messageOpen: true,
                messageType: "error"
              });
        })
        .catch(err => {
          this.setState({
            message: "سند بارگذاری نشده است",
            messageOpen: true,
            messageType: "error"
          });
        });
    });
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

    this.setState({ messageOpen: false, waiting: false, changed: true }, () => {
      if (this.state.messageType === "success") {
        this.props.onRegister();
      }
    });
  }
  handleTextChange(name) {
    switch (name) {
      case "description":
        return (delta, oldDelta, source) => {
          this.setState(state => {
            let errors = state["errors"];
            errors["description"] = this.quill.getText().trim().length === 0;
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
  render() {
    const { classes, record } = this.props;
    const {
      waiting,
      changed,
      messageOpen,
      messageType,
      message,
      title,
      errors
    } = this.state;
    return (
      <div style={{ padding: 32 }}>
        <Grid container direction="column" spacing={16}>
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
          {
            (this.state.attachment.length === 0)?
            <ReactFileReader fileTypes={[".jpg",".pdf",".mp4"]} base64={true} multipleFiles={false} handleFiles={this.handleFiles}>
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
            :<Grid container spacing={8} alignItems="center">
              <Grid item>
                <IconButton color="secondary" onClick={this.handleClick("OpenFile")}>
                  {
                    (this.state.fileName==="movie")?
                    <Movie />:
                    (this.state.fileName==="image")?
                    <Image />:<Doc />
                  }
                </IconButton>
              </Grid>
              <Grid item>
                <Button color="secondary" onClick={this.handleClick("DeleteFile")}>
                  <Typography variant="body1">حذف</Typography>
                </Button>
              </Grid>
            </Grid>
          }
          </Grid>
          <Grid item className={classes.primary} xs={12}>
            <br />
            <Typography variant="body1">جزئیات</Typography>
            <br />
            <div
              id={`editor-${record._id}`}
              style={{ width: "100%", height: "220px" }}
            />
          </Grid>
          <Grid item>
            <Button
              disabled={waiting || !changed}
              variant="contained"
              color="secondary"
              onClick={this.handleBtnClick}
              className={classes.primary}
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
        </Grid>
      </div>
    );
  }
}
MagazinDetailPanel.propTypes = {
  classes: PropTypes.object.isRequired,
  record: PropTypes.object.isRequired,
  waiting: PropTypes.bool.isRequired,
  onWaiting: PropTypes.func.isRequired,
  onRegister: PropTypes.func.isRequired
};
export default withStyles(styles)(MagazinDetailPanel);
