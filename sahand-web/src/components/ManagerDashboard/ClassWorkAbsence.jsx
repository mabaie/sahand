import React, { Component } from "react";
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
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
const moment = require('moment');
const jMoment = require("moment-jalaali");
import green from "@material-ui/core/colors/green";
import axios from "axios";
import { Chart } from "react-google-charts";
import configs from "../../configs";
import PopMessages from "../common/PopMessages";
import persian from "persian";
const styles = theme => {
  return {
    root: {
      paddingLeft: theme.spacing.unit * 10,
      paddingRight: theme.spacing.unit * 10,
      direction:'ltr'
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
    },
    chart:{
      direction:'rtl'
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
      loading: true,
      date: new Date(),
      present:{},
      change:false,
      mode:0,
      chart_data:[]
    };
    this.handleBtnClick = this.handleBtnClick.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleCheckList = this.handleCheckList.bind(this);
    this.students = [];
    this.sstudents = [];
  }

  handleToggle = value => () => {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked
    });
  };
  componentDidMount() {
    const { record } = this.props;
    const req = axios.create({
      baseURL: configs.apiUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("access-token")
      }
    });
    req.get(`/students/${record._id}`).then(res => {
      this.students = res.data;
      req
        .get(`/sstudents/${record._id}`)
        .then(res => {
          this.sstudents = res.data;
        })
        .then(() => {
          this.setState({ _id: record._id, loading: false });
        })
        .catch(err => {
          alert("خطای سرور");
          this.setState({loading: false});
        });
    });
    const minDate = new Date();
    this.calendar = $("#calendar").persianDatepicker({
      format: "YYYY/MM/DD",
      minDate: new Date((minDate.getFullYear()-1)+"-08-01"),
      maxDate: new Date(),
      toolbox: {
        calendarSwitch: {
          enabled: false
        }
      },
      dayPicker: {
        onSelect: date => {
          this.setState({date:new Date(parseInt(date))});
          console.log("date is",this.state.date);
          this.updateAbsenceList();
        }
      }
    });
    this.updateAbsenceList();
  }

  updateAbsenceList(){
    const { record } = this.props;
    const req = axios.create({
      baseURL: configs.apiUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("access-token")
      }
    });
    req.get(`/attendance-report/${record._id}/${this.state.date.valueOf()}`).then(res => {
      console.log('date recive',res.data,Array.isArray(res.data),res.data.length)
      if(Object.keys(res.data).length>0){
        this.setState({present:res.data});
      }else{
        this.setState({present:{}});
      }
      console.log('get present: ',this.state.present)
    }).catch(err => {
      alert("خطای سرور");
      this.setState({loading: false});
    });
  }

  handleBtnClick(name) {
    const { record } = this.props;
    return async() => {
      let req;
      switch (name) {
        case "add":
        try{
          for(let presentItem in this.state.present){
            req = axios.create({
              baseURL: configs.apiUrl,
              headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("access-token")
              }
            });
            console.log('send object',{
              present:this.state.present[presentItem][0].present,
              date:presentItem
            })
            let res= await req
              .post(
                `/attendance/${record._id}`,
                {
                  present:this.state.present[presentItem][0].present,
                  date:presentItem
                }
              );
            console.log(res);
          }
        }catch(err){
          alert("خطای سرور");
          this.setState({loading: false});
        }
        this.setState({loading:false})
        break;
        case "report":
        req = axios.create({
          baseURL: configs.apiUrl,
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("access-token")
          }
        });
        req.get(`/attendance-report-month/${record._id}/${this.state.date.valueOf()}`).then(res => {
          console.log('date recive month',res.data)
          // ['تاریخ', 'تعداد غیبت'],
          //             ['۱', 3],
          //             ['۲', 5],
          //             ['۳', 0],
          //             ['۴', 10],
          if(Object.keys(res.data).length==0){
            this.setState({mode:1,chart_data:[]})
          }else{
            this.state.chart_data=[];
            this.state.chart_data.push(['زمان کلاس', 'تعداد غیبت'])
            for(let t in res.data){
              this.state.chart_data.push(
                [persian.toPersian(jMoment(new Date(t)).format("HH:mm jMM/jDD")),res.data[t]]
              )
            }
            // console.log(this.state.chart_data)
            this.setState({mode:1})
          }
          this.setState({mode:1})
        }).catch(err => {
          alert("خطای سرور");
          this.setState({loading: false});
        });
        break
      }
    };
  }

  handleError(message) {
    this.setState(prevState => {
      return { errorMessages: prevState.errorMessages.concat(message) };
    });
  }
  handleErrorExit(id) {
    return () => {
      this.setState(prevState => {
        prevState.errorMessages.splice(id, 1);
        return { errorMessages: prevState.errorMessages };
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
            return { selectedStudents: nextState.concat([id]) };
          }
        } else {
          const idx = nextState.findIndex(el => el === id);
          nextState.splice(idx, 1);
          return { selectedStudents: nextState };
        }
      });
    };
  }
  handleCheckList(id,time) {
    return e => {
      const checked = e.target.checked;
      const index = (new Date(this.state.date.toISOString().substr(0,10) +" " + time.start))
      .toISOString();
      console.log('chech',checked,this.state.present);
      if(!this.state.present.hasOwnProperty(index)){
          this.state.present[index]=[];
          this.state.present[index].push({present:[]})
          // console.log(this.sstudents,this.students);
          this.students.map(s=>{
            // console.log('student',s._id , id);
            if(s._id !== id && checked==false){
              this.state.present[index][0].present.push(s._id)
              this.setState({change:true});
              console.log('my present',this.state.present)
            }
          })
      }else if(checked==false){
        this.state.present[index][0].present.splice(
          this.state.present[index][0].present.findIndex(sid=>{return sid===id}),1);
        this.setState({change:true});
      }else{
        this.state.present[index][0].present.push(id);
        this.setState({change:true});
      }
      console.log('my present',this.state.present)
    };
  }
  render() {
    const { classes, waiting,record } = this.props;
    const { loading,change } = this.state;
    return (
      <Paper style={{ padding: 20 }}>
        {this.state.errorMessages.map((err, id) => {
          return (
            <PopMessages
              key={id}
              message={err}
              variant="error"
              onExited={this.handleErrorExit(id)}
            />
          );
        })}
        <Grid
          container
          direction="column"
          className={classes.root}
          alignItems="stretch"
        >
          <Grid container direction="row" alignItems="stretch" spacing={16}>
            <Grid item style={{ flexGrow: 1, marginTop: 16 }}>
              <Button
                className={classes.primary}
                variant="contained"
                color="primary"
                fullWidth
                onClick={()=>{
                  this.setState({mode:0})
                }}
              >
                ثبت حضور و غیاب
              </Button>
            </Grid>
            <Grid item style={{ flexGrow: 1, marginTop: 16 }}>
              <Button
                className={classes.primary}
                variant="contained"
                color="primary"
                fullWidth
                onClick={this.handleBtnClick("report")}
              >
                نمایش نمودار ماهانه
              </Button>
            </Grid>
          </Grid>
          <Grid container direction="row" spacing={16} alignItems="center">
            <Grid item>
              <Typography variant="body1">تاریخ:</Typography>
            </Grid>
            <Grid item>
              <TextField
                inputProps={{
                  style: { textAlign: "center" }
                }}
                id={"calendar"}
                disabled={this.state.shouldSearch || this.state.shouldGoNext}
              />
            </Grid>
          </Grid>
          {
            this.state.mode ===0 && 
              (
                <Grid>
                  
          <Grid container direction="row" spacing={16} alignItems="flex-end">
            <Grid item xs={12}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>نام</TableCell>
                    <TableCell>نام خانوادگی</TableCell>
                    <TableCell>شماره ملی</TableCell>
                    {
                      (record.periods['day' + (moment(this.state.date).day() + 1) % 7])?
                      record.periods['day' + (moment(this.state.date).day() + 1) % 7].map(time=>(
                        <TableCell key={time.start}>{persian.toPersian(time.start+"-"+time.end)}</TableCell>
                      )):<TableCell/>
                    }
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.students.map(student => {
                    return (
                      <TableRow key={student._id}>
                        <TableCell>{student.fname}</TableCell>
                        <TableCell>{student.lname}</TableCell>
                        <TableCell>
                          {persian.toPersian(student.userName)}
                        </TableCell> 
                        {
                          (record.periods['day' + (moment(this.state.date).day() + 1) % 7])?
                          record.periods['day' + (moment(this.state.date).day() + 1) % 7].map(time=>(
                            <TableCell key={student._id+time.start}>
                              <Checkbox
                                checked={
                                  !this.state.present.hasOwnProperty(
                                    (new Date(this.state.date.toISOString().substr(0,10) +" " + time.start))
                                    .toISOString()) || (
                                      this.state.present[(new Date(this.state.date.toISOString().substr(0,10) +" " + time.start))
                                      .toISOString()].findIndex((object)=>{
                                        return (
                                          object.present.findIndex((id)=>{
                                            return student._id===id
                                          }
                                          )>=0
                                        )
                                      })>=0
                                    )
                                }
                                onChange={this.handleCheckList(student._id,time)}
                              />
                              </TableCell>
                          )):<TableCell/>
                        }
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Grid>
          </Grid>
          <Grid container direction="row" alignItems="stretch" spacing={16}>
            <Grid item style={{ flexGrow: 1, marginTop: 16 }}>
              <Button
                disabled={waiting || loading || !change}
                className={classes.primary}
                variant="contained"
                color="secondary"
                fullWidth
                onClick={this.handleBtnClick("add")}
              >
                {loading && (
                  <CircularProgress
                    className={classes.buttonProgress}
                    size={24}
                  />
                )}
                ثبت
              </Button>
            </Grid>
          </Grid>
                </Grid>
              )
          }
          {
            this.state.mode ===1 && this.state.chart_data.length>0 &&
              (
                <Grid >
                  <div className={classes.chart}>
                  <Chart
                    width={'100%'}
                    height={'500px'}
                    chartType="LineChart"
                    loader={<div>درحال دریافت اطلاعات</div>}
                    data={this.state.chart_data}
                    chartLanguage='fa'
                    options={{
                      // Material design options
                      chart: {
                        title: 'غیبت ماهانه',
                        titleTextStyle: {
                          fontName: "IRANSans" 
                        }
                      },
                      
                      hAxis: {
                        title: 'زمان کلاس',
                        titleTextStyle: {
                          fontName: "IRANSans" 
                        },
                        textStyle:{
                          fontName: "IRANSans" 
                        },
                        slantedText:true,
                        slantedTextAngle:45 
                      },
                      legend:{
                        textStyle:{
                          fontName: "IRANSans" 
                        }
                      },
                      tooltip:{
                        textStyle:{
                          fontName: "IRANSans" 
                        }
                      },

                      vAxis: {
                        title: 'تعداد غیبت',
                        titleTextStyle: {
                          fontName:"IRANSans"
                        },
                        textStyle: {
                          fontName:"IRANSans"
                          //  "IRANSansFaNum" 
                        },
                        gridlines:{count:3}
                      }
                    }}
                    // For tests
                    rootProps={{ 'data-testid': '1' }}
                  />
                  </div>
                </Grid>
              )
          }
        </Grid>
      </Paper>
    );
  }
}

StudentInfoForm.propTypes = {
  classes: PropTypes.object.isRequired,
  record: PropTypes.object.isRequired,
  waiting: PropTypes.bool.isRequired,
  onWaiting: PropTypes.func.isRequired,
  onRegister: PropTypes.func.isRequired
};

export default withStyles(styles)(StudentInfoForm);
