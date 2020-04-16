import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import { Grid, FormControl,FormLabel,Select,MenuItem,IconButton } from "@material-ui/core";
import {Table,TableRow,TableCell} from "@material-ui/core";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import Delete from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";
import AddCircle from "@material-ui/icons/AddCircle";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
import Joi from "joi-browser";
import green from "@material-ui/core/colors/green";
import axios from "axios";
import configs from "../../configs";

const persianStringRegExp = /^[\u0621-\u0628\u062A-\u063A\u0641-\u0642\u0644-\u0648\u064E-\u0651\u0655\u067E\u0686\u0698\u06A9\u06AF\u06BE\u06CC\s]+$/;

const style = theme => ({
  root: { padding: theme.spacing.unit },
  addBtn: {
    display: "flex",
    justifyContent: "flex-end",
    padding: theme.spacing.unit * 2,
    color: "white"
  },
  btnIcons: {
    marginLeft: theme.spacing.unit
  },
  dialogDefault: {
    background: theme.palette.background.paper
  },
  dialogError: {
    background: theme.palette.error.dark,
    color: "white"
  },
  dialogSuccess: {
    background: green[500],
    color: "white"
  }
});

class Encourage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      titleerr: true,
      openDialog: false,
      messageOpen: false,
      messageType: "default",
      message: "",
      waiting: false,
      homeActivityList: [],
      index:0,
    };
    this.type=[
      {name:'زمان',id:'time'},
      {name:'تایید یا رد',id:'boolean'},
      {name:'توضیحی',id:'description'}
    ]
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleBtnClick = this.handleBtnClick.bind(this);
    this.handleMessageClose = this.handleMessageClose.bind(this);
  }
  componentDidMount() {
    const req = axios.create({
      baseURL: configs.apiUrl,
      headers: {
        Authorization: localStorage.getItem("access-token")
      }
    });
    req
      .get("/school/home-activity-list")
      .then(res => {
        console.log(res.data)
        this.setState({ homeActivityList: res.data });
      })
      .catch(err => {
        this.showMessage("error", "خطای ارتباط با سرور");
      });
  }
  handleTextChange(value){
    return e => {
      const text = e.target.value;
      if(value==='title'){
        this.setState({ [value]: text, titleerr: this.validate(text) });
      }else{
        this.setState({ [value]: text});
      }
    }
  }
  handleBtnClick(name, id) {
    return e => {
      const req = axios.create({
        baseURL: configs.apiUrl,
        headers: {
          Authorization: localStorage.getItem("access-token")
        }
      });
      switch (name) {
        case "cancel":
          this.setState({ openDialog: false });
          return;
        case "add":
          this.setState({
            messageOpen: false,
            messageType: "default",
            message: "",
            openDialog: true
          });
          return;
        case "delete":
          req
            .delete("/school/home-activity/" + id)
            .then(() => {
              this.showMessage("success", "حذف با موفقیت انجام گرفت");
            })
            .catch(err => {
              this.showMessage("error", "خطا در ارتباط با سرور");
            });
          return;
        case "confirm":
          if (this.checkError()) {
            const req = axios.create({
              baseURL: configs.apiUrl,
              headers: {
                Authorization: localStorage.getItem("access-token"),
                "Content-Type": "application/json"
              }
            });
            req
              .post("/school/home-activity", 
                {
                  title: this.state.title,
                  type:this.type[this.state.index].id 
                })
              .then(() => {
                this.showMessage(
                  "success",
                  "معیار فعالیت در خانه جدید با موفقیت اضافه شد"
                );
              })
              .catch(err => {
                this.showMessage("error", "خطای ارتباط با سرور");
              });
          }
          return;
      }
    };
  }
  checkError() {
    if (this.state.titleerr) {
      this.showMessage("error", "عنوان انتخابی معتبر نمی‌باشد!");
      return false;
    }
    return true;
  }
  showMessage(type, message) {
    this.setState(
      {
        message: message,
        messageType: type,
        messageOpen: true,
        openDialog: true
      },
      () => {
        setTimeout(this.handleMessageClose, 3000);
      }
    );
  }
  handleMessageClose() {
    this.setState(prevState => {
      if (prevState.messageType === "success") {
        const req = axios.create({
          baseURL: configs.apiUrl,
          headers: {
            Authorization: localStorage.getItem("access-token")
          }
        });
        req
          .get("/school/home-activity-list")
          .then(res => {
            this.setState({
              openDialog: false,
              title: "",
              index:0,
              titleerr: true,
              waiting: false,
              homeActivityList: res.data
            });
          })
          .catch(err => {
            this.showMessage("error", "خطای ارتباط با سرور");
          });
        return prevState;
      } else {
        return {
          messageOpen: false,
          messageType: "default",
          message: "",
          openDialog: prevState.messageType === "error",
          waiting: false
        };
      }
    });
  }
  validate(value) {
    return (
      Joi.string()
        .min(3)
        .max(200)
        .regex(persianStringRegExp)
        .required()
        .validate(value).error !== null
    );
  }
  render() {
    const { classes } = this.props;
    const {
      title,
      index,
      titleerr,
      openDialog,
      messageOpen,
      messageType,
      message,
      homeActivityList
    } = this.state;

    let dialogStyle, messageText;
    switch (messageType) {
      case "error":
        dialogStyle = classes.dialogError;
        messageText = message;
        break;
      case "success":
        dialogStyle = classes.dialogSuccess;
        messageText = message;
        break;
      default:
        dialogStyle = classes.dialogDefault;
        messageText =
          ":لطفا عنوان و نوع «فعالیت در خانه» را انتخاب نمایید";
        break;
    }
    return (
      <div className={classes.root}>
        <Dialog disableEnforceFocus={true} open={openDialog}>
          {!messageOpen && <DialogTitle>تعریف کردن معیار فعالیت در خانه</DialogTitle>}
          <DialogContent className={dialogStyle}>
            <DialogContentText className={dialogStyle}>
              {messageText}
            </DialogContentText>
            {!messageOpen && (
              <Grid container direction="row" alignItems="stretch" spacing={16}>
                <Grid xs={12} item style={{ flexGrow: 1, marginTop: 16 }}>
                  <TextField
                    margin="dense"
                    label="عنوان"
                    value={title}
                    error={titleerr}
                    onChange={this.handleTextChange("title")}
                    fullWidth
                  />
                </Grid>
                <Grid xs={12} item style={{ flexGrow: 1, marginTop: 16 }}>
                  <FormControl>
                    <FormLabel>نوع گزارش</FormLabel>
                    <Select
                      value={index}
                      onChange={this.handleTextChange("index")}
                    >
                      {this.type.map((name, index) => {
                        return (
                          <MenuItem key={index} value={index}>
                            {name.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          {!messageOpen && (
            <DialogActions>
              <Button
                variant="contained"
                color="secondary"
                onClick={this.handleBtnClick("confirm")}
              >
                تأیید
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={this.handleBtnClick("cancel")}
              >
                انصراف
              </Button>
            </DialogActions>
          )}
        </Dialog>
        <Paper className={classes.root}>
          <Typography variant="title">لیست معیارهای 'فعالیت در خانه'</Typography>
          <div className={classes.addBtn}>
            <Button
              variant="contained"
              color="secondary"
              onClick={this.handleBtnClick("add")}
            >
              افزودن
              <AddCircle className={classes.btnIcons} />
            </Button>
          </div>
          <List>
            {homeActivityList.map(homeActivity => {
              return (
                <ListItem key={homeActivity._id}>
                  <ListItemIcon>
                    <ChevronLeft />
                  </ListItemIcon>
                  <ListItemText>{homeActivity.title}</ListItemText>
                  <ListItemText>{"نوع: "+this.type[this.type.findIndex((item)=>{
                    return item.id===homeActivity.type
                  })].name}</ListItemText>
                  <ListItemSecondaryAction>
                    <IconButton
                      onClick={this.handleBtnClick("delete", homeActivity._id)}
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </Paper>
      </div>
    );
  }
}

Encourage.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(style)(Encourage);
