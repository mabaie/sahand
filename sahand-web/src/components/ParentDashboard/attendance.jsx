import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import {
  Dialog,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow ,
  Typography,
  Grid,
  CircularProgress,
 
} from "@material-ui/core";
import jMoment from 'moment-jalaali';
import configs from "../../configs";

import 'react-rater/lib/react-rater.css';

import persian from 'persian'

const styles = theme => {
  return {
    root: {
      flexGrow: 1
    },
    head:{
      backgroundColor:"#000",
     
    },
    headcell:{
  color:"#fff"
    }
  };
};

class Attendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      waiting:true,
      data:[]
    };
   
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
        .get(`/app/parent/attendance/${localStorage.getItem("student-id")}`)
        .then((response) => {
          if(response.data.length==0)
          this.setState({waiting:false}) 
          response.data.forEach((absent)=>
          {   
            Object.keys(absent).forEach((e,i)=>
            {
                
              if(e!=="Name" && e!=="ID"){
                
                absent[e].forEach((s)=>
                {
                  
                  arr.push({name:absent.Name,
                  date:e,
                  period:s.sessionPeriod
                   })
                  this.setState({data:arr,waiting:false}) 
                })
              }

            }
            )
            
          }
          )
        })
        .catch(err => {
          this.setState({waiting:false}) 
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
      {(this.state.data.length)?
        <Grid container direction="column" spacing={16}>
        <Grid item  xs={12}>
        <Paper className={classes.root}>
        <Table >
      <TableHead className={classes.head}>
        <TableRow>
          
          <TableCell align="right" >
          <Typography variant="body1" className={classes.headcell} >نام درس</Typography>
          </TableCell>
          
          <TableCell align="right" >
          <Typography variant="body1" className={classes.headcell} >تاریخ غیبت</Typography>
          </TableCell>
          
          <TableCell align="right" >
          <Typography variant="body1" className={classes.headcell} >بازه زمانی</Typography>
          </TableCell>
          
        </TableRow>
      </TableHead>
      <TableBody>
        {
          this.state.data.map((el,i)=>
          <TableRow>
          <TableCell>
          <Typography variant="body1">{el.name}</Typography>
            
          </TableCell>
          <TableCell>
          <Typography variant="body1">{persian.toPersian(jMoment(el.date).format('jYYYY/jM/jD'))}</Typography>
            
          </TableCell>
          <TableCell>
          <Typography variant="body1">{persian.toPersian(el.period.start) + " تا " + persian.toPersian(el.period.end)}</Typography>
            
          </TableCell>
      </TableRow>  
          )
        }
        
      </TableBody>
    </Table>
    </Paper>
        </Grid>
    </Grid>:<Typography variant='body1' align='center'>هیچ غیبتی ثبت نشده است.</Typography>
      }
      </div>
    );
  }
}
Attendance.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(Attendance);

