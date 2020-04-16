import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import {
  Dialog,
  List,
  
  Typography,
  Grid,
  CircularProgress,
 
} from "@material-ui/core";

import configs from "../../configs";

import 'react-rater/lib/react-rater.css'

import ScheduleTable from './tabel';

const styles = theme => {
  return {
    root: {
      flexGrow: 1
    },
   list:{
     backgroundColor:"#fff",
    
   }
  };
};

class StudentTimeTabel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      waiting:false,
      data:[],
      timeTable: {},
      t:false
    };
    this.handleScheduleChange = this.handleScheduleChange.bind(this);
    this.createTimetable = this.createTimetable.bind(this)
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
        backgroundColor: backgroundColor ,
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


  handleScheduleChange(schedule) {

  }


 componentDidMount(){
  
  const req1 = axios.create({
    baseURL: configs.apiUrl,
    headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("access-token")
    }
});
this.setState({waiting: true}, () => {
    req1
        .get(`/student-timetable/${localStorage.getItem("student-id")}`)
        .then((response) => {
         console.log(response.data)
      this.setState({
        timeTable: this.createTimetable(response.data),
        t:true,
        waiting:false
      }); 
        })
        .catch(err => {
            
        });
      })
 }

  render() {
      const { classes } = this.props;
    return (
      <div style={{ padding: 32 }}>
      <Dialog open={this.state.waiting}>
            <div style={{padding:20, overflowX:'hidden', overflowY:'hidden'}}>
              <Typography variant='body1' align='center'>منتظر بمانید</Typography> 
              <CircularProgress style={{marginTop:20, marginBottom:20, marginLeft:30, marginRight:30}}/>
            </div>
          </Dialog>
      <Grid container direction="column" spacing={16}>
          <Grid item  xs={12}>
          {this.state.t ?
          <ScheduleTable
                scheduleList={this.state.timeTable}
                title="هنر"
                backgroundColor="#11ff118f"
                start={7}
                end={15}
                height={80}
                onChangeSchedule={this.handleScheduleChange}
              />
              : ''
          }
          </Grid>
      </Grid>
      </div>
    );
  }
}
StudentTimeTabel.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(StudentTimeTabel);

