
import React, { Component } from "react";
var momentj = require('jalali-moment');

import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import Delete from "@material-ui/icons/Delete";
import joi from "joi-browser";
import PopMessages from "../common/PopMessages";
import configs from "../../configs";
import axios from "axios";
import moment from "moment";
import Calendar from '../common/Calender';

//const persianAlphaNum = /^[\u0621-\u0628\u062A-\u063A\u0641-\u0642\u0644-\u0648\u064E-\u0651\u0655\u067E\u0686\u0698\u06A9\u06AF\u06BE\u06CC\s\u06F0-\u06F90-9]+$/;

const styles = theme => {
  return {
    root: {
    
      padding: theme.spacing.unit
    },
    calendar: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      height: "100%",
      width: "100%"
    },
    primary: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      marginTop: theme.spacing.unit,
      marginButtom: theme.spacing.unit
    }
  };
};
class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate:(new Date()).valueOf(),
      event: "",
      eventerr: true,
      dayEventsID: 0,
      waiting: true,
      dayEvents: [],
      messageOpen: false,
      message: "",
      messageType: "error",
      monthEvents :[],
      dates:[
                {
                  year: 1397,
                  month: 8,
                  day: 1
              }]
    };
    this.monthEvents=[]
    this.handleClick = this.handleClick.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleMessageClose = this.handleMessageClose.bind(this);
    this.getEvents = this.getEvents.bind(this);
    this.checkError = this.checkError.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.findHighlightedDays =this.findHighlightedDays.bind(this)
    this.clickDate = this.clickDate.bind(this)
   this.changeDate = this.changeDate.bind(this)
  }
  componentDidMount() {
    this.getEvents()
  }
  
  findHighlightedDays(data) {
    var arr = []
    data.forEach((day) => {
      if(day.events.length>0)
        arr.push({
            year: momentj(day.date).jYear(),
            month: momentj(day.date).jMonth(),
            day: momentj(day.date).jDate()
        })
    })

    this.setState({dates: arr})

}
   getEvents(date,cb) {
     if(date){
      const req = axios.create({
        baseURL: configs.apiUrl,
                  headers: {
                      "Content-Type": "application/json",
                      Authorization: localStorage.getItem("access-token")
                  }
      });
      
      req
        .get(`/calendar/events/${date}`)
        .then(res => {
          
          
        this.findHighlightedDays(res.data)
        this.monthEvents= res.data
        
        this.setState(
          {
            dayEventsID: 0,
            dayEvents: [],
            waiting: false
          },
          cb
        );
      })
        .catch(err => {
          this.setState({
            messageOpen: true,
            messageType: "error",
            message: "خطای سرور"
          });
        });
     }else{
    const req = axios.create({
      baseURL: configs.apiUrl,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("access-token")
                }
    });
    
    req
      .get(`/calendar/events/${this.state.selectedDate}`)
      .then(res => {
        
      this.findHighlightedDays(res.data)
          this.monthEvents= res.data
          const dayEvents = this.getSelectedDateEvents();
          console.log(dayEvents)
          this.setState(
            {
              dayEventsID: dayEvents.id,
              dayEvents: dayEvents.events,
              waiting: false
            },
            cb
          );
        })
      .catch(err => {
        this.setState({
          messageOpen: true,
          messageType: "error",
          message: "خطای سرور"
        });
      });
    }
   }
   handleDelete(event, id) {
    return e => {
      const req = axios.create({
        baseURL: configs.apiUrl,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("access-token")
                }
      });
      this.setState({ waiting: true }, () => {
        console.log(event);
        req
          .delete(`/calendar/event/${this.state.dayEventsID}`, {
            data: { event: event }
          })
          .then(() => {
            this.getEvents();
          })
          .catch(err => {
            this.setState({
              messageOpen: true,
              messageType: "error",
              message: "خطای سرور"
            });
          });
      });
    };
   }
   getSelectedDateEvents(date) {
     if(date){
      const selectedDate = moment(new Date(date))
      const idx = this.monthEvents.findIndex(event => {
        const eventDate = moment(new Date(event.date));
         return selectedDate.isSame(eventDate, "day");
      });
      if (idx !== -1) {
        console.log(this.monthEvents[idx]._id);
        return {
          id: this.monthEvents[idx]._id,
          events: this.monthEvents[idx].events
        };
      }
      return { id: 0, events: [] };
     }
     else{
    const selectedDate = moment(new Date(this.state.selectedDate))
    const idx = this.monthEvents.findIndex(event => {
      const eventDate = moment(new Date(event.date));
       return selectedDate.isSame(eventDate, "day");
    });
    if (idx !== -1) {
      console.log(this.monthEvents[idx]._id);
      return {
        id: this.monthEvents[idx]._id,
        events: this.monthEvents[idx].events
      };
    }
    return { id: 0, events: [] };}
   }
///////////////////////////////////////////////////////add

  handleClick() {
    if (this.checkError()) {
      const { selectedDate, event } = this.state;
      const req = axios.create({
        baseURL: configs.apiUrl,
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("access-token")
      }
      });
      console.log(selectedDate);
      this.setState({ waiting: true }, () => {
        req
          .post("/calendar/event", {
            date: new Date(selectedDate).toISOString(),
            event: event
          })
          .then(() => {
            this.getEvents(undefined,() => {
              this.setState({
                messageOpen: true,
                messageType: "success",
                message: "رویداد با موفقیت افزوده شد"
              });
            });
          })
          .catch(err => {
            this.setState({
              messageOpen: true,
              messageType: "error",
              message: "خطای سرور"
            });
          });
      });
    }
  }

  ////////////////////////////////////////////
  checkError() {
    if (this.state.eventerr) {
      this.setState({
        messageOpen: true,
        messageType: "error",
        message: "رویدا معتبر نمی‌باشد"
      });
      return false;
    }
    return true;
  }
  //////////////////////////////////////////////
  handleTextChange(e) {
    const value = e.target.value;
    this.setState({ event: value, eventerr: this.validate(value) });
  }
  /////////////////////////////////////////////////////////
  validate(value) {
    return (
      joi
        .string()
        .trim()
        .min(3)
        .max(100)
        .validate(value).error !== null
    );
  }

  //////////////////////////////////////
  handleMessageClose(event, reason) {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ messageOpen: false, waiting: false });
  }
////////////////////////////////////////////////

  clickDate(y,m,d){
    var date=momentj(y + "/" + (m +1) + "/" + d , 'jYYYY/jM/jD').format('YYYY-M-D')
   console.log(new Date(this.state.selectedDate))
   this.setState({selectedDate:(new Date(date)).valueOf()})
   const dayEvents = this.getSelectedDateEvents((new Date(date)).valueOf());
        console.log(dayEvents)
        this.setState(
          {dayEvents: dayEvents,
            dayEventsID: dayEvents.id,
            dayEvents: dayEvents.events,
            waiting: false
          }
        );
  }
///////////////////////////////////////////////////

  changeDate(y,m){
     var date =momentj(y + "/" + (m+1) + "/" + 1 , 'jYYYY/jM/jD').format('YYYY-M-D HH:mm:ss')
     this.getEvents((new Date(date)).valueOf())
    console.log(date)
  }

  /////////////////////////////////////
  render() {
    const { classes } = this.props;
    const {
      waiting,
      dayEvents,
      dayEventsID,
      event,
      eventerr,
      messageType,
      messageOpen,
      message
    } = this.state;
    return (
      <div style={{ padding: 16 }}>
        <PopMessages
          open={messageOpen}
          variant={messageType}
          message={message}
          onClose={this.handleMessageClose}
        />
        
        <Paper>
          <Grid className={classes.root} container direction='row-reverse' justify='center' spacing={16}>
            <Grid item style={{minWidth:'350px'}} xs={4}>
                <Calendar 
                item={this.state.dates}
                clickDate={this.clickDate}
                changeDate={this.changeDate}
                />
            </Grid>
            <Grid item container direction="column" xs={8} alignItems="stretch">
              <Grid
                container
                direction="row"
                alignItems="flex-end"
                justify="space-between"
                spacing={16}
              >
                <Grid item style={{ flexGrow: 5 }}>
                  <TextField
                    disabled={waiting}
                    error={eventerr}
                    value={event}
                    className={classes.root}
                    onChange={this.handleTextChange}
                    fullWidth
                  />
                </Grid>
                <Grid item style={{ flexGrow: 1 }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={this.handleClick}
                    disabled={waiting}
                    fullWidth
                  >
                    افزودن
                  </Button>
                </Grid>
              </Grid>
              <Grid item>
                <List>
                  {dayEvents.map((event, id) => {
                    return (
                      <ListItem key={id}>
                        <ListItemIcon>
                          <ChevronLeft />
                        </ListItemIcon>
                        <ListItemText>{event}</ListItemText>
                        <ListItemSecondaryAction>
                          <IconButton
                            onClick={this.handleDelete(event, dayEventsID)}
                          >
                            <Delete />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    );
                  })}
                </List>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
        {/* <Paper style={{ marginTop: 16 }}>
          <Typography variant="title" className={classes.primary}>
            رویدادهای ماه
          </Typography>
        </Paper> */}
      </div>
    );
  }
}
Events.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(Events);
