import React, { Component } from "react";
import PropTypes from "prop-types";
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import withStyles from "@material-ui/core/styles/withStyles";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  FormControl,
  Slide
} from "@material-ui/core";
import Persian from 'persian';
import axios from "axios";
import configs from "../../configs";

import DoneAll from "@material-ui/icons/DoneAll"

import bazar from "./images/bazar.png";
//import sibapp from "./images/sibApp.png";
import anardooni from "./images/Anardoni-Badge-White-Persian.png"
import manager_image from "./images/manager_small.jpg";
import parent_image from "./images/parent_smal.jpg";

const useStyles = theme => {
  return{
    root: {
      height: '100vh',
      minHeight:'600px',
    },
    root_slide: {
      height: '100vh',
      //minHeight:'600px',
    },
    image: {
      backgroundImage: 'url(https://source.unsplash.com/collection/8716299/)',//'url(https://source.unsplash.com/random/?pencil)',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    paper: {
      display: 'flex',
      margin: theme.spacing.unit * 10,
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
    },
    form: {
      width: '100%', // Fix IE 11 issue.
    },
    submit: {
    },
  }
};
function Transition(props) {
  return <Slide direction="up" {...props} />;
}
class Landing extends Component {
  constructor(props) {
    super(props);
    this.titleList = [
      'مشاهده فعالیت های کلاسی',
      'نظارت مستمر والدین بر دانش‌آموز',
      'اطلاع از فعالیت‌های فوق برنامه',
      'ارتباط مستمر مدرسه و والدین',
      'ارتباط برخط اولیا و مربیان'
    ];
    this.state = {
      username: "",
      password: "",
      from: this.props.match.url,
      login: true,
      accessToken: "",
      newPass: "",
      oldPass: "",
      newPassConfirm: "",
      width: 0,
      height: 0,
      login_hide:true,
      random:Math.floor(Math.random() * this.titleList.length)
    };
    this.handleTextChange=this.handleTextChange.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
  }
  handleExited() {
    //this.onClose();
    this.setState({
      login: true,
      from: this.props.match.url
    });
  }
  handleClose() {
    this.setState({
      login: true,
      username: "",
      password: ""
    });
  }
  handleLogin() {
    // this.setState({
    //   open: false,
    //   username: "",
    //   password: "",
    // });
    const server = axios.create({
      baseURL: configs.apiUrl,
      timeout: 5000,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + configs.API_SECRET_KEY
      }
    });
    if (this.state.login) {
      server
        .post("/login", {
          userName: Persian.toEnglish(this.state.username),
          Password: this.state.password
        })
        .then(
          function(response) {
            if (response.data.FirstLogin) {
              this.setState({
                login: false,
                accessToken: response.headers.authorization
              });
            } else {
              localStorage.setItem(
                "access-token",
                response.headers.authorization
              );
              if (this.state.from === "/") {
                if (response.data.Type.manager === true) {
                  this.props.history.push("/sahand/manager/dashboard");
                } else if (response.data.Type.admin === true) {
                  this.props.history.push("/sahand/admin/dashboard");
                } else if (response.data.Type.parent === true) {
                  
                  const req = axios.create({
                    baseURL: configs.apiUrl,
                    headers: {
                      Authorization: response.headers.authorization
                    }
                  });
                  req
                    .get("/app/parent/chiled-list")
                    .then(res => {
                      this.props.history.push("/sahand/parent/dashboard");
                
                localStorage.setItem(
                  "student-id",
                res.data[0]._id
                  );
                    })
                    .catch(err => {
                      
                    }); 
              } else if (response.data.Type.teacher === true) {
                
                  
                const req = axios.create({
                  baseURL: configs.apiUrl,
                  headers: {
                    Authorization: response.headers.authorization
                  }
                });
                req
                  .get("/app/teacher/course-list")
                  .then(res => {
                    this.props.history.push("/sahand/teacher/dashboard")
              
              localStorage.setItem(
                "school-id",
              res.data[0].ID
                )
                
              localStorage.setItem(
                "course-id",
              res.data[0].courseList[0].ID
                )
                  })
                  .catch(err => {
                    
                  }); 
                }  
              } else {
                this.props.history.push(this.state.from);
              }
            }
          }.bind(this)
        )
        .catch((err) => {
          if(err.response.data.errorNumber==="019"){
            this.props.onError(" کلمه عبور اشتباه است")
          }else if(err.response.data.errorNumber==="017"){
            this.props.onError("نام کاربری اشتباه است")
          }else if(err.response.data.errorNumber==="011"){
            this.props.onError("تکرار کلمه عبور به درستی وارد نشده است.")
          }else{
            this.props.onError("خطای ارتباط با سرور");
          }
          // console.log(err.response.data)
        });
    } else {
      const server = axios.create({
        baseURL: configs.apiUrl,
        timeout: 5000,
        headers: {
          "Content-Type": "application/json",
          Authorization: this.state.accessToken
        }
      });
      server
        .post("/change-password", {
          OldPass: this.state.oldPass,
          NewPass: this.state.newPass,
          NewPassConfirm: this.state.newPassConfirm
        })
        .then(() => {
          this.setState({ 
            login: true,password: "",
            accessToken: "",
            newPass: "",
            oldPass: "",
            newPassConfirm: "" }, 
          this.props.onSuccess('تغییر کلمه‌ی عبور با موفقیت انجام شد'));
        })
        .catch((err) => {
          if(err.response.data.errorNumber==="019"){
            this.props.onError(" کلمه عبور اشتباه است")
          }else if(err.response.data.errorNumber==="017"){
            this.props.onError("نام کاربری اشتباه است")
          }else if(err.response.data.errorNumber==="011"){
            this.props.onError("تکرار کلمه عبور به درستی وارد نشده است.")
          }else{
            this.props.onError("خطای ارتباط با سرور");
          }
        });
    }
  }
  handleTextChange(name) {
    return event => {
      return this.setState({
        [name]: event.target.value
      });
    };
  }
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  
  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }
  handleShowLogin(){
    this.setState({login_hide:false})
  }
  
  render(){
    const { classes } = this.props;
      return (
        <div>
          <Dialog
            TransitionComponent={Transition}
            onClose={this.handleClose.bind(this)}
            onExited={this.handleExited.bind(this)}
            open={ !this.state.login}
          >
            <DialogTitle>
              {this.state.login ? "ورود به سیستم" : "تغییر رمز ورود"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {this.state.login
                  ? "لطفا نام کاربری و کلمه‌ی عبور خود را وارد نمایید."
                  : "لطفا کلمه‌ی عبور فعلی و کلمه‌ی عبور جدید خود را وارد نمایید"}
              </DialogContentText>
              {this.state.login ? (
                <form>
                  <TextField
                    className={classes.textFields}
                    autoFocus
                    margin="dense"
                    placeholder="نام کاربری"
                    onChange={this.handleTextChange("username").bind(this)}
                    error={this.state.username.length!==10}
                    helperText={this.state.username.length!==10 ? "تعداد کاراکترهای نام کاربری باید ۱۰ عدد باشد" : ""}
                  />
                  <br />
                  <TextField
                    className={classes.textFields}
                    margin="dense"
                    type="password"
                    placeholder="کلمه‌ی عبور"
                    onChange={this.handleTextChange("password").bind(this)}
                    error={this.state.password.length<6}
                    helperText={this.state.password.length<6 ? "تعداد کاراکترهای کلمه عبور حداقل باید ۶ عدد باشد" : ""}
                  />
                </form>
              ) : (
                <FormControl fullWidth>
                  <TextField
                    className={classes.textFields}
                    autoFocus
                    margin="dense"
                    label="کلمه‌ی عبور فعلی"
                    type="password"
                    value={this.state.oldPass}
                    onChange={this.handleTextChange("oldPass").bind(this)}
                  />
                  <TextField
                    className={classes.textFields}
                    margin="dense"
                    type="password"
                    label="کلمه‌ی عبور جدید"
                    value={this.state.newPass}
                    onChange={this.handleTextChange("newPass").bind(this)}
                  />
                  <TextField
                    className={classes.textFields}
                    margin="dense"
                    type="password"
                    label="تکرار کلمه‌ی عبور جدید"
                    value={this.state.newPassConfirm}
                    onChange={this.handleTextChange("newPassConfirm").bind(this)}
                  />
                </FormControl>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                color="primary"
                disabled={(((this.state.username.length!==10)||(this.state.password.length<6))&&(this.state.login))}
                onClick={this.handleLogin.bind(this)}
              >
                {this.state.login ? "ورود" : "ثبت"}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={this.handleClose.bind(this)}
              >
                بستن
              </Button>
            </DialogActions>
          </Dialog>
          <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Grid item xs={this.state.login_hide?12:false} sm={this.state.login_hide?12:4} md={this.state.login_hide?12: 7} className={classes.image} >
              <Grid container direction='column' justify="center" alignItems="center">
              <Grid item>
                  {this.state.login_hide?
                    <Typography 
                      style={{
                        color:'black',
                        fontSize:40,
                        margin:20,
                        marginTop:"40%",
                        padding:10,
                        backgroundColor:'#ffffff8d'
                      }}
                      align='center' >سامانه سـهـنـد</Typography>:<Grid/>
                  }
                </Grid>
                <Grid item>
                  {this.state.width>700 || this.state.login_hide?
                    <Typography 
                      style={{
                        color:'white',
                        fontSize:this.state.width>700?40:25,
                        margin:20,
                        marginTop:this.state.login_hide?20:"40%",
                        padding:10,
                        backgroundColor:'#0000008d'
                      }}
                      align='center' >{this.titleList[this.state.random]}</Typography>:<Grid/>
                  }
                </Grid>
                <Grid item >
                  {this.state.login_hide &&
                    <Button
                    style={{
                      width:"200px",
                      height:"50px"
                    }}
                    variant="contained"
                    color="secondary"
                    className={classes.submit}
                    onClick={this.handleShowLogin.bind(this)}
                  >
                    <Typography variant='title'>ورود </Typography>
                  </Button>
                  }
                </Grid>
              </Grid>
            </Grid>
            {!this.state.login_hide &&
              <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <div className={classes.paper}>
                  <Typography variant='title' style={{fontSize:25}}>
                  سـهـنـد
                  </Typography>
                  <Typography style={{margin:15}}>
                  سامانه‌ی هوشمند نظارت بر دانش‌آموز
                  </Typography>
                  <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                  </Avatar>
                  <Typography component="h1" variant="title">
                    ورود به سامانه
                  </Typography>
                  <form className={classes.form} noValidate>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  label="نام کاربری"
                  error={this.state.username.length!==10 && this.state.username!=""}
                  helperText={(this.state.username.length!==10 && this.state.username!="") ? "تعداد کاراکترهای نام کاربری باید ۱۰ عدد باشد" : ""}
                  onChange={this.handleTextChange("username")}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="کلمه‌ی عبور"
                  type="password"
                  onChange={this.handleTextChange("password")}
                  error={this.state.password.length<6 && this.state.password.length!=0}
                  helperText={(this.state.password.length<6 && this.state.password.length!=0) ? "تعداد کاراکترهای کلمه عبور حداقل باید ۶ عدد باشد" : ""}
                />
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={this.handleLogin.bind(this)}
                >
                  ورود
                </Button>
              </form>
                </div>
                <div className={classes.paper}>
                  <Typography variant='title' style={{fontSize:25}}>
                  دریافت اپلیکیشن
                  </Typography>
                  <Grid
                    container
                    direction="row"
                    alignItems="center"
                    justify="center"
                    spacing={16}
                  >
                    <Grid
                      item xs={2} style={{margin:5}}
                    >
                      <a style={{alignItems:'center'}} href="https://cafebazaar.ir/app/com.sahand/">
                        <img
                          src={bazar}
                          alt="slide2"
                          style={{ width: "100%" }}
                        />
                        {/*<Typography variant='body1'>
                          دریافت از کافه بازار
                        </Typography>*/}
                      </a>
                    </Grid>
                    <Grid
                      item xs={4} style={{margin:5}}
                    >
                      <a style={{alignItems:'center'}} href="https://anardoni.com/ios/app/6a5v7cWF">
                        <img
                          src={anardooni}
                          alt="slide2"
                          style={{ width: "100%" }}
                        />
                        {/* <Typography variant='body1' style={{fontSize:25}}>
                          دریافت از سیب اپ
                        </Typography> */}
                      </a>
                    </Grid>
                  </Grid>
                </div>
              </Grid>
            }
          </Grid>
          {/* sec 2*/}
          {this.state.width<700 &&
            <img
            src={parent_image}
            alt="slide2"
            style={{ width: "100%" }}
          />
          }
          <Grid container component="main" className={classes.root_slide}>
            <CssBaseline />
            <Grid item xs={12} sm={9} md={5} component={Paper} elevation={6} square>
              <div className={classes.paper}>
                <Typography variant='title' style={{fontSize:25, marginBottom:10}}>
                  خدمات سهند به والدین
                </Typography>
                <Grid container  alignItems="center">
                  <DoneAll/>
                  <Typography style={{margin:15}}>
                  ارائه خدمات از طریق سایت و اپلیکیشن
                  </Typography>
                </Grid>
                <Grid container  alignItems="center">
                  <DoneAll/>
                  <Typography style={{margin:15}}>
                  مشاهده برخط فعالیت‌های کلاسی
                  </Typography>
                </Grid>
                <Grid container  alignItems="center">
                  <DoneAll/>
                  <Typography style={{margin:15}}>
                ارائه تکالیف روزانه به صورت برخظ
                  </Typography>
                </Grid>
                <Grid container  alignItems="center">
                  <DoneAll/>
                  <Typography style={{margin:15}}>
                  مشاهده گالری
                  </Typography>
                </Grid>
                <Grid container  alignItems="center">
                  <DoneAll/>
                  <Typography style={{margin:15}}>
                  مشاهده تقویم اجرایی مدرسه
                  </Typography>
                </Grid>
                <Grid container  alignItems="center">
                  <DoneAll/>
                  <Typography style={{margin:15}}>
                  تبادل پیام با مدرسه و مربیان
                  </Typography>
                </Grid>
                <Grid container  alignItems="center">
                  <DoneAll/>
                  <Typography style={{margin:15}}>
                  مشاهده اخبار و فعالیت‌های مدرسه
                  </Typography>
                </Grid>
              </div>
            </Grid>
            <Grid item xs={false} sm={4} md={7} className={classes.image}  
              style={{
                backgroundImage: 
                `url(${parent_image})`}}
                />
          </Grid>
          {/* sec 3*/}
          {this.state.width<700 &&
            <img
            src={manager_image}
            alt="slide2"
            style={{ width: "100%" }}
          />
          }
          <Grid container component="main" className={classes.root_slide}>
            <CssBaseline />
            <Grid item xs={false} sm={4} md={7} className={classes.image}  
              style={{
                backgroundImage: 
                `url(${manager_image})`}}
                />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
              <div className={classes.paper}>
              <Typography variant='title' style={{fontSize:25, marginBottom:10}}>
                  خدمات سهند به مدرسه
                </Typography>
                <Grid container  alignItems="center">
                  <DoneAll/>
                  <Typography style={{margin:15}}>
                  ارائه سیستم یک پارچه مدیریتی
                  </Typography>
                </Grid>
                <Grid container  alignItems="center">
                  <DoneAll/>
                  <Typography style={{margin:15}}>
                بستر ارائه گزارش فعالیت ها به والدین
                  </Typography>
                </Grid>
                <Grid container  alignItems="center">
                  <DoneAll/>
                  <Typography style={{margin:15}}>
                  ارائه گالری فعالیت‌های فوق برنامه
                  </Typography>
                </Grid>
                <Grid container  alignItems="center">
                  <DoneAll/>
                  <Typography style={{margin:15}}>
                  اعلان آسان تقویم اجرایی مدرسه
                  </Typography>
                </Grid>
                <Grid container  alignItems="center">
                  <DoneAll/>
                  <Typography style={{margin:15}}>
                  تبادل پیام آسان با والدین
                  </Typography>
                </Grid>
                <Grid container  alignItems="center">
                  <DoneAll/>
                  <Typography style={{margin:15}}>
                  ارسال اخبار و فعالیت‌های مدرسه
                  </Typography>
                </Grid>
                <Grid container  alignItems="center">
                  <DoneAll/>
                  <Typography style={{margin:15}}>
                  رفع نیاز مراجعه به پرونده کاغذی
                  </Typography>
                </Grid>
              </div>
            </Grid>
          </Grid>
          {
            <div className={classes.paper}>
            <Typography variant='title' style={{fontSize:25}}>
            دریافت اپلیکیشن
            </Typography>
            <Grid
              container
              direction="row"
              alignItems="center"
              justify="center"
              spacing={16}
            >
              <Grid
                item style={{margin:20}}
              >
                <a style={{alignItems:'center'}} href="https://cafebazaar.ir/app/com.sahand/">
                  <img
                    src={bazar}
                    alt="slide2"
                    style={{ width: "70px" }}
                  />
                  {/*<Typography variant='body1'>
                    دریافت از کافه بازار
                  </Typography>*/}
                </a>
              </Grid>
              <Grid
                item style={{margin:20}}
              >
                <a style={{alignItems:'center'}} href="https://anardoni.com/ios/app/6a5v7cWF">
                  <img
                    src={anardooni}
                    alt="slide2"
                    style={{ width: "140px" }}
                  />
                  {/* <Typography variant='body1' style={{fontSize:25}}>
                    دریافت از سیب اپ
                  </Typography> */}
                  </a>
              </Grid>
            </Grid>
          </div>
          }
        </div>
      );
  }
}
Landing.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  history: PropTypes.object,
  location: PropTypes.object,
  match: PropTypes.object,
  onError: PropTypes.func,
  onSuccess: PropTypes.func
};
export default withStyles(useStyles)(Landing);