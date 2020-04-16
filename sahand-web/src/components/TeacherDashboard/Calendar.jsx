import React, {Component} from 'react';
//import momentj from 'moment-jalaali';
var momentj = require('jalali-moment');

import moment from 'moment'
import Calender from '../common/Calender';
import {
    Grid,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Collapse,
    Table,
    TableBody,
    TableHead,
    TableCell,
    TableRow,
    Typography,
    Switch,
    Dialog,CircularProgress
} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from "prop-types";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import persian from 'persian'
import configs from "../../configs";
import axios from "axios";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
const styles = theme => ({
    root: {
        flexGrow: 1,
        padding:32
    },
    container: {
        textAlign: 'left'
    },

    addAppointmentButton: {
        margin: '2em auto ',
        display: 'block',
        fontSize: '1.2rem'
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120
    },
    textField: {
        marginTop: '15px'
    },
    list: {
        textAlign: 'left'
    },
    paper: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto'
    },
    table: {
        // minWidth: 700
    },
    dateText:{
        margin:'10px'
    },
    collapse:{
        padding:20
    },
    tablecell:{
        padding:5,
        textAlign:"center" 
    }
});

//const monthName=['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];

class SettingAppointments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dates: [
                {
                    year: 1397,
                    month: 8,
                    day: 1
                }
            ],
            currentData: [],
            currentDay: "",
            currentDaySt: "",
            data: [],
            open: false,
            start: "07:30",
            end: "08:30",
            timeSlot: 5,
            openList: [],
            teacherId: "",
            waiting:false,
            teachers:[],
            selectedTeacherId:""
        }
        this.clickDate = this
            .clickDate
            .bind(this)
        this.changeDate = this
            .changeDate
            .bind(this)
        this.findHighlightedDays = this
            .findHighlightedDays
            .bind(this)
        
        this.handleClose = this
            .handleClose
            .bind(this)
        this.handleClickOpenList = this
            .handleClickOpenList
            .bind(this)
            
    }
    handleClickOpenList(j) {
        var s = this
            .state
            .openList[j]
        var arr = this.state.openList
        arr[j] = !s
        this.setState({openList: arr})
    }
    handleClose() {
        this.setState({open: false})
    }
    clickDate(y, m, d) {

        this.setState({
            currentDay: y + "/" + (
                m + 1
            ) + "/" + d,
            currentDaySt: momentj(y + "/" + (
                m + 1
            ) + "/" + d, 'jYYYY/jM/jD').format('jYYYY/jM/jD')
        })

        var arr = []
        
        this.state.data
        .forEach((el) => {
          
                  if (momentj(el.date).jYear() === y && momentj(el.date).jMonth() === m && momentj(el.date).jDate() === d) {
                      
                     
                          arr=el.events
                      
                    
                  }

             
          
      })

        
        this.setState({currentData: arr})

    }

    changeDate(y, m) {
        // //////////////////////////recive month data 

        var date =momentj(y + "/" + (m+1) + "/" + 1 , 'jYYYY/jM/jD').format('YYYY-M-D HH:mm:ss')
        
        const req = axios.create({baseURL: configs.apiUrl
            ,headers: {"Content-Type": "application/json" ,Authorization: localStorage.getItem("access-token")   }});    
        this.setState({ waiting: true }, () => {
        req.get(`/app/teacher/school/events/${localStorage.getItem("school-id")}/${(new Date(date)).valueOf()}`)
        .then(res => { 
console.log('change',res.data)
        this.findHighlightedDays(res.data)
       
        this.setState(
        {waiting:false, data: res.data}
        )

        })       
        .catch(err => {console.log(err.response);});   
        });


    }

    findHighlightedDays(data) {
        var arr = []
        data.forEach((el) => {
            if(el.events.length>0)
            arr.push({
                year: momentj(el.date).jYear(),
                month: momentj(el.date).jMonth(),
                day: momentj(el.date).jDate()
            })

        })

        this.setState({dates: arr})
        
    }
    
    
    componentDidMount() {
        var today = momentj()
        var y = today.jYear()
        var m = today.jMonth()
        var d = today.jDate()


        const req = axios.create({baseURL: configs.apiUrl
                                ,headers: {"Content-Type": "application/json" ,Authorization: localStorage.getItem("access-token")   }});    
        this.setState({ waiting: true }, () => {
        req.get(`/app/teacher/school/events/${localStorage.getItem("school-id")}/${(new Date()).valueOf()}`)
        .then(res => { 
          console.log('dataaa',res.data)
        this.findHighlightedDays(res.data)
        var arr = []
        res.data.forEach((el) => {
            arr = []
            
            
                    if (momentj(el.date).jYear() === y && momentj(el.date).jMonth() === m && momentj(el.date).jDate() === d) {
                        
                        
                            arr=el.events
                        
                      
                    }

               
            
        })
        
        this.setState(
            {waiting:false, currentData: arr, currentDay: today.format('jYYYY/jM/jD'), currentDaySt: today.format('jYYYY/jM/jD'), data:res.data}
        )
 
        })       
        .catch(err => {console.log('err',err.response);});   
        });

        
        
           
    }


    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>

                <Paper>
                <Dialog open={this.state.waiting}>
            <div style={{padding:20, overflowX:'hidden', overflowY:'hidden'}}>
              <Typography variant='body1' align='center'>منتظر بمانید</Typography> 
              <CircularProgress style={{marginTop:20, marginBottom:20, marginLeft:30, marginRight:30}}/>
            </div>
          </Dialog>
                    <Grid className={classes.container} container direction='row-reverse' justify='center' xs={12}>
                        <Grid item="item" style={{minWidth:'350px'}} xs={4}>
                            <Calender
                                item={this.state.dates}
                                clickDate={this.clickDate}
                                changeDate={this.changeDate}/>
                        </Grid>
                        <Grid item="item" xs={8}>
                            
                            <Grid item="item" xs={12}>
                            <Typography className={classes.dateText} fontWeight="fontWeightMedium" variant="body1" align="center">
                            {persian.toPersian(this.state.currentDaySt)}
                            </Typography>
                           
                            </Grid> 
                            <Grid item="item" xs={12}>
                                <List
                                    component="nav"
                                    >
                                    {
                                        this
                                            .state
                                            .currentData
                                            .map(
                                                (event, j) => <div key={j}>
                                                    <ListItem >
                                                    <ListItemIcon>
                          <ChevronLeft />
                        </ListItemIcon>
                                                        <ListItemText
                                                            inset="inset"
                                                            className={classes.list}
                                                            primary={event}/>

                                                    </ListItem>


                                                </div>
                                            )
                                    }
                                </List>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>

            </div>
        )
    }
}
SettingAppointments.propTypes = {
    classes: PropTypes.object.isRequired
};
export default withStyles(styles)(SettingAppointments);