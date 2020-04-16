import React, { Component } from "react";
import { Grid, TextField, Dialog, Slide, IconButton,Menu, Tooltip,Select,MenuItem, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import SearchOutlined from '@material-ui/icons/SearchOutlined';
import Delete from '@material-ui/icons/Delete';
import Sort from '@material-ui/icons/Sort';
import PersonAdd from '@material-ui/icons/PersonAdd';
import { withRouter } from "react-router-dom";
import AdminAddingFormRouter from "../routers/AdminAddingFormRouter";
import persian from 'persian';
import configs from '../../configs';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const styles = theme => {
  return {
    root: {
      margin: 16
    },
    primary: {
      margin: theme.spacing.unit
    }
  };
};
const options = [
  "پیش فرض",
  "زمان ثبت نام",
  "نام خانوادگی- صعودی",
  "نام خانوادگی- نزولی",
  "نام- صعودی",
  "نام- نزولی"
];

const ITEM_HEIGHT = 48;
class FilterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      text_lname: "",
      grade: 0,
      grades : ["همه مقاطع"],
      add: false,
      anchorEl: null,
      sortMode: "پیش فرض"
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleCloseMenu = this.handleCloseMenu.bind(this);
    this.handleSelectMenu = this.handleSelectMenu.bind(this);
  }
  handleChange(name) {
    return (e)=>{
      this.setState({ [name]: persian.toPersian(e.target.value) });
    }
  }

  handleClick(name) {
    switch (name) {
      case "search":
        return () => {
          this.props.onChange(
            {ID:this.state.text === "" ? "default" : persian.toEnglish(this.state.text)}
          );
          this.setState({text_lname:"",text: ""});
        };
      case "searchEnter": 
        return (e) => {
          if (e.key === 'Enter') {
            this.props.onChange(
              {ID:this.state.text === "" ? "default" : persian.toEnglish(this.state.text)}
            );
            this.setState({text_lname:"",text: ""});
          }
        };
        case "searchLName":
        return () => {
          this.props.onChange(
            {lastname:this.state.text_lname === "" ? "default" : this.state.text_lname}
          );
          this.setState({text_lname:"",text: ""});
        };
      case "searchLNameEnter": 
        return (e) => {
          if (e.key === 'Enter') {
            this.props.onChange(
              {lastname:this.state.text_lname === "" ? "default" : this.state.text_lname}
            );
            this.setState({text_lname:"",text: ""});
          }
        };
      case "searchGrade":
        return () => {
          if(this.state.grade!=0){
            this.props.onChange(
              {grade:this.state.grades[this.state.grade]}
            );
            this.setState({text_lname:"",text: ""});
          }else{
            this.props.onChange(
              {ID: "default" }
            );
            this.setState({text_lname:"",text: ""});
          }
        };
      case "add":
        return () => {
          this.setState({ add: true });
        };
      case "sort":
        return (event)=>{
          this.setState({ anchorEl: event.currentTarget });
        }
    }
  }
  handleTextChange(name) {
    return e => {
      if (name === "grade") {
        if(e.target.value==0){
          this.setState(
            {
              grade: e.target.value,
            }
            );
          return;
        }
        this.setState(prevState => {
          return {
            grade: e.target.value,
          };
        });
      }
    };
  }
  handleClose() {
    this.props.onRegister();
    this.setState({add: false});
  }

  handleCloseMenu(){
    this.setState({ anchorEl: null });
  }
  handleSelectMenu(name){
    return ()=>{
      let mode="default";
      switch(name){
        case "پیش فرض":
          mode="default"
          break;
        case "زمان ثبت‌نام":
          mode="modify";
          break;
        case "نام خانوادگی- صعودی":
          mode= "lastname-up";
          break;
        case "نام خانوادگی- نزولی":
          mode= "lastname-down";
          break;
        case "نام- صعودی":
          mode= "firstname-up";
          break;
        case "نام- نزولی":
          mode= "firstname-down";
          break;
        default:
          mode="default";
      }
      this.setState({ anchorEl: null,sortMode:name });
      this.props.onChangeSort(mode);
    }
  }

  componentDidMount() {
    this.state.grades=[
      "همه مقاطع","پیش‌دبستانی","اول","دوم","سوم","چهارم","پنجم","ششم"
    ]
    this.forceUpdate();
    /*
    const req = axios.create({
      baseURL: configs.apiUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("access-token")
      }
    });
    req
      .get("/classes")
      .then(res => {
        let classes = res.data;
        this.state.grades = this.state.grades.concat(_.uniq(classes.map(obj => obj.grade)).sort(
          (x, y) => {
            switch (x) {
              case "پیش‌دبستانی": return true;
              case "اول":
                return y === "پیش‌دبستانی";
              case "دوم":
                return y === "پیش‌دبستانی" || y === "اول";
              case "سوم":
                return y === "پیش‌دبستانی" || y === "اول" || y === "دوم";
              case "چهارم":
                return y === "پیش‌دبستانی" || y !== "پنجم" && y !== "ششم";
              case "پنجم":
                return y === "پیش‌دبستانی" || y !== "ششم";
              case "ششم":
                return false;
            }
          }
        ));
        this.forceUpdate();
      })
      .catch(() => {
        this.handleError("خطای دسترسی به سرور");
      });*/
  }

  render() {
    const { classes, waiting} = this.props;
    const { add, grade } = this.state;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    return (
      <Grid className={classes.root} container justify="center">
         <Grid container item xs={10} spacing={16} alignItems='flex-end'>
          <Grid container item xs={4} spacing={16} alignItems='flex-end'>
            <TextField
              disabled={waiting}
              className={classes.primary}
              label="شماره ملی"
              onChange={this.handleChange('text')}
              onKeyPress= {this.handleClick("searchEnter")}
              value={this.state.text}
            />
            <Tooltip title="جستجوی کد ملی دانش‌آموز">
            <IconButton
              disabled={waiting}
              onClick={this.handleClick("search")}
              size="small"
            >
            <SearchOutlined />
            </IconButton>
            </Tooltip>
          </Grid>
          <Grid container item xs={4} spacing={16} alignItems='flex-end'>
            <TextField
              disabled={waiting}
              className={classes.primary}
              label="نام خانوادگی"
              onChange={this.handleChange('text_lname')}
              onKeyPress= {this.handleClick("searchLNameEnter")}
              value={this.state.text_lname}
            />
            <Tooltip title="جستجوی نام خانوادگی دانش‌آموز">
            <IconButton
              disabled={waiting}
              onClick={this.handleClick("searchLName")}
              size="small"
            >
            <SearchOutlined />
            </IconButton>
            </Tooltip>
          </Grid>
          <Grid container item xs={4} spacing={16} alignItems='flex-end'>
              <Typography className={classes.primary}>پایه:</Typography>
              <Select
                value={grade}
                onChange={this.handleTextChange("grade")}
                required
              >
                {this.state.grades.map((grade, index) => {
                  return (
                    <MenuItem key={index} value={index}>
                      {grade}
                    </MenuItem>
                  );
                })}
              </Select>
              <Tooltip title="جستجو براساس مقطع">
                <IconButton
                  disabled={waiting}
                  onClick={this.handleClick("searchGrade")}
                  size="small"
                >
                  <SearchOutlined />
                </IconButton>
              </Tooltip>
          </Grid>
        </Grid>
        <Grid container item xs={2} justify="flex-end" alignItems='flex-end' spacing={16}>
          <Tooltip title="حذف موارد انتخاب شده">
          <IconButton onClick={this.props.onDelete}>
            <Delete />
          </IconButton>
          </Tooltip>
          <Tooltip title="افزودن دانش‌آموز جدید">
          <IconButton
            disabled={waiting}
            size="small"
            onClick={this.handleClick("add")}
          >
          <PersonAdd />
          </IconButton>
          </Tooltip>
          <Tooltip title="مرتب سازی براساس">
          <IconButton 
            aria-label="More"
            aria-owns={open ? 'long-menu' : undefined}
            aria-haspopup="true"
            onClick={this.handleClick('sort')}
            >
            <Sort />
          </IconButton>
          </Tooltip>
          <Menu
            id="long-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={this.handleCloseMenu}
            PaperProps={{
              style: {
                maxHeight: ITEM_HEIGHT * 4.5,
                width: 200,
              },
            }}
          >
            {options.map(option => (
              <MenuItem key={option} onClick={this.handleSelectMenu(option)}>
                {option}
              </MenuItem>
            ))}
          </Menu>
          <Dialog open={add} TransitionComponent={Transition} maxWidth='md'>
            <AdminAddingFormRouter onRegister={this.handleClose} onCancel={this.handleClose} onError={this.props.onError}/>
          </Dialog>
        </Grid>
        
      </Grid>
    );
  }PersonAdd
}
FilterForm.propTypes = {
  classes: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onChangeSort: PropTypes.func,
  waiting: PropTypes.bool.isRequired,
  onError: PropTypes.func,
  onRegister: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
export default withRouter(withStyles(styles)(FilterForm));
