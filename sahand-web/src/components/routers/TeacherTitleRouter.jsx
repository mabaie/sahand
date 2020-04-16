
import {Switch, Route} from 'react-router-dom';
import React, { Component } from 'react';
import {Grid,Typography,Button,Menu,MenuItem,List,ListItem,ListItemText,Collapse,MenuList}from '@material-ui/core';
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import configs from "../../configs";
import { withRouter } from "react-router-dom";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Fade from '@material-ui/core/Fade';

const styles = theme => {
  return {

    toolbardiv: {
      position:"relative",
      width:"100%",
      display: "flex",
      alignItems: "center"
    },
    courseselect: {
      position:"absolute",
      right: '24px',
      color:'#fff'
  },
  courseselectbtn: {
      color: '#fff'
  },
  u:{
    paddingTop:0,
    paddingBottom:0
  },
  title:{
    display:"inline-block"
  }
  };
};

class  TeacherTitleRouter extends Component {
  constructor(props) {
    super(props);
    this.state = {
    course:"",
    school:"",
    data:[],
    anchorEl: null
    };
   this.handleClickCourse=this.handleClickCourse.bind(this)
   this.handleClick = this.handleClick.bind(this)
   this.handleClose =this.handleClose.bind(this)
  }
 componentDidMount(){
  const req = axios.create({
    baseURL: configs.apiUrl,
    headers: {
      Authorization:  localStorage.getItem("access-token")
    }
  });
  req
    .get("/app/teacher/course-list")
    .then(res => {
    this.setState({data:res.data,
      school: res.data[0].schoolName,
      course: res.data[0].courseList[0] ? res.data[0].courseList[0].name: '',
    })
    })
    .catch(err => {
      
    }); 
 }

handleClickCourse(s,sId,c,cId){
  this.setState({
    course:c,
    school:s,
    anchorEl: null
  })
  localStorage.setItem(
    "school-id",
  sId
    )
    
  localStorage.setItem(
    "course-id",
  cId
    )
    this.props.history.push("/sahand/teacher/dashboard")  
}
handleClick(event){
  this.setState({ anchorEl: event.currentTarget });
};

handleClose(){
  this.setState({ anchorEl: null });
};
  render() {
      const { classes } = this.props;
      const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    return (
      
      <div className={classes.toolbardiv}>
      <Typography variant="title" color="inherit" className={classes.title} >  
      <Switch>
          <Route exact path="/sahand/teacher/dashboard/" component={()=>'خانه'} />
          <Route path="/sahand/teacher/dashboard/grade"  component={()=>'ثبت نمره‌ها'} />
          <Route path="/sahand/teacher/dashboard/students"  component={()=>'دانش‌آموزان'} />
          <Route path="/sahand/teacher/dashboard/sendAssignment"  component={()=>'ارسال تکلیف'} />
          <Route path='/sahand/teacher/dashboard/homeActivity' component={()=>'فعالیت در خانه'}/>
          <Route path='/sahand/teacher/dashboard/attendance' component={()=>'حضور و غیاب'} />
          <Route path='/sahand/teacher/dashboard/appointments' component={()=>'ملاقات‌ها'} />
          <Route path='/sahand/teacher/dashboard/encourages' component={()=>'تشویق‌ها'} />
          <Route path='/sahand/teacher/dashboard/news' component={()=>'اخبار'} />
          <Route path='/sahand/teacher/dashboard/gallery' component={()=>'گالری'}/>
          <Route path='/sahand/teacher/dashboard/messages' component={()=>'پیام‌ها'} />
          <Route path='/sahand/teacher/dashboard/teacherTimeTable' component={()=>'برنامه کلاسی'}/>
          <Route path="/sahand/teacher/dashboard/calendar"  component={()=>'تقویم اجرایی'} />
          <Route path='/sahand/teacher/dashboard/about' component={()=>'درباره مدرسه'}/>
          <Route path='/sahand/teacher/dashboard/magazine' component={()=>'انتشارات'} />
        </Switch>
      </Typography>
        
              <div className={classes.courseselect}>
            <Button
              aria-owns={open ? 'fade-menu' : undefined}
              aria-haspopup="true"
              onClick={(event)=>this.handleClick(event)}
              className={classes.courseselectbtn}
            >
              {this.state.course + " < " + this.state.school}
            </Button>
            <Menu  id="fade-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={this.handleClose}
          TransitionComponent={Fade}
        
          >
             <MenuList className={classes.u} > {
                this.state.data.map((item,i)=>
                
                  <ListItemWithCollapse key={i} handleClickCourse={this.handleClickCourse} data={item} />
               
                )
              }
              </MenuList>
            </Menu>
          </div>
      </div>
    
    
    );
  }
}
 TeacherTitleRouter.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};
export default withRouter(withStyles(styles)( TeacherTitleRouter));



class ListItemWithCollapse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open:false
    };
   
  }
  handleClick = () => {
    this.setState(state => ({ open: !state.open }));
  };

  render() {
    
    return (
      <React.Fragment>
        <ListItem button onClick={this.handleClick}>
        {this.state.open ? <ExpandLess /> : <ExpandMore />}
          <ListItemText inset primary={this.props.data.schoolName} />
          
        </ListItem>
        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
          <List style={{ padding: 0 }} component="div" disablePadding>
            {this.props.data.courseList.map((item,i)=>
              <ListItem onClick={(e)=>this.props.handleClickCourse(this.props.data.schoolName,this.props.data.ID,item.name,item.ID)} key={i} button >
              
              <ListItemText inset primary={item.name} />
            </ListItem>
              )}
          </List>
        </Collapse>
      </React.Fragment>
       
      
    );
  }
}
ListItemWithCollapse.propTypes = {
  handleClickCourse:PropTypes.func.isRequired,
  data:PropTypes.object.isRequired
};
