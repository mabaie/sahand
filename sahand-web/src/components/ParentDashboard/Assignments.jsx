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

import ListItemWithCollapse from "./AssigmentsListItemWithCollapse"



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

class Assignments extends Component {
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
        .get(`/student-timetable/${localStorage.getItem("student-id")}`)
        .then((response) => {
          if(response.data.length>0){
          response.data.forEach((course)=>
          {
            req1
            .get(`/app/assignments/${course._id}`
            )
            .then((response) => {
              if(response.data.length>0){
                arr.push({coname:course.coname,
                  data:response.data
                })
              }
            this.setState({data:arr,waiting:false})
            })
            .catch(err => {
                
            });
    
          }
          )

        }else{
          this.setState({waiting:false})
        }   
           
        })
        .catch(err => {
            
        });
      })
 }

  render() {
      const { classes } = this.props;
    return (
      <div style={{ paddingTop: 5 }}>
      <Dialog open={this.state.waiting}>
            <div style={{padding:20, overflowX:'hidden', overflowY:'hidden'}}>
              <Typography variant='body1' align='center'>منتظر بمانید</Typography> 
              <CircularProgress style={{marginTop:20, marginBottom:20, marginLeft:30, marginRight:30}}/>
            </div>
          </Dialog>
      <Grid container direction="column" spacing={16}>
          <Grid item  xs={12}>
         {(this.state.data.length>0)?<List className={classes.list}>
        {
            this.state.data.map((e,i)=>
            
           <ListItemWithCollapse key={i} label={e.coname} data={e.data}/>
          
          )
        }
     </List>:<Typography variant='body1' align='center'>هیچ تمرینی ارسال نشده است.</Typography>
         }
          </Grid>
      </Grid>
      </div>
    );
  }
}
Assignments.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(Assignments);

