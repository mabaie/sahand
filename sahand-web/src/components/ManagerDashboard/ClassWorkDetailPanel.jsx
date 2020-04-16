import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import cyan from '@material-ui/core/colors/cyan';
import Grid from '@material-ui/core/Grid';
import green from "@material-ui/core/colors/green";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import CircularProgress from "@material-ui/core/CircularProgress";
import Delete from '@material-ui/icons/Delete';
import jMoument from "moment-jalaali";
import Absence from "../ManagerDashboard/ClassWorkAbsence";
import ScheduleTable from '../../components/common/weekScheduler';

import ShowAssinmentComponent from "../ManagerDashboard/ShowAssinmentModal";
import ManagerAssignment from "../ManagerDashboard/AddAssignment";
import persian from 'persian';
import  configs from "../../configs";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const styles = theme => {
  return {
    root: {
      flexGrow: 1,
    },
    primary: {
      maring: theme.spacing.unit,
      marginTop: theme.spacing.unit,
      minWidth: 1000
    },
    assignment:{
      marginTop: 0,
    },
    tab: {
      backgroundColor: cyan[200],
      textColorPrimary: 'white',
    },
    tabItem: {
      textColorPrimary: 'white',
    },
    textColor: {
      color: 'white',
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

class CenteredTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      timelineChanged: false,
      add:false,
      record:{},
      assignment:[],
      showAssinment:{},
      show:false,
      waiting:false,
      timeTable: {},
    };
    this.timeTable={}
    this.getAssignmentList = this.getAssignmentList.bind(this);
  }
  
  componentDidMount(){
    this.state.record=this.props.record;
    this.setState({ waiting: true},()=>{
      const req = axios.create({
        baseURL: configs.apiUrl,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: localStorage.getItem("access-token")
        }
      });
      req
        .get("/assignments/" + this.state.record._id
        )
        .then((response) => {
          response
            this.setState({
              assignment:response.data, 
              waiting: false
            })
				  })
				  .catch(error => {
            this.setState({
                waiting:false,
                message: "دسترسی به سرور قطع شده است.",
                messageOpen: true,
                messageType: "error"
              });
        });
    });
    const req2 = axios.create({
      baseURL: configs.apiUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("access-token")
      }
    });
    const { record } = this.props;
    req2.get("/timetable/" + record.class_id).then(res => {
      this.timeTable = this.createTimetable(res.data);
      this.setState({
        timeTable: this.timeTable,
      });
    });
  }
  componentDidUpdate(){
    if(this.state.record!=this.props.record){
      this.setState({record:this.props.record})
    }
  }

  getAssignmentList(){
    this.state.record=this.props.record;
    this.setState({ waiting: true,add:false,show:false},()=>{
      const req = axios.create({
        baseURL: configs.apiUrl,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: localStorage.getItem("access-token")
        }
      });
      req
        .get("/assignments/" + this.state.record._id
        )
        .then((response) => {
          response
            this.setState({
              assignment:response.data, 
              waiting: false
            })
				  })
				  .catch(error => {
            this.setState({
                waiting:false,
                message: "دسترسی به سرور قطع شده است.",
                messageOpen: true,
                messageType: "error"
              });
        });
    });
  }
  onDelete(id){
    return e => {
      this.setState({ waiting: true,add:false},()=>{
        const req = axios.create({
          baseURL: configs.apiUrl,
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("access-token")
          }
        });
        req
          .delete("/delete-assignment/" + id, { data: {_id:id} }
          )
          .then((response) => {
            this.getAssignmentList();
            })
            .catch(error => {
              this.setState({
                  waiting:false,
                  message: "دسترسی به سرور قطع شده است.",
                  messageOpen: true,
                  messageType: "error"
                });
          });
      });
    }
  }
  getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    color += "8f";
    return color;
  }

  createTimetable(timeTable) {
    let table = {
      day0: [],
      day1: [],
      day2: [],
      day3: [],
      day4: [],
      day5: [],
      day6: []
    };
    let selectedColor = ["#11ff118f"];
    timeTable.map(course => {
      let backgroundColor;
      while (
        selectedColor.indexOf((backgroundColor = this.getRandomColor())) !== -1
      );
      let periodTemplate = {
        title: course.coname,
        id: course._id,
        backgroundColor: backgroundColor,
        disabled: true
      };
      const dayPeriods = course["periods"];
      for (let day in dayPeriods) {
        if (table[day].find(period => period.title === periodTemplate.title)) {
          table[day]["periods"] = table[day]["periods"].concat(dayPeriods[day]);
        } else {
          const newPeriod = { periods: dayPeriods[day] };
          _.merge(newPeriod, periodTemplate);
          table[day].push(newPeriod);
        }
      }
    });
    return table;
  }

  handleClick(name) {
    return e => {
      switch (name) {
        case "add":
          this.setState({add:true});
          break;
      }
    };
  }

  onUpdate(assignment){
  }

  handleScheduleChange(){

  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes, record, waiting, onWaiting, onRegister } = this.props;
    const { value, add,show } = this.state;
    const showAssinment = this.state.assignment.map(aasign=>(
      <Grid
        key={aasign._id}
        className= {classes.assignment}
        container
        item
        direction="row"
        alignItems="center"
        justify="center"
        spacing={16}
      >
        <Grid item xs={11}>
          <Button
            disabled={waiting}
            variant="contained"
            color="primary"
            fullWidth
            onClick={()=>{
              this.setState({show:true,showAssinment:aasign});
            }}
          >
          <Grid
              container
              item
              direction="row"
              alignItems="center"
              spacing={16}
            >
              <Grid item style={{ flexGrow: 1, margin: 10 }}>
                <Typography className={classes.textColor}>{"موضوع: " + aasign.title}</Typography>
              </Grid>
              <Grid item style={{ flexGrow: 1, margin: 10 }}>
                <Typography className={classes.textColor}>{"تاریخ تحویل: " + persian.toPersian(jMoument(aasign.deadline.substr(0,10),"YYYY-MM-DD").format("jYYYY/jM/jD"))}</Typography>
              </Grid>
              <Grid item style={{ flexGrow: 1, margin: 10 }}>
                <Typography className={classes.textColor}>{"متن تمرین: " + persian.toPersian(aasign.description.substr(0,20)) + "..."}</Typography>
              </Grid>
            </Grid>
          </Button>
        </Grid>
        <Grid item xs={1}>
          <IconButton onClick={this.onDelete(aasign._id)}>
            <Delete />
          </IconButton>
        </Grid>
      </Grid>
    ));
    return (
      <React.Fragment>
        <Tabs
          value={value}
          onChange={this.handleChange}
          className={classes.tab}
          indicatorColor="secondary"
          textColor="inherit"
          centered
        >
          <Tab className={classes.tabItem} label="ارسال تمرین" />
          <Tab className={classes.tabItem} label="ثبت حضور و غیاب" />
          <Tab className={classes.tabItem} label="برنامه کلاسی" />
        </Tabs>
        {value === 0 && (
          <div style={{ padding: 32 }}>
            <Grid
              container
              className={classes.root}
              direction="column"
              alignItems="center"
              spacing={16}
            >
              <Grid
                container
                item
                direction="row"
                alignItems="stretch"
                spacing={16}
              >
                <Grid item style={{ flexGrow: 1, marginTop: 16 }}>
                  <Button
                    disabled={waiting}
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={this.handleClick("add")}
                  >
                    {waiting && (
                      <CircularProgress
                        className={classes.buttonProgress}
                        size={24}
                      />
                    )}
                    افزودن تمرین جدید
                  </Button>
                </Grid>
                {showAssinment}
                <Grid container item xs={12} justify="flex-end" alignItems='flex-end' spacing={16}>
                  <Dialog open={add} TransitionComponent={Transition} maxWidth={false}>
                    <ManagerAssignment onRegister={()=>{this.getAssignmentList()}} onCancel={()=>{this.setState({add:false})}} onError={this.onError} record={this.state.record} />
                  </Dialog>
                </Grid>
                <Grid container item xs={12} justify="flex-end" alignItems='flex-end' spacing={16}>
                  <Dialog open={show} TransitionComponent={Transition} maxWidth={false}>
                    <ShowAssinmentComponent onRegister={()=>{this.getAssignmentList()}} onCancel={()=>{this.setState({show:false})}} onError={this.onError} record={this.state.showAssinment} />
                  </Dialog>
                </Grid>
              </Grid>
            </Grid>
          </div>
        )}
        {value === 1 &&
          (<Absence
            record={record}
            waiting={waiting}
            onWaiting={onWaiting}
            onRegister={onRegister}
          />)
        }
        {value === 2 &&
          <Grid
            container
            direction="column"
            alignItems="stretch"
          >
            <Grid item style={{ flexGrow: 1, marginTop: 16 }}>
              <ScheduleTable
                scheduleList={this.state.timeTable}
                title={""}
                backgroundColor="#11ff118f"
                start={7}
                end={15}
                height={80}
                onChangeSchedule={this.handleScheduleChange}
              />
            </Grid>
          </Grid>
        }
      </React.Fragment>
    );
  }
}

CenteredTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  record: PropTypes.object.isRequired,
  waiting: PropTypes.bool.isRequired,
  onWaiting: PropTypes.func.isRequired,
  onRegister: PropTypes.func.isRequired
};

export default withStyles(styles)(CenteredTabs);
