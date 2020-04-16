//ساعت خوب- ساعت شوروع و پایان تکلیف و مسواک زده یا خیر همه ی اینها تایید یا رد

import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

import{ Checkbox,Grid ,
  Typography ,
  Card ,
  CardActions ,
  CardContent ,
  Button,CircularProgress,TextField ,FormControlLabel ,Dialog } from '@material-ui/core';
 

import configs from "../../configs";

 
const styles = theme => {
  return {
    root: {
      flexGrow: 1,
      padding: 20
    },
   textField:{
     marginTop:20,
     marginBottom:20,
   }
  };
};

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sleep: "07:30",
      start: "07:30",
      end: "07:30",
      checkedA:false,
      dataList:[],
      reqList:[],
      waiting:false,
      open:false
    };
   this.handleButtons = this.handleButtons.bind(this)
   this.handleChange = this.handleChange.bind(this)
   this.getData = this.getData.bind(this)
   
  }
handleButtons(s){
  const req = axios.create({
    baseURL: configs.apiUrl,
    headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("access-token")
    }
});
  if(s==="accept"){
   
  this.setState({
      waiting: true
  }, () => {
      req
          .post(`/app/parent/home-activity/${localStorage.getItem("student-id")}`, this.state.reqList)
          .then((response) => {
             
             this.getData()
             this.setState({waiting:false})
          })
          .catch(err => {
            this.setState({waiting:false})
          });
  });

  }
  else{
    this.setState({dataList:[]})
    this.getData()
  }
}

 
 handleChange(e,id){
   
   let arr = this.state.reqList;
   let index = arr.find((a)=>{
     return a.id===id
   })
   console.log(index)
   if(index){
    index.content=e.toString();
   }else{
    arr.push({
      id:id,
      content:e.toString()
     })
   }
   console.log(arr)
  this.setState({reqList:arr})
 }
getData(){
  const req = axios.create({
    baseURL: configs.apiUrl,
    headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("access-token")
    }
});
    this.setState({
      waiting: true
  }, () => {
      req
          .get(`/app/parent/home-activity-list/${localStorage.getItem("student-id")}`)
          .then((response) => {
             this.setState({dataList:response.data,waiting:false,open:true})
          })
          .catch(err => {
            this.setState({waiting:false})
          });
  });
}
componentDidMount(){
this.getData()
}

  render() {
      const { classes } = this.props;
    return (
      
          <Grid className={classes.root} container justify="center" direction='column' >
       <Dialog open={this.state.waiting}>
            <div style={{padding:20, overflowX:'hidden', overflowY:'hidden'}}>
              <Typography variant='body1' align='center'>منتظر بمانید</Typography> 
              <CircularProgress style={{marginTop:20, marginBottom:20, marginLeft:30, marginRight:30}}/>
            </div>
          </Dialog>

<Card className={classes.card}>
      <CardContent>
        {
          this.state.dataList.length?
          this.state.dataList.map((item,i)=>
          
            (item.type==="time")?

         <Grid item key={i}>
          <Typography gutterBottom variant="body2" >
         {item.title}
          </Typography>
          <TextField
        id="time"
        label="Alarm clock"
        type="time"
        label=""
        defaultValue={item.hasOwnProperty('content') ? item.content : "10:30"}
        onChange={(e)=>this.handleChange(e.target.value,item._id)}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          step: 60, // 1 min
        }}
      />
</Grid>
:(
  (item.type==="boolean")?
  <Grid item key={i} > 
  <FormControlLabel
    control={
      <Checkbox
    defaultChecked={item.hasOwnProperty('content') ?((item.content==="true") ? true : false) : false}
    onChange={(e)=>this.handleChange(e.target.checked,item._id)}
    
  />
    }
    label={item.title}
  />
  </Grid>
  :
 
  <Grid item key={i} >
  <Typography gutterBottom variant="body2" >
 {item.title}
  </Typography>
  <TextField
    id="text"
    type="text"
    defaultValue={item.hasOwnProperty('content') ? item.content : ""}
    onChange={(e)=>this.handleChange(e.target.value,item._id)}
    className={classes.textField}
    fullWidth
    multiline
    InputLabelProps={{
      shrink: true,
    }}
/>
</Grid>
)
          ):<Typography variant='body1' align='center'>موردی برای گزارش از طرف مدرسه ثبت نشده است.</Typography>          
        }
      
      </CardContent>
      <CardActions>
        <Button onClick={()=>this.handleButtons("accept")} variant="contained" color="secondary">تایید</Button>
        <Button onClick={()=>this.handleButtons("cancel")} variant="contained" color="default">رد</Button>
      </CardActions>
    </Card>

        </Grid>
     
    );
  }
}
Settings.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(Settings);
