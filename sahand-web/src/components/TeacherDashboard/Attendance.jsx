import React, {Component} from "react";
import {
    Grid,
    Paper,
    Button,
    CircularProgress,
    Checkbox,
    TextField,
    Table,
    TableRow,
    TableCell,
    TableHead,
    TableBody,
    Typography
} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";
const moment = require('moment');
import green from "@material-ui/core/colors/green";
import axios from "axios";
import configs from "../../configs";
import PopMessages from "../common/PopMessages";
import persian from "persian";
const styles = theme => {
    return {
        root: {
            paddingLeft: theme.spacing.unit * 10,
            paddingRight: theme.spacing.unit * 10
        },
        primary: {
            marginTop: theme.spacing.unit
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

class StudentInfoForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _id: "",
            open: false,
            checked: [1],
            selectedStudents: [],
            errorMessages: [],
            selectDelete: [],
            date: new Date(),
            present: {},
            change: false,
            students:[],
            record:       {
              ID: "",
              name: "",
              periods: {},
              className: ""
            },
        };
        this.handleBtnClick = this
            .handleBtnClick
            .bind(this);
        this.handleError = this
            .handleError
            .bind(this);
        this.handleToggle = this
            .handleToggle
            .bind(this);
        this.handleCheckList = this
            .handleCheckList
            .bind(this);
        
      
    }

    handleToggle = value => () => {
        const {checked} = this.state;
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        this.setState({checked: newChecked});
    };
    //////////////////
    componentDidMount() {
        
        const req = axios.create({
            baseURL: configs.apiUrl,
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("access-token")
            }
        });
        
        req
            .get("/app/teacher/course-list")
            .then(res => {

                res
                    .data
                    .forEach((el, i) => {
                        if (el.ID === localStorage.getItem("school-id")) {
                            
                            res
                                .data[i]
                                .courseList
                                .forEach((e) => {
                                    if (e.ID === localStorage.getItem("course-id")) {
                                        this.setState({record: e})
                                        console.log(e,e.periods['day' + ((moment(this.state.date).day()+1)%7)])
                                        req
                                        .post(`/app/teacher/student-list`,
                                        {
                                        courseID:localStorage.getItem("course-id")
                                        
                                })
                                            .then(res => {
                                             console.log(res.data.studentList)
                                                this.setState({students : res.data.studentList}) 
                                                    
                                            })
                                            .catch(err => {
                                               console.log(err)

                                            })
                                        const minDate = new Date();
                                        this.calendar = $("#calendar").persianDatepicker({
                                            format: "YYYY/MM/DD",
                                            minDate: new Date((minDate.getFullYear() - 1) + "-08-01"),
                                            maxDate: new Date(),
                                            toolbox: {
                                                calendarSwitch: {
                                                    enabled: false
                                                }
                                            },
                                            dayPicker: {
                                                onSelect: date => {
                                                    this.setState({
                                                        date: new Date(parseInt(date))
                                                    });
                                                    this.updateAbsenceList();
                                                }
                                            }
                                        });
                                        this.updateAbsenceList();
                                    }
                                })
                        }

                    })

            })
            .catch(err => {
                console.log(err)

             });

    }

   
    updateAbsenceList() {
        const {record} = this.state;
        const req = axios.create({
            baseURL: configs.apiUrl,
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("access-token")
            }
        });
        req
            .get(`/app/teacher/attendance-report/${record.ID}/${this.state.date.valueOf()}`)
            .then(res => {
                console.log('date recive', res.data, Array.isArray(res.data), res.data.length)
                if (Object.keys(res.data).length > 0) {
                    this.setState({present: res.data});
                } else {
                    this.setState({present: {}});
                }
                console.log('get present: ', this.state.present)
            })
            .catch(err => {
                alert("خطای سرور");

            });
    }

    handleBtnClick(name) {
        const {record} = this.state;
        return async () => {
            let req;
            switch (name) {
                case "add":
                    try {
                        for (let presentItem in this.state.present) {
                            req = axios.create({
                                baseURL: configs.apiUrl,
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: localStorage.getItem("access-token")
                                }
                            });
                            console.log('send object', {
                                present: this
                                    .state
                                    .present[presentItem][0]
                                    .present,
                                date: presentItem
                            })
                            let res = await req.post(`/app/teacher/attendance/${record.ID}`, {
                                present: this
                                    .state
                                    .present[presentItem][0]
                                    .present,
                                date: presentItem
                            });
                            console.log(res);
                        }
                    } catch (err) {
                        alert("خطای سرور");

                    }

                    break;
            }
        };
    }

    handleError(message) {
        this.setState(prevState => {
            return {
                errorMessages: prevState
                    .errorMessages
                    .concat(message)
            };
        });
    }
    handleErrorExit(id) {
        return() => {
            this.setState(prevState => {
                prevState
                    .errorMessages
                    .splice(id, 1);
                return {errorMessages: prevState.errorMessages};
            });
        };
    }
    handleCheck(id) {
        return e => {
            const checked = e.target.checked;
            this.setState(prevState => {
                let nextState = Object.assign(prevState.selectedStudents);
                if (checked) {
                    if (nextState.findIndex(el => el === id) === -1) {
                        return {
                            selectedStudents: nextState.concat([id])
                        };
                    }
                } else {
                    const idx = nextState.findIndex(el => el === id);
                    nextState.splice(idx, 1);
                    return {selectedStudents: nextState};
                }
            });
        };
    }
    handleCheckList(id, time) {
        return e => {
            const checked = e.target.checked;
            const index = (new Date(
                this.state.date.toISOString().substr(0, 10) + " " + time.start
            )).toISOString();

            console.log('chech', checked, this.state.present);

            if (!this.state.present.hasOwnProperty(index)) {
                this
                    .state
                    .present[index] = [];
                this
                    .state
                    .present[index]
                    .push({present: []})
                console.log( this.state.students);
                this
                    .state.students
                    .map(s => {
                        console.log('student', s.ID, id);
                        if (s.ID !== id && checked == false) {
                            this
                                .state
                                .present[index][0]
                                .present
                                .push(s.ID)
                            this.setState({change: true});
                            console.log('my present', this.state.present)
                        }
                    })
            } else if (checked == false) {
                this
                    .state
                    .present[index][0]
                    .present
                    .splice(this.state.present[index][0].present.findIndex(sid => {
                        return sid === id
                    }), 1);
                this.setState({change: true});
            } else {
                this
                    .state
                    .present[index][0]
                    .present
                    .push(id);
                this.setState({change: true});
            }
            console.log('my present', this.state.present)
        };
    }
    render() {
        const {classes} = this.props;
        const {change, record} = this.state;
        console.log(change, record)
        let bodyComponent;
        if(record.ID === ""){
            bodyComponent = <Typography variant="body1">درسی تعریف نشده است</Typography>
        } else {
            bodyComponent = <Grid
            container="container"
            direction="column"
            className={classes.root}
            alignItems="stretch">
            <Grid container="container" direction="row" spacing={16} alignItems="center">
                <Grid item="item">
                    <Typography variant="body1">تاریخ:</Typography>
                </Grid>
                <Grid item="item">
                    <TextField
                        inputProps={{
                            style: {
                                textAlign: "center"
                            }
                        }}
                        id={"calendar"}
                        disabled={this.state.shouldSearch || this.state.shouldGoNext}/>
                </Grid>
            </Grid>
            <Grid container="container" direction="row" spacing={16} alignItems="flex-end">
                <Grid item="item" xs={12}>
                    <Table>
                        <TableHead>
                            <TableRow>
                            <TableCell  >
    <Typography variant="body1"  >نام</Typography>
    </TableCell>
    
    <TableCell  >
    <Typography variant="body1"  >نام‌خانوادگی</Typography>
    </TableCell>
    
                                
                                 {
               (record.periods['day' + + ((moment(this.state.date).day()+1)%7)])?
               record.periods['day' + + ((moment(this.state.date).day()+1)%7)].map(time=>(
                 <TableCell key={time.start}><Typography variant="body1">{persian.toPersian(time.start+"-"+time.end)}</Typography></TableCell>
               )):<TableCell/>
             
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                this
                                    .state.students
                                    .map(student => {
                                        return (
                                            <TableRow key={student.ID}>
                                                <TableCell><Typography variant="body1">{student.firstName}</Typography></TableCell>
                                                <TableCell><Typography variant="body1">{student.lastName}</Typography></TableCell>
                                                
                                                {
                                                    (record.periods['day' + (
                                                            + ((moment(this.state.date).day()+1)%7)
                                                        )])
                                                            ? record
                                                                .periods['day' + (
                                                                        + ((moment(this.state.date).day()+1)%7)
                                                                    )]
                                                                .map(time => (
                                                                    <TableCell key={student.ID + time.start}>
                                                                        <Checkbox
                                                                            checked={!this
                                                                                .state
                                                                                .present
                                                                                .hasOwnProperty((new Date(
                                                                                    this.state.date.toISOString().substr(0, 10) + " " + time.start
                                                                                )).toISOString()) || (this.state.present[(new Date(this.state.date.toISOString().substr(0, 10) + " " + time.start)).toISOString()].findIndex((object) => {
                                                                                    return (object.present.findIndex((id) => {
                                                                                        return student.ID === id
                                                                                    }) >= 0)
                                                                                }) >= 0)}
                                                                            onChange={this.handleCheckList(student.ID, time)}/>
                                                                    </TableCell>
                                                                ))
                                                            : <TableCell/>
                                                }
                                            </TableRow>
                                        );
                                    })
                            }
                        </TableBody>
                    </Table>
                </Grid>
            </Grid>
            <Grid container="container" direction="row" alignItems="stretch" spacing={16}>
                <Grid
                    item="item"
                    style={{
                        flexGrow: 1,
                        marginTop: 16
                    }}>
                    <Button
                        className={classes.primary}
                        variant="contained"
                        color="secondary"
                        fullWidth="fullWidth"
                        onClick={this.handleBtnClick("add")}>

                        ثبت
                    </Button>
                </Grid>
            </Grid>
        </Grid>
        }
        return (
          <div style={{ padding: 32 }}>
            <Paper style={{
                    padding: 20
                }}>
                {
                    this
                        .state
                        .errorMessages
                        .map((err, id) => {
                            return (
                                <PopMessages
                                    open={true}
                                    key={id}
                                    message={err}
                                    variant="error"
                                    onExited={this.handleErrorExit(id)}/>
                            );
                        })
                }
                {bodyComponent}
                
            </Paper>
            </div>
        );
    }
}

StudentInfoForm.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(StudentInfoForm);
