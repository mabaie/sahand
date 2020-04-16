import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import {
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
} from "@material-ui/core";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import configs from "../../configs";
import jMoment from 'moment-jalaali';
import Rater from 'react-rater'
import 'react-rater/lib/react-rater.css'
import persian from 'persian'

 
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
      data:[]
    };
   this.findEncourage=this.findEncourage.bind(this)
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
        .get(`/student-timetable/${localStorage.getItem("student-id")}`)
        .then((response) => {
          
          response.data.forEach((course)=>
          {
            req1
            .post(`/app/parent/encourage-report`,
            {
              studentID: localStorage.getItem("student-id"),
              courseID: course._id
            }
            )
            .then((response) => {
            arr.push({coname:course.coname,
                       data:response.data
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
findEncourage(arr){
  function findel(el) {
    if (el.hasOwnProperty('encourages')) {

        return el

    }
}

return arr.some(findel)


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
            <Typography variant="body1" className={classes.headcell} >نام درس</Typography>
            </TableCell>
            

            <TableCell align="right" >
            <Typography variant="body1" className={classes.headcell} >میانگین تشویق ها</Typography>
            </TableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
        {
            this.state.data.map((e,i)=>
            
            (this.findEncourage(e.data)) ?
           <ListItemWithCollapse key={i} label={e.coname} data={e.data}/>
          :''
          )
        }
          
        </TableBody>
      </Table> 
      </Paper>
          
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
            <TableCell>عنوان</TableCell>
            <TableCell align="right">توضیح</TableCell>
            <TableCell align="right">امتیاز</TableCell>
            <TableCell align="right">تاریخ</TableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
          {this.props.data.map((row,i) => 
            row.hasOwnProperty('encourages') ?
            <TableRow key={i}>
              <TableCell component="th" scope="row">
                
                <Typography variant="body1">{row.title}</Typography>
              </TableCell>
              <TableCell align="right">
              <Typography variant="body1">{row.encourages[0].description}</Typography>
              </TableCell>
              <TableCell align="right">{
              <Rater interactive={false} total={4} rating={row.encourages[0].star} />
       
                }</TableCell>
              <TableCell align="right">
              <Typography variant="body1">{persian.toPersian(jMoment(row.encourages[0].date).format('HH:mm jYYYY/jM/jD'))}</Typography>
              
              </TableCell>
              
             
            </TableRow>
            :''
  )}
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
  data:PropTypes.array.isRequired
};
