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
        marginBottom:"50px",
    }
})

class LargeMenu extends Component {

    constructor(props) {
        super(props);

        this.state = {}

    }

   
    render() {
        const {classes} = this.props;
        return (
            <Grid container="container" className={classes.root} spacing={16}>
            <Grid textalign="center" item="item" xs={12}>
            </Grid>
                <Grid item="item" xs={12}>
                    <GridList spacing={16} cols={5} className={classes.gridList}>

                        <GridListTile >
                            <ButtonBase
                                title="دانش‌آموزان"
                                className={classes.buttonBase}
                                component={Link}
                                to="/sahand/manager/dashboard/report/students">

                                <span ><PersonAdd className={classes.icon} /></span>


<Typography className={classes.title} align="center" variant="title"  >
دانش‌آموزان
</Typography>

                            </ButtonBase>

                        </GridListTile>
                        <GridListTile >
                            <ButtonBase
                                className={classes.buttonBase}
                                title="گزارش عملکرد مدرسه"
                                component={Link}
                                to="/sahand/manager/dashboard/report/school">

                                <Report
                                    className={classes.icon}/>
<Typography className={classes.title} align="center" variant="title"  >
گزارش عملکرد مدرسه
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
export default withStyles(styles)(LargeMenu);