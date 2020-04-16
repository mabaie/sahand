import React, {Component} from 'react';
import {Link, withRouter} from "react-router-dom";
import {
    Grid,
    GridList,
    GridListTile,
    ButtonBase,
    Button,
    SvgIcon,
    Typography,

} from '@material-ui/core';
import compose from 'recompose/compose';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';

import {withStyles} from '@material-ui/core/styles';
import PropTypes from "prop-types";
import Settings from "@material-ui/icons/Settings";
// import ExitToApp from "@material-ui/icons/ExitToApp";
import PersonAdd from "@material-ui/icons/PersonAdd";
import Message from "@material-ui/icons/Message";
import Calendar from "@material-ui/icons/CalendarToday";
import Gallery from "@material-ui/icons/PhotoLibrary";
import DailyWork from "@material-ui/icons/AvTimer";
import Report from "@material-ui/icons/Assessment";
import HomeActivity from "@material-ui/icons/AccessibilityNew";
import Appointment_icon from "@material-ui/icons/Weekend";

class Logout extends React.Component {
    handleLogout() {
      localStorage.removeItem("access-token");
      this.props.history.push("/sahand/");
    }
    render() {
      return (
        <Button
          onClick={this.handleLogout.bind(this)}
          style={{ marginRight: "6px" }}
        >
          {this.props.children}
        </Button>
      );
    }
  }
  Logout.propTypes = {
    history: PropTypes.object.isRequired,
    children: PropTypes.array.isRequired
  };
  let LogoutWrapper = withRouter(Logout);


const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: "#fafafa",
        padding:"20px"
    },
    gridList: {
        width: '100%'
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)'
    },
    card: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        display: "flex",

        alignItems: "center"
    },
    buttonBase: {
        width: "100%",
        height: "100%",
        backgroundColor: '#fff',
        position:"relative",
        '&:hover': {
            
            '& $title': {
                opacity: 0,
                
              },
              '& $icon':{
                fontSize:70,
                marginBottom:0
            }
        }
    },
    title:{
        position:"absolute",
        width:"100%",
        bottom:0,
        backgroundColor:"#3f51b5",
        
        marginBottom:0,
        color:'#fff',
        padding:"10px 0"
        
    },
    icon:{
        fontSize:50,
        marginBottom:"50px"

    }
})

class LargeMenu extends Component {

    constructor(props) {
        super(props);

        this.state = {}
        this.getGridListCols=this.getGridListCols.bind(this);
    }

    getGridListCols (){
        if (isWidthUp('xl', this.props.width)) {
          return 6;
        }
    
        if (isWidthUp('lg', this.props.width)) {
          return 5;
        }
    
        if (isWidthUp('md', this.props.width)) {
          return 3;
        }
    
        if (isWidthUp('sm', this.props.width)) {
           return 2;
        }
        return 1;
      }
    render() {
        const {classes} = this.props;
        return (
            <Grid container="container" className={classes.root} spacing={16}>
            <Grid textalign="center" item="item" xs={12}>
          
            <Typography style={{fontFamily: "IRANSans"}} align="center" variant="h6"  >
    
      سامانه‌ی هوشمند نظارت بر دانش‌آموز (سهند)
      
      </Typography>
            </Grid>
                <Grid item="item" xs={12}>
                    <GridList spacing={16} cols={this.getGridListCols()} className={classes.gridList}>

                        <GridListTile >
                            <ButtonBase
                                title="ثبت نام"
                                className={classes.buttonBase}
                                component={Link}
                                to="/sahand/manager/dashboard/student-register">

                                <span ><PersonAdd className={classes.icon} /></span>


<Typography className={classes.title} align="center" variant="title"  >
ثبت نام
</Typography>

                            </ButtonBase>

                        </GridListTile>

                        <GridListTile >
                            <ButtonBase
                                title="لیست معلمان"
                                className={classes.buttonBase}
                                component={Link}
                                to="/sahand/manager/dashboard/teacher-register">

                                <SvgIcon
                                    className={classes.icon}
                                    viewBox="0 0 35 30">
                                    <g>
                                        <g>
                                            <rect x="23.695" y="15.25" width="3.052" height="1.878"/>
                                            <polygon
                                                points="2.931,0.463 2.931,3.416 4.22,3.018 4.22,1.753 30.021,1.753 30.021,18.201 9.49,18.201 9.423,19.49
			31.312,19.49 31.312,0.463 		"/>
                                            <circle cx="4.983" cy="7.526" r="3.821"/>
                                            <polygon
                                                points="8.227,29.105 8.227,22.302 8.227,21.661 8.227,20.791 8.47,20.791 8.825,13.886 15.415,10.471 14.861,9.403
			15.022,9.683 22.083,5.641 21.764,5.081 14.713,9.117 14.549,8.8 8.524,11.922 6.374,11.922 4.917,13.611 3.507,11.922
			0.411,12.497 0.213,19.365 1.526,19.365 1.597,20.791 1.796,20.791 1.796,21.661 1.796,22.302 1.796,29.105 1.533,29.105
			0,29.438 0,30.85 1.305,30.85 2.829,30.602 2.843,30.85 4.531,30.85 4.531,29.275 4.531,29.105 4.531,22.302 5.492,22.302
			5.492,29.105 5.492,29.275 5.492,30.85 7.18,30.85 7.194,30.602 8.718,30.85 10.023,30.85 10.023,29.438 8.489,29.105 		"/>
                                        </g>
                                    </g>
                                    <g/>
                                    <g/>
                                    <g/>
                                    <g/>
                                    <g/>
                                    <g/>
                                    <g/>
                                    <g/>
                                    <g/>
                                    <g/>
                                    <g/>
                                    <g/>
                                    <g/>
                                    <g/>
                                    <g/>
                                </SvgIcon>
                                <Typography className={classes.title} align="center" variant="title"  >
لیست معلمان
</Typography>

                            </ButtonBase>
                        </GridListTile>
                        <GridListTile >
                            <ButtonBase
                                className={classes.buttonBase}
                                title="لیست کلاس‌ها"
                                component={Link}
                                to="/sahand/manager/dashboard/class-register">
                                
                                <SvgIcon
                                    viewBox="0 0 50 50"
                                    className={classes.icon}>
                                    <path
                                        d="M 6 5 C 3.800781 5 2 6.800781 2 9 L 2 41 C 2 43.199219 3.800781 45 6 45 L 44 45 C 46.199219 45 48 43.199219 48 41 L 48 9 C 48 6.800781 46.199219 5 44 5 Z M 6 7 L 44 7 C 45.117188 7 46 7.882813 46 9 L 46 41 C 46 42.117188 45.117188 43 44 43 L 6 43 C 4.882813 43 4 42.117188 4 41 L 4 9 C 4 7.882813 4.882813 7 6 7 Z M 6.8125 9 C 6.335938 9.089844 5.992188 9.511719 6 10 L 6 40 C 6 40.550781 6.449219 41 7 41 L 43 41 C 43.03125 41 43.0625 41 43.09375 41 C 43.609375 40.953125 44.003906 40.519531 44 40 L 44 10 C 44 9.449219 43.550781 9 43 9 L 7 9 C 6.96875 9 6.9375 9 6.90625 9 C 6.875 9 6.84375 9 6.8125 9 Z M 8 11 L 42 11 L 42 39 L 38 39 L 38 37 L 29 37 L 29 39 L 8 39 Z M 25 17 C 22.800781 17 21 18.800781 21 21 C 21 23.199219 22.800781 25 25 25 C 27.199219 25 29 23.199219 29 21 C 29 18.800781 27.199219 17 25 17 Z M 25 19 C 26.117188 19 27 19.882813 27 21 C 27 22.117188 26.117188 23 25 23 C 23.882813 23 23 22.117188 23 21 C 23 19.882813 23.882813 19 25 19 Z M 17 21 C 15.355469 21 14 22.355469 14 24 C 14 25.644531 15.355469 27 17 27 C 18.644531 27 20 25.644531 20 24 C 20 22.355469 18.644531 21 17 21 Z M 33 21 C 31.355469 21 30 22.355469 30 24 C 30 25.644531 31.355469 27 33 27 C 34.644531 27 36 25.644531 36 24 C 36 22.355469 34.644531 21 33 21 Z M 17 23 C 17.5625 23 18 23.4375 18 24 C 18 24.5625 17.5625 25 17 25 C 16.4375 25 16 24.5625 16 24 C 16 23.4375 16.4375 23 17 23 Z M 33 23 C 33.5625 23 34 23.4375 34 24 C 34 24.5625 33.5625 25 33 25 C 32.4375 25 32 24.5625 32 24 C 32 23.4375 32.4375 23 33 23 Z M 25 26 C 22.273438 26 20.082031 27.261719 19.03125 28 C 18.429688 27.800781 17.746094 27.65625 17 27.65625 C 14.292969 27.65625 12.34375 29.4375 12.34375 29.4375 L 12 29.75 L 12 33 L 38 33 L 38 29.75 L 37.65625 29.4375 C 37.65625 29.4375 35.707031 27.65625 33 27.65625 C 32.253906 27.65625 31.570313 27.800781 30.96875 28 C 29.917969 27.261719 27.726563 26 25 26 Z M 25 28 C 27.613281 28 29.550781 29.457031 30 29.8125 L 30 31 L 20 31 L 20 29.8125 C 20.449219 29.457031 22.386719 28 25 28 Z M 17 29.65625 C 17.347656 29.65625 17.675781 29.730469 18 29.8125 L 18 31 L 14 31 L 14 30.71875 C 14.40625 30.417969 15.507813 29.65625 17 29.65625 Z M 33 29.65625 C 34.492188 29.65625 35.59375 30.417969 36 30.71875 L 36 31 L 32 31 L 32 29.8125 C 32.324219 29.730469 32.652344 29.65625 33 29.65625 Z "/>
                                </SvgIcon>
                                <Typography className={classes.title} align="center" variant="title"  >
لیست کلاس‌ها
</Typography>
                            </ButtonBase>
                        </GridListTile>
                        <GridListTile >
                            <ButtonBase
                                title="لیست دروس"
                                className={classes.buttonBase}
                                component={Link}
                                to="/sahand/manager/dashboard/course-register">

                                <SvgIcon
                                    className={classes.icon}
                                    viewBox="0 0 500 500">
                                    <path
                                        d="M196.73 35.23c-8.132.878-16.3 1.936-24.515 3.172C192.968 50.21 212.045 66.795 224 96c-24.896-22.512-44.232-39.5-75.795-53.512-8.808 1.676-17.69 3.562-26.656 5.64 22.69 10.745 49.026 26.094 75.114 51.306-57.456-25.454-81.792-31.066-120.23-39.4C64.33 63.598 52.03 67.5 39.5 71.743c54.813 3.532 103.127 19.644 187.346 47.717l2.015.673 1.503 1.504c5.794 5.793 15.356 9.254 25.203 9.353-2.725-39.43-18.787-67.802-58.836-95.76zm118.54 0c-40.05 27.958-56.11 56.33-58.836 95.76 9.847-.1 19.41-3.56 25.203-9.353l1.502-1.504 2.014-.672C369.374 91.39 417.687 75.277 472.5 71.745c-12.53-4.243-24.83-8.145-36.934-11.71-38.438 8.334-62.774 13.946-120.23 39.4 26.088-25.212 52.424-40.56 75.115-51.307-8.964-2.077-17.847-3.963-26.655-5.64-31.563 14.014-50.9 31-75.795 53.513 11.954-29.205 31.032-45.79 51.785-57.598-8.216-1.236-16.383-2.294-24.515-3.172zM25 89.287v301.758c44.68.19 106.01 16.813 190 44.498v-301.04C128.034 105.534 81.67 90.71 25 89.288zm462 0c-56.67 1.423-103.034 16.246-190 45.217v301.05c84.317-27.698 143.413-42.5 190-44.2V89.287zm-254 55.195v200.325c15.47 3.1 30.71 3.292 46 .097V144.482c-7.227 3.058-15.14 4.518-23 4.518-7.86 0-15.773-1.46-23-4.518zm0 218.627v13.933c15.296 3.488 30.512 3.284 46-.1V363.22c-15.37 2.728-30.764 2.543-46-.11zm46 32.185c-15.226 2.856-30.633 3.058-46 .125v48.838c3.222 3.24 5.775 5.876 8.365 7.56 3.283 2.136 6.77 3.49 14.274 3.19l.18-.008h.18c11.61 0 15.954-4.04 23-10.836v-48.87z"
                                        fill="#000000"/>
                                </SvgIcon>
                                <Typography className={classes.title} align="center" variant="title"  >
لیست دروس
</Typography>
                            </ButtonBase>
                        </GridListTile>
                        <GridListTile >
                            <ButtonBase
                                className={classes.buttonBase}
                                title="فعالیت‌های کلاسی"
                                component={Link}
                                to="/sahand/manager/dashboard/class-work">

                                <DailyWork className={classes.icon}/>
                                <Typography className={classes.title} align="center" variant="title"  >
فعالیت‌های کلاسی
</Typography>
                            </ButtonBase>
                        </GridListTile>

                        <GridListTile >
                            <ButtonBase
                                className={classes.buttonBase}
                                title="اخبار مدرسه"
                                component={Link}
                                to="/sahand/manager/dashboard/news">

                                <SvgIcon className={classes.icon} viewBox="0 0 1000 1000">
                                    <path d="M312.8,825.3c-12.3,0-22.5-10.2-22.5-22.5s10.2-22.5,22.5-22.5h534c12.3,0,22.5,10.2,22.5,22.5s-10.2,22.5-22.5,22.5H312.8L312.8,825.3z M312.8,166.5L312.8,166.5c-12.3,0-22.5,10.2-22.5,22.5l0,0v159.6c0,12.3,10.2,22.5,22.5,22.5l0,0h534l0,0c12.3,0,22.5-10.2,22.5-22.5V191.1l0,0c0-12.3-10.2-22.5-22.5-22.5h-534V166.5z M335.3,326.1L335.3,326.1V211.5h489v114.6H335.3L335.3,326.1z M167.5,320L167.5,320H85.7v527.8c0,53.2,81.8,53.2,81.8,0V320L167.5,320z M126.6,962.4L126.6,962.4c-30.7,0-61.4-12.3-81.8-34.8l0,0C24.3,907.1,10,876.5,10,845.8V283.1l0,0c0-20.5,16.4-36.8,36.8-36.8h120.7V74.4c0-20.5,16.4-36.8,38.9-36.8l0,0h746.8c20.5,0,36.8,18.4,36.8,36.8l0,0v771.3c0,32.7-12.3,61.4-34.8,81.8l0,0l0,0c-20.5,20.5-51.1,32.7-81.8,32.7H126.6V962.4L126.6,962.4L126.6,962.4z M916.3,845.8L916.3,845.8V113.3H243.2c0,245.5,0,489,0,734.5c0,14.3-2,28.6-8.2,40.9h638.3c10.2,0,22.5-4.1,28.6-12.3l0,0C912.3,868.3,916.3,858,916.3,845.8L916.3,845.8z M605.4,416.1L605.4,416.1L605.4,416.1h241.4c12.3,0,22.5,10.2,22.5,22.5l0,0v122.8c0,12.3-10.2,22.5-22.5,22.5l0,0H605.4c-12.3,0-22.5-10.2-22.5-22.5v-2V438.6C582.9,426.3,593.1,416.1,605.4,416.1L605.4,416.1z M824.3,463.2L824.3,463.2H627.9v75.7h196.4V463.2L824.3,463.2z M312.8,463.2L312.8,463.2c-12.3,0-22.5-10.2-22.5-22.5c0-12.3,10.2-22.5,22.5-22.5h221c12.3,0,22.5,10.2,22.5,22.5c0,12.3-10.2,22.5-22.5,22.5H312.8L312.8,463.2z M312.8,583.9L312.8,583.9c-12.3,0-22.5-10.2-22.5-22.5s10.2-22.5,22.5-22.5h221c12.3,0,22.5,10.2,22.5,22.5s-10.2,22.5-22.5,22.5H312.8L312.8,583.9z M312.8,704.6L312.8,704.6c-12.3,0-22.5-10.2-22.5-22.5c0-12.3,10.2-22.5,22.5-22.5h534c12.3,0,22.5,10.2,22.5,22.5c0,12.3-10.2,22.5-22.5,22.5H312.8L312.8,704.6z" />
                                </SvgIcon>
                                <Typography className={classes.title} align="center" variant="title"  >
اخبار مدرسه
</Typography>
                            </ButtonBase>
                        </GridListTile>
                        <GridListTile >
                            <ButtonBase
                                className={classes.buttonBase}
                                title="گزارش‌ها"
                                component={Link}
                                to="/sahand/manager/dashboard/report">

                                <Report
                                    className={classes.icon}/>
<Typography className={classes.title} align="center" variant="title"  >
گزارش‌ها
</Typography>
                            </ButtonBase>
                        </GridListTile>
                        <GridListTile >
                            <ButtonBase
                                className={classes.buttonBase}
                                title="تقویم اجرایی"
                                component={Link}
                                to="/sahand/manager/dashboard/calendar">

                                <Calendar
                                   className={classes.icon}/>
                                   <Typography className={classes.title} align="center" variant="title"  >
تقویم اجرایی
</Typography>

                            </ButtonBase>
                        </GridListTile>
                        <GridListTile >
                            <ButtonBase
                                className={classes.buttonBase}
                                title="گالری"
                                component={Link}
                                to="/sahand/manager/dashboard/gallery">

                                <Gallery
                                    className={classes.icon}/>
                                    <Typography className={classes.title} align="center" variant="title"  >
گالری
</Typography>

                            </ButtonBase>
                        </GridListTile>
                        <GridListTile >
                            <ButtonBase
                                className={classes.buttonBase}
                                title="تشویق‌ها"
                                component={Link}
                                to="/sahand/manager/dashboard/encourage">
                                <SvgIcon
                                    className={classes.icon}
                                    viewBox="0 0 1000 1000">
                                    <path
                                        d="M324.362664 260.38144c2.5383 4.164383 4.855091 9.138283 6.839616 15.090854 4.657746 12.519327 6.837603 25.523963 6.871836 40.81921 0.013089 7.223231-1.260592 18.493042-3.875413 37.008235l17.561694-17.238492c0.050343-0.091624 0.075515-0.193318 0.125858-0.284942L535.678922 151.984645c17.88087-17.879863 13.942024-51.355018-3.936832-69.234881-17.878856-17.878856-46.362994-21.136056-60.809456-11.876949L313.072715 228.73374c4.439256 21.064569 8.297553 26.174396 11.392648 31.588295L324.362664 260.38144zM831.78508 516.389301 687.738307 660.436074c-7.055085 6.705704-15.243897 14.478682-25.319569 4.403009-7.474947-7.474947-7.296732-16.913275-1.006862-24.08717l204.626665-204.626665c17.878856-17.878856 16.221561-57.84324-1.657296-75.722096-17.88087-17.878856-53.168377-14.863303-71.049247 3.015553L593.460743 563.290966c-10.632467 11.676584-21.658618 10.600248-30.863354 1.397525-7.731697-7.73371-5.969687-16.583024-0.196338-24.304652l232.724167-232.724167c17.878856-17.878856 15.199595-50.723715-4.801727-70.621331-17.927185-17.83254-48.368664-21.623377-66.24752-3.744521l-236.652945 236.652945c-4.694999 4.81683-13.371133 11.833654-24.314721-0.104714-7.970323-8.695264-2.652076-18.570571 4.294268-25.884419l188.714211-188.712197c17.878856-17.88087 12.243447-50.774058-5.637423-68.652915-17.878856-17.878856-48.772416-22.352346-66.651272-4.47349L320.571827 445.375294c-2.312763 2.312763-4.296282 4.822871-6.009962 7.45783-8.326752 3.752576-18.43263 2.273495-25.272247-4.566121-2.463792-2.463792-4.166397-5.374632-5.255822-8.456638-0.200366-14.272275 14.830077-98.431878 14.79685-115.261583-0.023158-12.602897-1.991574-20.919581-4.655732-27.864918-0.545719-1.700591-1.255557-3.303516-1.987546-4.912482-1.043109-2.407408-1.776105-3.890516-1.776105-3.890516s-0.017117 0.087597-0.017117 0.093638c-7.445748-13.0288-23.43573-22.599027-39.533446-23.494128-25.247075-1.400546-46.851322 17.927185-48.253882 43.174261l-12.82642 108.788465c-0.002014 0.012082-6.410693 56.024846-20.975965 91.852032-14.566279 35.829199-33.868838 77.477057-53.675836 128.493769-34.638081 89.2211-15.978907 215.286317 37.322376 273.402416 45.86359 68.610626 124.015245 113.807674 212.738955 113.807674 78.998426 0 149.610695-35.837254 196.521422-92.122878l342.782286-342.782286c17.88087-17.88087 16.570942-58.694038-1.309928-76.574908C885.302838 494.641073 849.665949 498.508431 831.78508 516.389301zM113.985808 512.595443c6.693621-15.533874 12.928114-30.010541 18.472905-43.628356 9.963911-24.527169 16.359501-65.131917 18.189977-80.316409l12.868709-109.111667c1.676426-23.317927 12.792187-43.779385 29.307752-58.029509 0.915238-7.397418 1.494184-13.296625 1.487136-16.584031-0.023158-12.60189-1.990567-20.918574-4.656739-27.863911-0.543706-1.700591-1.253544-3.305529-1.985533-4.914496-1.045123-2.405394-1.776105-3.888503-1.776105-3.888503s-0.018124 0.085583-0.018124 0.091624c-7.444741-13.026786-23.436737-22.599027-39.532439-23.493121-25.247075-1.401552-46.851322 17.926179-48.253882 43.173254L85.26103 296.820798c-0.003021 0.012082-6.4117 56.023839-20.975965 91.853039-13.016717 32.013191-29.817224 68.728429-47.377911 112.569233-7.786067 20.807819-43.679706 135.469312 47.468529 280.27828 0.009062 0.015103 0.015103 0.028192 0.025172 0.042288-11.287935-60.936321-7.430645-127.950063 14.140376-183.523835C90.957857 566.087023 103.186201 537.668331 113.985808 512.595443zM828.722204 200.826534c4.663787 4.663787 10.772421 6.99568 16.882062 6.99568s12.218276-2.331893 16.882062-6.99568l67.077175-67.06912c9.327574-9.319519 9.327574-24.436551 0-33.764125-9.326567-9.327574-24.436551-9.327574-33.764125 0l-67.077175 67.06912C819.395637 176.381928 819.395637 191.498961 828.722204 200.826534zM1004.079378 206.671371c-6.49829-11.480245-21.055507-15.529846-32.535752-9.016453l-82.544595 46.72043c-11.480245 6.490235-15.513736 21.063562-9.016453 32.535752 4.391934 7.764923 12.475025 12.125644 20.799764 12.125644 3.97912 0 8.021673-1.002835 11.736995-3.109191l82.544595-46.72043C1006.54317 232.716888 1010.577668 218.143561 1004.079378 206.671371zM746.729369 143.658899c3.715322 2.106356 7.748813 3.109191 11.736995 3.109191 8.324739 0 16.40783-4.360721 20.799764-12.125644l46.72043-82.544595c6.49829-11.47219 2.463792-26.045517-9.016453-32.535752-11.480245-6.505338-26.038469-2.463792-32.535752 9.016453L737.713923 111.123147C731.215633 122.595337 735.250131 137.168664 746.729369 143.658899z"/>
                                </SvgIcon>
                                <Typography className={classes.title} align="center" variant="title"  >
تشویق‌ها
</Typography>
                            </ButtonBase>
                        </GridListTile>
                        <GridListTile >
                            <ButtonBase
                                className={classes.buttonBase}
                                title="قرار ملاقات"
                                component={Link}
                                to="/sahand/manager/dashboard/appointment">
                                <Appointment_icon className={classes.icon}/>
                                <Typography className={classes.title} align="center" variant="title"  >
قرار ملاقات
</Typography>
                            </ButtonBase>
                        </GridListTile>
                        <GridListTile >
                            <ButtonBase
                                className={classes.buttonBase}
                                title="فعالیت در خانه"
                                component={Link}
                                to="/sahand/manager/dashboard/home-activity">

                                <HomeActivity
                                    className={classes.icon}/>
<Typography className={classes.title} align="center" variant="title"  >
فعالیت در خانه
</Typography>
                            </ButtonBase>
                        </GridListTile>
                        <GridListTile >
                            <ButtonBase
                                className={classes.buttonBase}
                                title="انتشارات"
                                component={Link}
                                to="/sahand/manager/dashboard/magazine">

                                <SvgIcon className={classes.icon} viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </SvgIcon>
<Typography className={classes.title} align="center" variant="title"  >
انتشارات
</Typography>
                            </ButtonBase>
                        </GridListTile>
                        <GridListTile >
                            <ButtonBase
                                className={classes.buttonBase}
                                title="پیام‌ها"
                                component={Link}
                                to="/sahand/manager/dashboard/messages">

                                <Message
                                    className={classes.icon}/>
<Typography className={classes.title} align="center" variant="title"  >
پیام‌ها
</Typography>
                            </ButtonBase>
                        </GridListTile>
                        <GridListTile >
                            <ButtonBase
                                title="ارزشیابی"
                                className={classes.buttonBase}
                                component={Link}
                                to="/sahand/manager/dashboard/evaluation">

                                <span >
                                <SvgIcon className={classes.icon} xmlns="http://www.w3.org/2000/svg" viewBox="-26 0 512 512">

<path d="m306.046875 53.191406h-44.53125c-1.121094-29.519531-25.476563-53.191406-55.265625-53.191406h-61.457031c-29.789063 0-54.140625 23.671875-55.265625 53.191406h-44.527344c-24.8125 0-45 20.1875-45 45v368.808594c0 24.8125 20.1875 45 45 45h261.046875c24.8125 0 45-20.1875 45-45v-368.808594c0-24.8125-20.1875-45-45-45zm15 413.808594c0 8.269531-6.730469 15-15 15h-261.046875c-8.269531 0-15-6.730469-15-15v-368.808594c0-8.269531 6.730469-15 15-15h44.476562v5.085938c0 8.285156 6.714844 15 15 15h142.09375c8.285157 0 15-6.714844 15-15v-5.085938h44.476563c8.269531 0 15 6.730469 15 15zm-176.253906-437h61.457031c13.960938 0 25.320312 11.359375 25.320312 25.316406v17.960938h-112.09375v-17.960938c0-13.957031 11.355469-25.316406 25.316407-25.316406zm0 0"/><path d="m139.105469 142.023438h-52.136719c-8.285156 0-15 6.714843-15 15v52.132812c0 8.285156 6.714844 15 15 15h52.136719c8.285156 0 15-6.714844 15-15v-52.132812c0-8.285157-6.714844-15-15-15zm-15 52.136718h-22.136719v-22.136718h22.136719zm0 0"/><path d="m264.074219 146.347656h-82.800781c-8.285157 0-15 6.714844-15 15 0 8.28125 6.714843 15 15 15h82.800781c8.285156 0 15-6.71875 15-15 0-8.285156-6.714844-15-15-15zm0 0"/><path d="m264.074219 189.835938h-82.800781c-8.285157 0-15 6.714843-15 15 0 8.285156 6.714843 15 15 15h82.800781c8.285156 0 15-6.714844 15-15 0-8.285157-6.714844-15-15-15zm0 0"/><path d="m139.105469 245.984375h-52.136719c-8.285156 0-15 6.714844-15 15v52.136719c0 8.28125 6.714844 15 15 15h52.136719c8.285156 0 15-6.71875 15-15v-52.136719c0-8.285156-6.714844-15-15-15zm-15 52.136719h-22.136719v-22.136719h22.136719zm0 0"/><path d="m264.074219 250.308594h-82.800781c-8.285157 0-15 6.714844-15 15s6.714843 15 15 15h82.800781c8.285156 0 15-6.714844 15-15s-6.714844-15-15-15zm0 0"/><path d="m264.074219 293.796875h-82.800781c-8.285157 0-15 6.71875-15 15 0 8.285156 6.714843 15 15 15h82.800781c8.285156 0 15-6.714844 15-15 0-8.28125-6.714844-15-15-15zm0 0"/><path d="m139.105469 349.945312h-52.136719c-8.285156 0-15 6.71875-15 15v52.136719c0 8.285157 6.714844 15 15 15h52.136719c8.285156 0 15-6.714843 15-15v-52.136719c0-8.28125-6.714844-15-15-15zm-15 52.136719h-22.136719v-22.136719h22.136719zm0 0"/><path d="m264.074219 354.269531h-82.800781c-8.285157 0-15 6.714844-15 15 0 8.285157 6.714843 15 15 15h82.800781c8.285156 0 15-6.714843 15-15 0-8.285156-6.714844-15-15-15zm0 0"/><path d="m264.074219 397.761719h-82.800781c-8.285157 0-15 6.714843-15 15 0 8.28125 6.714843 15 15 15h82.800781c8.285156 0 15-6.71875 15-15 0-8.285157-6.714844-15-15-15zm0 0"/><path d="m416.023438 93.273438c-24.738282 0-44.867188 20.128906-44.867188 44.867187v305.402344c0 2.5625.65625 5.078125 1.90625 7.316406l29.867188 53.457031c2.648437 4.742188 7.660156 7.683594 13.09375 7.683594 5.4375 0 10.445312-2.9375 13.09375-7.683594l29.871093-53.457031c1.246094-2.238281 1.902344-4.753906 1.902344-7.316406v-305.402344c0-24.738281-20.125-44.867187-44.867187-44.867187zm0 30c8.199218 0 14.867187 6.667968 14.867187 14.867187v11.304687h-29.734375v-11.304687c0-8.199219 6.667969-14.867187 14.867188-14.867187zm14.867187 56.171874v219.09375h-29.734375v-219.09375zm-29.734375 249.09375h29.734375v11.097657l-14.867187 26.609375-14.867188-26.609375zm0 0"/>
</SvgIcon></span>


<Typography className={classes.title} align="center" variant="title"  >
ارزشیابی
</Typography>

                            </ButtonBase>

                        </GridListTile>
                        <GridListTile >
                            <ButtonBase
                                className={classes.buttonBase}
                                title="تنظیمات"
                                component={Link}
                                to="/sahand/manager/dashboard/settings">

                                <Settings
                                   className={classes.icon}/>
<Typography className={classes.title} align="center" variant="title"  >
تنظیمات
</Typography>
                            </ButtonBase>
                        </GridListTile>
                    </GridList>
                </Grid>
            </Grid>
        );
    }
}

LargeMenu.propTypes = {
    classes: PropTypes.object.isRequired
};
export default compose(withStyles(styles),withWidth())(LargeMenu);