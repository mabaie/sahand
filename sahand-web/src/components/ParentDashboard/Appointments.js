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

const styles = theme => ({
    root: {
        flexGrow: 1,
        paddingTop:32
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
            
            this.handleChangeReserve = this
            .handleChangeReserve
            .bind(this);
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
console.log(this.state.data)
        this.setState({
            currentDay: y + "/" + (
                m + 1
            ) + "/" + d,
            currentDaySt: momentj(y + "/" + (
                m + 1
            ) + "/" + d, 'jYYYY/jM/jD').format('jYYYY/jM/jD')
        })

        var arr = []
        var arrt = []
        this.state.data
            .forEach((teacher) => {
                arr = []
                teacher
                    .appointments
                    .forEach((date) => {
                        console.log('point1: ',momentj(date).jMonth())
                        if (momentj(date.start).jYear() === y && momentj(date.start).jMonth() === m && momentj(date.start).jDate() === d) {

                            if(date.hasOwnProperty('pid')){
                                console.log('1',date.pid)
                                arr.push({
                                    start: new Date(date.start).getHours() + ":" + new Date(date.start).getMinutes(),
                                    end: new Date(date.end).getHours() + ":" + new Date(date.end).getMinutes(),
                                    reserve:true
                                })
                            }else{
                                arr.push({
                                    start: new Date(date.start).getHours() + ":" + new Date(date.start).getMinutes(),
                                    end: new Date(date.end).getHours() + ":" + new Date(date.end).getMinutes(),
                                    reserve:false
                                })
                            }
                        }
                        

                    })
                if (arr.length > 0) {
                    arrt.push(
                        {id: teacher._id, fname: teacher.fname, lname: teacher.lname, list: arr}
                    )

                }
            })

        console.log(arrt)
        this.setState({currentData: arrt})

    }

    changeDate(y, m) {
        // //////////////////////////recive month data 

        var date =momentj(y + "/" + (m+1) + "/" + 1 , 'jYYYY/jM/jD').format('YYYY-M-D HH:mm:ss')
        
        const req = axios.create({baseURL: configs.apiUrl
            ,headers: {"Content-Type": "application/json" ,Authorization: localStorage.getItem("access-token")   }});    
        this.setState({ waiting: true }, () => {
        req.get(`/app/parent/setting-appointment-list/${localStorage.getItem("student-id")}/${(new Date(date)).valueOf()}`)
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
        data.forEach((teacher) => teacher.appointments.forEach((date) => {

            arr.push({
                year: momentj(date.start).jYear(),
                month: momentj(date.start).jMonth(),
                day: momentj(date.start).jDate()
            })

        }))

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
        req.get(`/app/parent/setting-appointment-list/${localStorage.getItem("student-id")}/${(new Date()).valueOf()}`)
        .then(res => { 
          console.log(res.data)
        this.findHighlightedDays(res.data)
        var arr = []
        var arrt = []
        res.data.forEach((teacher) => {
            arr = []
            
            teacher
                .appointments
                .forEach((date) => {
                    
                    if (momentj(date.start).jYear() === y && momentj(date.start).jMonth() === m && momentj(date.start).jDate() === d) {
                        console.log('1',date.pid)
                        if(date.hasOwnProperty('pid')){
                            
                            arr.push({
                                start: new Date(date.start).getHours() + ":" + new Date(date.start).getMinutes(),
                                end: new Date(date.end).getHours() + ":" + new Date(date.end).getMinutes(),
                                reserve:true
                            })
                        }else{
                            arr.push({
                                start: new Date(date.start).getHours() + ":" + new Date(date.start).getMinutes(),
                                end: new Date(date.end).getHours() + ":" + new Date(date.end).getMinutes(),
                                reserve:false
                            })
                        }
                      
                    }

                })
            if (arr.length > 0) {
                arrt.push(
                    {id: teacher._id, fname: teacher.fname, lname: teacher.lname, list: arr}
                )
            }
        })
        
        this.setState(
            {waiting:false, currentData: arrt, currentDay: today.format('jYYYY/jM/jD'), currentDaySt: today.format('jYYYY/jM/jD'), data:res.data}
        )
 
        })       
        .catch(err => {console.log('err',err.response);});   
        });

        
        
           
    }



handleChangeReserve(j,i,id){
    var currentData= this.state.currentData
    var el=this.state.currentData[j].list[i]
    var start=(new Date(moment(momentj(this.state.currentDay+" "+el.start, 'jYYYY/jM/jD HH:mm').format('YYYY-M-D HH:mm:ss')))).toISOString()
    var end=(new Date(moment(momentj(this.state.currentDay+" "+el.end, 'jYYYY/jM/jD HH:mm').format('YYYY-M-D HH:mm:ss')))).toISOString()
  
  
    if(this.state.currentData[j].list[i].reserve){
        const req2 = axios.create({baseURL: configs.apiUrl
            ,headers: {"Content-Type": "application/json" ,Authorization: localStorage.getItem("access-token")   }});
            this.setState({ waiting: true }, () => {
            req2.post("/app/parent/setting-appointment-remove",
         { 
             studentID:localStorage.getItem("student-id"),
             appointmentID:id,
             start: start, 
             end: end
          }
        )
        .then(()=>{
            currentData[j].list[i].reserve= false
             this.setState({currentData:currentData,waiting:false})
        })
        .catch(err => {console.log(err.response);}) })   
    }
    else{
    
    const req2 = axios.create({baseURL: configs.apiUrl
        ,headers: {"Content-Type": "application/json" ,Authorization: localStorage.getItem("access-token")   }});
        this.setState({ waiting: true }, () => {
        req2.post("/app/parent/setting-appointment-set",
    {
         studentID:localStorage.getItem("student-id"),
         appointmentID:id,
         start: start, 
         end: end
        }
    )
    .then(()=>{
        currentData[j].list[i].reserve= true
         this.setState({currentData:currentData,waiting:false})
    })
    .catch(err => {console.log(err.response);});  }) 
}
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
                    <Grid className={classes.container} container  
                        direction='row-reverse' justify='center' xs={12}>
                        <Grid item="item" style={{minWidth:'320px'}} xs={4}>
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
                                                (teacher, j) => <div key={j}>
                                                    <ListItem button="button" onClick={() => this.handleClickOpenList(j)}>

                                                        <ListItemText
                                                            inset="inset"
                                                            className={classes.list}
                                                            primary={teacher.fname + " " + teacher.lname}/> {
                                                            this
                                                                .state
                                                                .openList[j]
                                                                    ? <ExpandLess/>
                                                                    : <ExpandMore/>
                                                        }
                                                    </ListItem>

                                                    <Collapse
                                                        in={this
                                                            .state
                                                            .openList[j]}
                                                        timeout="auto"
                                                        unmountOnExit="unmountOnExit"
                                                        className={classes.collapse}
                                                        >
                                                        <Grid item="item"  xs={12}>
                                                            <Paper className={classes.paper}>

                                                                <Table className={classes.table}>
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            <TableCell  className={classes.tablecell}>وضعیت رزرو</TableCell>
                                                                            <TableCell className={classes.tablecell}>شروع</TableCell>
                                                                            <TableCell className={classes.tablecell}>پایان</TableCell>
                                                                            
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {
                                                                            teacher
                                                                                .list
                                                                                .map(
                                                                                    (item, i) => <TableRow key={i}>

                                                                                        <TableCell className={classes.tablecell}>
                                                                                            <Switch
                                                                                            checked={item.reserve}
                                                                                            onChange={()=>this.handleChangeReserve(j,i,teacher.id)}
                                                                                            />
                                                                                        </TableCell>
                                                                                        <TableCell className={classes.tablecell}>{persian.toPersian(item.start)}</TableCell>
                                                                                        <TableCell className={classes.tablecell}>{persian.toPersian(item.end)}</TableCell>
                                                                                       
                                                                                    </TableRow>

                                                                                )
                                                                        }
                                                                    </TableBody>
                                                                </Table>

                                                            </Paper>
                                                        </Grid>
                                                    </Collapse>

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