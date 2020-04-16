// const example1 = [
//     {
//         teacherId: "1",
//         fname: "احمد",
//         lname: "محمدی",
//         dates: [
//             {
//                 start: "2018-12-05T14:00:00.000Z",
//                 end: "2018-12-05T15:00:00.000Z",
//                 pfname: "علی",
//                 plname: "حسنی",
//                 cfname: "پارسا",
//                 clname: "حسنی"
//             }, {
//                 start: "2018-12-06T15:00:00.000Z",
//                 end: "2018-12-06T16:00:00.000Z",
//                 pfname: "محمد",
//                 plname: "جعفری",
//                 cfname: "امین",
//                 clname: "جعفری"
//             }
//         ]
//     }, {
//         teacherId: "2",
//         fname: "سعید",
//         lname: "احمدی",
//         dates: [
//             {
//                 start: "2018-12-06T14:00:00.000Z",
//                 end: "2018-12-06T15:00:00.000Z",
//                 pfname: "حسین",
//                 plname: "عبدلی",
//                 cfname: "سینا",
//                 clname: "عبدلی"
//             }
//         ]
//     }, {
//         teacherId: "3",
//         fname: "حسن",
//         lname: "شیری",
//         dates: [
//             {
//                 start: "2018-12-07T14:00:00.000Z",
//                 end: "2018-12-07T15:00:00.000Z",
//                 pfname: "سعید",
//                 plname: "افشاری",
//                 cfname: "امیر",
//                 clname: "افشاری"
//             }, {
//                 start: "2018-12-08T15:00:00.000Z",
//                 end: "2018-12-08T16:00:00.000Z",
//                 pfname: "حمید",
//                 plname: "سعیدی",
//                 cfname: "رضا",
//                 clname: "سعیدی"
//             }
//         ]
//     }
// ]




import React, {Component} from 'react';
import momentj from 'moment-jalaali';
import moment from 'moment'
import Calender from './Calender';
import {
    Grid,
    Paper,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Select,
    InputLabel,
    FormControl,
    TextField,
    List,
    ListItem,
    ListItemText,
    Collapse,
    ListSubheader,
    Table,
    TableBody,
    TableHead,
    TableCell,
    TableRow,
    Typography,
    IconButton
} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from "prop-types";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import persian from 'persian'
import configs from "./configs";
import axios from "axios";
import Delete from "@material-ui/icons/Delete";

const styles = theme => ({
    root: {
        flexGrow: 1
    },
    container: {
        textAlign: 'right'
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
        textAlign: 'right'
    },
    paper: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto'
    },
    table: {
        minWidth: 700
    },
    dateText:{
        margin:'10px'
    }
});

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
        this.addAppointment = this
            .addAppointment
            .bind(this)
        this.handleClose = this
            .handleClose
            .bind(this)
        this.add = this
            .add
            .bind(this)
        this.handleClickOpenList = this
            .handleClickOpenList
            .bind(this)
            this.handleDelete = this
            .handleDelete
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
console.log(this.state.data)
        this.setState({
            currentDay: y + "/" + (
                m + 1
            ) + "/" + d,
            currentDaySt: momentj(y + "/" + (
                m + 1
            ) + "/" + d, 'jYYYY/jM/jD').format('jYYYY jMMMM jD')
        })

        var arr = []
        var arrt = []
        this.state.data
            .forEach((teacher) => {
                arr = []
                teacher
                    .appointments
                    .forEach((date) => {
                        console.log(momentj(date.start).jMonth())
                        if (momentj(date.start).jYear() === y && momentj(date.start).jMonth() === m && momentj(date.start).jDate() === d) {

                            if(teacher.hasOwnProperty('pname')){
                                arr.push({
                                    start: new Date(date.start).getHours() + ":" + new Date(date.start).getMinutes(),
                                    end: new Date(date.end).getHours() + ":" + new Date(date.end).getMinutes(),
                                    pfname: date.pfname,
                                    plname: date.plname,
                                    cfname: date.cfname,
                                    clname: date.clname
                                })
                            }else{
                                arr.push({
                                    start: new Date(date.start).getHours() + ":" + new Date(date.start).getMinutes(),
                                    end: new Date(date.end).getHours() + ":" + new Date(date.end).getMinutes(),
                                    pfname: "انتخاب نشده",
                                    plname: "",
                                    cfname: "",
                                    clname: ""
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
            ,headers: {"Content-Type": "application/json" ,Authorization: configs.tocken   }});    
        this.setState({ waiting: true }, () => {
        req.get(`/appointment/get/${(new Date(date)).valueOf()}`)
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
    addAppointment() {
        this.setState({open: true})
    }
    add() {
        var timeStart = new Date("01/01/2007 " + this.state.start).getTime();
        var timeEnd = new Date("01/01/2007 " + this.state.end).getTime();
        var hourDiff = (timeEnd - timeStart) / 1000;
        hourDiff /= 60;
        hourDiff = Math.abs(Math.floor(hourDiff));

        var numofslot = Math.abs(Math.floor(hourDiff / this.state.timeSlot))

        var arr = []
        for (var i = 0; i < numofslot; i++) {
            arr[i] = {
                start: (new Date(moment(
                    momentj(this.state.currentDay + ' ' + this.state.start, 'jYYYY/jM/jD HH:mm').format('YYYY-M-D HH:mm:ss')
                )
                    .add(i * this.state.timeSlot, 'minutes')
                    .format('YYYY-M-D HH:mm:ss'))).toISOString(),
                end: (new Date(moment(
                    momentj(this.state.currentDay + ' ' + this.state.start, 'jYYYY/jM/jD HH:mm').format('YYYY-M-D HH:mm:ss')
                )
                    .add(((i + 1) * this.state.timeSlot), 'minutes')
                    .format('YYYY-M-D HH:mm:ss'))).toISOString()
            }
        }

        
        const req = axios.create({     baseURL: configs.apiUrl,     headers: {
        "Content-Type": "application/json",       Authorization: configs.tocken   }

        });     
        this.setState({ waiting: true }, () => {
        req.post("/appointment/add", { "teacherID":this.state.selectedTeacherId,
        "appointments":arr })
        .then(() => { 
            this.setState({
                waiting:false,
                open:false
            })
        })       
        .catch(err => { console.log(err.response);});
       });


    }
    componentDidMount() {
        var today = momentj()
        var y = today.jYear()
        var m = today.jMonth()
        var d = today.jDate()


        const req = axios.create({baseURL: configs.apiUrl
                                ,headers: {"Content-Type": "application/json" ,Authorization: configs.tocken   }});    
        this.setState({ waiting: true }, () => {
        req.get(`/appointment/get/${(new Date()).valueOf()}`)
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
                        if(teacher.hasOwnProperty('pname')){
                            arr.push({
                                start: new Date(date.start).getHours() + ":" + new Date(date.start).getMinutes(),
                                end: new Date(date.end).getHours() + ":" + new Date(date.end).getMinutes(),
                                pfname: date.pfname,
                                plname: date.plname,
                                cfname: date.cfname,
                                clname: date.clname
                            })
                        }else{
                            arr.push({
                                start: new Date(date.start).getHours() + ":" + new Date(date.start).getMinutes(),
                                end: new Date(date.end).getHours() + ":" + new Date(date.end).getMinutes(),
                                pfname: "انتخاب نشده",
                                plname: "",
                                cfname: "",
                                clname: ""
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
            {waiting:false, currentData: arrt, currentDay: today.format('jYYYY/jM/jD'), currentDaySt: today.format('jYYYY jMMMM jD'), data:res.data}
        )
 
        })       
        .catch(err => {console.log('err',err.response);});   
        });

        ////////////////////////////recive teachers data
       
        const req2 = axios.create({baseURL: configs.apiUrl
            ,headers: {"Content-Type": "application/json" ,Authorization: configs.tocken   }});
        req2.post(`/teachers`,
            {
                "skip": "0",
                "limit": "1000",
                "filter": {"ID":"default"}
              }
        )
        .then(res=>{
           
            this.setState({teachers:res.data})
        })
        .catch(err => {console.log(err.response);});   
           
    }

    handleChangeSelect = event => {
        this.setState({ [event.target.name]: event.target.value });
      };

handleDelete(j,i,id){
    var currentData= this.state.currentData
    var el=this.state.currentData[j].list[i]

  
    
    var start=(new Date(moment(momentj(this.state.currentDay+" "+el.start, 'jYYYY/jM/jD HH:mm').format('YYYY-M-D HH:mm:ss')))).toISOString()
    
    var end=(new Date(moment(momentj(this.state.currentDay+" "+el.end, 'jYYYY/jM/jD HH:mm').format('YYYY-M-D HH:mm:ss')))).toISOString()
  
    const req2 = axios.create({baseURL: configs.apiUrl
        ,headers: {"Content-Type": "application/json" ,Authorization: configs.tocken   }});
    req2.delete("/appointment/delete",
    {data: {
        ID:id,
        start: start, 
        end: end
      }}
    )
    .then(()=>{
        currentData[j].list.splice(i, 1)
        //console.log('hiii',currentData[j].list)
    //    console.log('dell')
         this.setState({currentData:currentData})
    })
    .catch(err => {console.log(err.response);});   
        
}
componentWillMount(){
    // const req2 = axios.create({baseURL: configs.apiUrl
    //     ,headers: {"Content-Type": "application/json" ,Authorization: configs.tocken   }});
    // req2.delete("/appointment/delete",
    // {data: {
    //     ID: "5c31e6077c36d0af6ff3866f",
    //     end: "2019-02-04T04:30:00.000Z",
    //     start: "2019-02-04T04:25:00.000Z"
    //   }}
    // )
    
}
    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>

                <Paper>
                    <Grid className={classes.container} container
                        direction='row-reverse' justify='center' xs={12}>
                        <Grid item="item" style={{minWidth:'350px'}} xs={4}>
                            <Calender
                                item={this.state.dates}
                                clickDate={this.clickDate}
                                changeDate={this.changeDate}/>
                        </Grid>
                        <Grid item="item" xs={8}>
                            <Grid item="item" xs={12}>
                                <Button
                                    className={classes.addAppointmentButton}
                                    color="secondary"
                                    variant="contained"
                                    onClick={() => this.addAppointment()}>افزودن</Button>
                            </Grid>
                            <Dialog
                                open={this.state.open}
                                onClose={this.handleClose}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description">
                                <DialogTitle id="alert-dialog-title">{"افزودن زمان ملاقات"}</DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        افزودن زمان ملاقات
                                    </DialogContentText>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel htmlFor="age-native-simple">معلم</InputLabel>
                                        <Select
                                            native="native"
                                            value={this.state.selectedTeacherId}
                                            onChange={this.handleChangeSelect}
                                            inputProps={{
                                                name: 'selectedTeacherId',
                                                id: 'teacher-native-simple'
                                            }}>
                                            <option value=""/>
                                            {
                                                this.state.teachers.map((teacher,i)=>
                                                <option key={i} value={teacher._id}>{teacher.fname+" "+ teacher.lname }</option>    
                                                )
                                            
                                            }
                                        </Select>

                                        <TextField
                                            type="number"
                                            id="standard-dense"
                                            label="بازه زمانی"
                                            className={classes.textField}
                                            margin="dense"
                                            value={this.state.timeSlot}
                                            onChange={(e) => this.setState({timeSlot:e.target.value})}/>
                                        <TextField
                                            id="time"
                                            label="شروع"
                                            type="time"
                                            value={this.state.start}
                                            className={classes.textField}
                                            InputLabelProps={{
                                                shrink: true
                                            }}
                                            onChange={(e) => {
                                                this.setState({start: e.target.value})
                                            }}
                                            inputProps={{
                                                step: 60, // 1 min
                                            }}/>

                                        <TextField
                                            id="time"
                                            label="پایان"
                                            type="time"
                                            value={this.state.end}
                                            onChange={(e) => {
                                                this.setState({end: e.target.value})
                                            }}
                                            className={classes.textField}
                                            InputLabelProps={{
                                                shrink: true
                                            }}
                                            inputProps={{
                                                step: 60, // 1 min
                                            }}/>
                                    </FormControl>

                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={this.add} variant="contained" color="secondary">
                                        افزودن
                                    </Button>

                                </DialogActions>
                            </Dialog>
                            <Grid item="item" xs={12}>
                            <Typography className={classes.dateText} fontWeight="fontWeightMedium" variant="body1" align="right">
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
                                                        unmountOnExit="unmountOnExit">
                                                        <Grid item="item"  xs={11}>
                                                            <Paper className={classes.paper}>

                                                                <Table className={classes.table}>
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            <TableCell>نام سرپرست</TableCell>
                                                                            <TableCell align="right">نام خانوادگی سرپرست</TableCell>
                                                                            <TableCell align="right">نام دانش‌آموز</TableCell>
                                                                            <TableCell align="right">نام خانوادگی دانش‌آموز</TableCell>
                                                                            <TableCell align="right">شروع</TableCell>
                                                                            <TableCell align="right">پایان</TableCell>
                                                                            <TableCell align="right">حذف</TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {
                                                                            teacher
                                                                                .list
                                                                                .map(
                                                                                    (item, i) => <TableRow key={i}>

                                                                                        <TableCell align="right">{item.pfname}</TableCell>
                                                                                        <TableCell align="right">{item.plname}</TableCell>
                                                                                        <TableCell align="right">{item.cfname}</TableCell>
                                                                                        <TableCell align="right">{item.clname}</TableCell>
                                                                                        <TableCell align="right">{persian.toPersian(item.start)}</TableCell>
                                                                                        <TableCell align="right">{persian.toPersian(item.end)}</TableCell>
                                                                                        <TableCell align="right"><IconButton
                                                                                                    onClick={()=>this.handleDelete(j,i,teacher.id)}
                                                                                                >
                                                                                                    <Delete />
                                                                                                </IconButton></TableCell>
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
