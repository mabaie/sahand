
import {Switch, Route} from 'react-router-dom';
import React, { Component } from 'react';
import {Typography,FormControl,NativeSelect,InputLabel,Grid,Input}from '@material-ui/core';
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import configs from "../../configs";
import { withRouter } from "react-router-dom";

const styles = theme => {
  return {

    toolbardiv: {
      position:"relative",
      width:"100%",
      display: "flex",
    },
    orderselect: {
      margin:5
  },
  orderselectbox: {
      backgroundColor: '#fff',
      minWidth: '150px'
  },
  orderselectlabel: {
      color: '#fff'
  },
  title:{
    display:"inline-block"
  }
  };
};

class  ParentTitleRouter extends Component {
  constructor(props) {
    super(props);
    this.state = {
     student:"",
     students:[]
    };
   this.handleChange=this.handleChange.bind(this)
  }
 componentDidMount(){
  const req = axios.create({
    baseURL: configs.apiUrl,
    headers: {
      Authorization:  localStorage.getItem("access-token")
    }
  });
  req
    .get("/app/parent/chiled-list")
    .then(res => {
    
    this.setState({students:res.data})
    })
    .catch(err => {
      
    }); 
 }
handleChange(e){
  this.setState({ student: e.target.value });
  localStorage.setItem(
    "student-id",
    e.target.value
    );
    this.props.history.push("/sahand/parent/dashboard");
}
  render() {
      const { classes } = this.props;
    return (
      
      <Grid className={classes.toolbardiv} container justify='space-between' alignItems='center'>
        <Grid item>
          <Typography variant="title" color="inherit" className={classes.title} >  
            <Switch>
                <Route exact path="/sahand/parent/dashboard/" component={()=>'خانه'} />
                <Route path="/sahand/parent/dashboard/assignments"  component={()=>'تکالیف'} />
                <Route path='/sahand/parent/dashboard/homeActivity' component={()=>'فعالیت در خانه'}/>
                <Route path='/sahand/parent/dashboard/attendanceReport' component={()=>'حضور و غیاب'} />
                <Route path='/sahand/parent/dashboard/addAppointment' component={()=>'درخواست ملاقات'} />
                <Route path='/sahand/parent/dashboard/encourages' component={()=>'تشویق‌ها'} />
                <Route path='/sahand/parent/dashboard/news' component={()=>'اخبار'} />
                <Route path='/sahand/parent/dashboard/gallery' component={()=>'گالری'}/>
                <Route path='/sahand/parent/dashboard/messages' component={()=>'پیام‌ها'} />
                <Route path='/sahand/parent/dashboard/studentTimeTable' component={()=>'برنامه کلاسی'}/>
                <Route path='/sahand/parent/dashboard/report' component={()=>'گزارش‌ها'}/>
                <Route path='/sahand/parent/dashboard/about' component={()=>'درباره مدرسه'}/>
                <Route path='/sahand/parent/dashboard/magazine' component={()=>'انتشارات'} />
                <Route path="/sahand/parent/dashboard/calendar"  component={()=>'تقویم اجرایی'} />
              </Switch>
            </Typography>
        </Grid>
        <Grid item>
        <FormControl className={classes.orderselect}>
                                    <InputLabel
                                        className={classes.orderselectlabel}
                                        shrink="shrink"
                                        htmlFor="age-native-label-placeholder">
                                    نام دانش آموز:
                                    </InputLabel>
                                    <NativeSelect
                                        className={classes.orderselectbox}
                                        value={this.state.order}
                                        onChange={(e) => this.handleChange(e)}
                                        input={<Input className = {
                                            classes.orderselectinput
                                        }
                                        name = "" id = "age-native-label-placeholder" />}>
                                       {
                                         (this.state.students.length>0)&&this.state.students.map((s,i)=>
                                         <option key={i} value={s._id}>{s.fname+" " + s.lname}</option>
                                         )
                                       }
                                        
                                    </NativeSelect>

                                </FormControl>

        </Grid>
            </Grid>
    
    
    );
  }
}
 ParentTitleRouter.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};
export default withRouter(withStyles(styles)( ParentTitleRouter));


