import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import {Button, 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow ,
  Dialog,
  Paper,
  Collapse,
  Typography,
  Grid,
  CircularProgress,
  TextField
} from "@material-ui/core";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import configs from "../../configs";
var momentj = require('jalali-moment');

import moment from 'moment'
import Rater from 'react-rater'
import 'react-rater/lib/react-rater.css'

 
const styles = theme => {
  return {
    root: {
      flexGrow: 1
    },
    list:{
      backgroundColor:"#fff",
     
    },
    head:{
      backgroundColor:"#000",
     
    },
    headcell:{
  color:"#fff"
    }
   
  };
};

class Encourages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      waiting:true,
      data:[],
      editArr:[],
      today:new Date()
    };
   this.handleRate=this.handleRate.bind(this)
  this.handleChangeText= this.handleChangeText.bind(this)
  this.handleBtnClick=this.handleBtnClick.bind(this)
  }

handleBtnClick(){
  
    const req1 = axios.create({
      baseURL: configs.apiUrl,
      headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("access-token")
      }
  });
  
  
   
this.state.editArr.forEach((reqData,i)=>
{
   console.log(reqData)
  this.setState({waiting: true}, () => {
    
  req1
      .post(`/app/teacher/encourage`,
      reqData
      )
          .then((response) => {
           
         this.setState({waiting:false})
            
             
          })
          .catch(err => {
              
          });})
}
)
  

      
        
    
}  
handleChangeText(t,i,j){
console.log(this.state.data[i].encourages[j]._id)
console.log(this.state.editArr)
var arr=this.state.data
var eid =this.state.data[i].encourages[j]._id
var sid =this.state.data[i].id
var editArr=this.state.editArr
function findel(el1) {
  if (el1.encourageID === eid && el1.studentID===sid) {

      return el1

  }
}

if(this.state.data[i].encourages[j].hasOwnProperty('encourages') ){
  arr[i].encourages[j].encourages[0].description=t
  console.log('xxxxx',editArr.find(findel))
  if(editArr.find(findel)){
    var x=editArr.find(findel)
    var index=editArr.indexOf(x)
    editArr[index].description=t
  }else{
    editArr.push({
        encourageID: this.state.data[i].encourages[j]._id,
        studentID: this.state.data[i].id,
        courseID:localStorage.getItem("course-id"),
        star:this.state.data[i].encourages[j].encourages[0].star ,
        description:t
    })
  }
}else{
  Object.assign(arr[i].encourages[j],{encourages:[{
    star: 1,
    description: t,
    date: new Date(),
    coname: localStorage.getItem("course-id")
  }]})

  editArr.push({
    encourageID: this.state.data[i].encourages[j]._id,
    studentID: this.state.data[i].id,
    courseID:localStorage.getItem("course-id"),
    star:1,
    description:t
})
}

this.setState({data:arr,editArr:editArr})
}


handleRate(r,i,j){
    
var arr=this.state.data
var eid =this.state.data[i].encourages[j]._id
var sid =this.state.data[i].id
var elstar = this.state.data[i].encourages[j].hasOwnProperty('encourages') 
var editArr=this.state.editArr
function findel(el1) {
  if (el1.encourageID ===eid &&el1.studentID ===sid  ) {

      return el1

  }
}

if(elstar){
  arr[i].encourages[j].encourages[0].star=r
  if(editArr.some(findel)){
    var x=editArr.find(findel)
    var index=editArr.indexOf(x)
    editArr[index].star=r
  }else{
    editArr.push({
        encourageID: this.state.data[i].encourages[j]._id,
        studentID: this.state.data[i].id,
        courseID:localStorage.getItem("course-id"),
        star:r ,
        description:this.state.data[i].encourages[j].encourages[0].description
    })
  }
}else{
  Object.assign(arr[i].encourages[j],{encourages:[{
    star: r,
    description: "ثبت نشده",
    date: new Date(),
    coname: localStorage.getItem("course-id")
  }]})

  editArr.push({
    encourageID: this.state.data[i].encourages[j]._id,
    studentID: this.state.data[i].id,
    courseID:localStorage.getItem("course-id"),
    star:releaseEvents,
    description: "ثبت نشده"
})
}
this.setState({data:arr,editArr:editArr}) 
  
  }

 componentDidMount(){

  var arr=[]
  const req1 = axios.create({
    baseURL: configs.apiUrl,
    headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("access-token")
    }
});
this.setState({waiting: true}, () => {
    req1
    .post(`/app/teacher/student-list`,
    {
    courseID:localStorage.getItem("course-id")
    
})
        .then((response) => {
          console.log('ss',response.data)
          response.data.studentList.forEach((student)=>
          {
            req1
            .post(`/app/parent/encourage-report`,
            {
              studentID: student.ID,
              courseID: localStorage.getItem("course-id")
            }
            )
            .then((response) => {
              
            arr.push({name:student.firstName+" "+student.lastName,
                       encourages:response.data,
                       id:student.ID
            })
            
            this.setState({data:arr,waiting:false})
            })
            .catch(err => {
                
            });
    
          }
          )

            
           
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
          <Paper >
           <Table >
        <TableHead className={classes.head}>
          <TableRow>
          <TableCell align="right" >
            
            </TableCell>
            <TableCell align="right" >
            <Typography variant="body1" className={classes.headcell} >نام و نام خانوادگی</Typography>
            </TableCell>
            

            <TableCell align="right" >
            <Typography variant="body1" className={classes.headcell} >میانگین تشویق ها</Typography>
            </TableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
        {
            this.state.data.map((s,i)=>
            
           <ListItemWithCollapse key={i} index={i} handleChangeText={this.handleChangeText} handleRate={this.handleRate} label={s.name} data={s.encourages}/>
          
          )
        }
          
        </TableBody>
      </Table> 
      </Paper>
         
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
                                onClick={this.handleBtnClick}>

                                ثبت
                            </Button>
                        </Grid>
                    </Grid>
      </Grid>
      </div>
    );
  }
}
Encourages.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(Encourages);


class ListItemWithCollapse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open:false,
      avg:0
    };
   
  }
  handleClick = () => {
    this.setState(state => ({ open: !state.open }));
  };
componentDidMount(){
var total = 0;
var len=0

for(var i = 0; i < this.props.data.length; i++) {
  if(this.props.data[i].hasOwnProperty('encourages')){
    total += this.props.data[i].encourages[0].star 
    len+=1
  }
}

this.setState({avg:(total / len)})
}
  render() {
    
    return (
      <React.Fragment>
      <TableRow button onClick={this.handleClick}>
        <TableCell align="right" >
        {this.state.open ? <ExpandLess /> : <ExpandMore />}
            </TableCell>
        <TableCell align="right" >
            <Typography variant="body1"  >{this.props.label}</Typography>
            </TableCell>
            <TableCell align="right" >
            <Typography variant="body1"  >{this.state.avg}</Typography>
            </TableCell>
                
      </TableRow>
      {this.state.open && <TableRow>
        <TableCell colSpan={3}>
      <Collapse in={this.state.open} timeout="auto" unmountOnExit>
          
          <Table >
        <TableHead>
          <TableRow>
            <TableCell><Typography variant="body1"  >عنوان</Typography></TableCell>
            <TableCell align="right"><Typography variant="body1"  >توضیح</Typography></TableCell>
            <TableCell align="right"><Typography variant="body1"  >امتیاز</Typography></TableCell>
            <TableCell align="right"><Typography variant="body1"  >تاریخ</Typography></TableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
          {this.props.data.map((row,j) => 
            
            <TableRow key={j}>
              <TableCell component="th" scope="row">
                {row.title}
              </TableCell>
              <TableCell align="right">
              <TextField
                id="text"
                type="text"
                defaultValue={row.hasOwnProperty('encourages') ? row.encourages[0].description : ""}
                onChange={(e)=>this.props.handleChangeText(e.target.value,this.props.index,j)}
                disabled={row.hasOwnProperty('encourages') ? (!(momentj(row.encourages[0].date).format('jYYYY/jM/jD')===momentj(this.state.today).format('jYYYY/jM/jD'))) : false}
                fullWidth
                multiline
                InputLabelProps={{
                  shrink: true,
                }}
            />
              </TableCell>
              <TableCell align="right">{
              <Rater interactive={row.hasOwnProperty('encourages') ? (momentj(row.encourages[0].date).format('jYYYY/jM/jD')===momentj(this.state.today).format('jYYYY/jM/jD')) : true } onRate={({rating}) => {this.props.handleRate(rating,this.props.index,j)}} total={4} rating={row.hasOwnProperty('encourages') ? row.encourages[0].star : 0} />
       
                }</TableCell>
              <TableCell align="right">{row.hasOwnProperty('encourages') ? momentj(row.encourages[0].date).format('jYYYY/jM/jD') : ""}</TableCell>
              
             
            </TableRow>
            
  )}
  {/* row.hasOwnProperty('encourages')  */}
        </TableBody>
      </Table>
        </Collapse>
        </TableCell>
        </TableRow>}
</React.Fragment>

    );
  }
}
ListItemWithCollapse.propTypes = {
  label:PropTypes.string.isRequired,
  data:PropTypes.array.isRequired,
  index:PropTypes.number.isRequired,
  handleRate:PropTypes.func.isRequired
  ,handleChangeText:PropTypes.func.isRequired
};
