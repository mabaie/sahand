import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow ,
  ListItem,
  Collapse,
  Typography,
  IconButton,
  Paper,
  ListItemText ,
  Divider,
  Dialog
} from "@material-ui/core";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import configs from "../../configs";
import jMoment from 'moment-jalaali';
import 'react-rater/lib/react-rater.css'
import Image from "@material-ui/icons/Image";
import Movie from "@material-ui/icons/LocalMovies";
import CloseIcon from "@material-ui/icons/Close"
import Doc from "@material-ui/icons/Note";
import persian from 'persian';
 
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


class ListItemWithCollapse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open:[],
    openColl:false
    };
   
  }
  handleClick(i) {
    var arr= this.state.open
    arr[i]=!this.state.open[i]
    this.setState({open:arr});
  };
  handleClickColl = () => {
    this.setState(state => ({ openColl: !state.openColl }));
  };
  handleClickFile(name) {
    return e => {
      
      
          window.open(configs.publicUrl + name, "_blank")
         
     
    };
  }
  render() {
    const  classes  = this.props.classes;
    return (
      <React.Fragment>

      <ListItem button onClick={this.handleClickColl}>
      
      <ListItemText inset primary={ this.props.label} />
      {this.state.openColl ? <ExpandLess /> : <ExpandMore />}
    </ListItem>
    <Divider />
    <Collapse in={this.state.openColl} timeout="auto" unmountOnExit>
    <div>
    {this.props.data.length>0 ?
      <Paper className={classes.root}>
          <Table >
        <TableHead className={classes.head}>
          <TableRow>
            <TableCell align="right" >
            <Typography variant="body1" className={classes.headcell} >عنوان</Typography>
            </TableCell>
            
            <TableCell align="right" >
            <Typography variant="body1" className={classes.headcell} >تاریخ تحویل</Typography>
            </TableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
   
          {this.props.data.map((row,i) => 
            <React.Fragment key={i}>
            <TableRow button onClick={()=>this.handleClick(i)} >
              <TableCell align="right"> {row.title}</TableCell>
              <TableCell align="right">{persian.toPersian(jMoment(row.deadline).format('jYYYY/jM/jD'))}</TableCell>
              
             
            </TableRow>
            {this.state.open[i] &&
          <Dialog
            fullScreen
            open={this.state.open[i]}
            keepMounted="keepMounted"
            onClose={() => {
              this.state.open[i]=false
              this.forceUpdate();
            }}
          >
           <IconButton
              style={{
                position:"absolute",
                left:"10px",
                top:"10px"
              }}
              color="secondary" onClick={() => {
              this.state.open[i]=false
              this.forceUpdate();
            }}>
              <CloseIcon />
            </IconButton> 
            <Table style={{marginTop:60}}>
            <TableRow align="center" 
              style={{ backgroundColor:'black'}}>
              <TableCell align="center" 
                style={{color:'white'}} > {row.title}</TableCell>
              <TableCell align="center" style={{color:'white'}}
                >{persian.toPersian(jMoment(row.deadline).format('jYYYY/jM/jD'))}</TableCell>
            </TableRow>
            <TableRow align="center" >
           <TableCell colSpan={4}>
            <Typography variant='title' >جزییات:</Typography> 
            <Typography variant='p' >{row.description}</Typography> 
            
            <br/>
            {
              (row.hasOwnProperty('assignment')) &&
            <Typography variant='title' >پیوست‌ها:</Typography> 
            }
            {
              (row.hasOwnProperty('assignment')) &&
                row.assignment.map(ass=>(
                <IconButton color="secondary" onClick={this.handleClickFile(ass)}>
                  {
                    (this.state.fileName==="movie")?
                    <Movie />:
                    (this.state.fileName==="image")?
                    <Image />:
                    (this.state.fileName==="doc")?
                    <Doc />:''
                  }

            {(ass.length>0 && ass.substr(ass.length-3,3)==="mp4")? <Movie /> :
        (ass.length>0 && ass.substr(ass.length-3,3)==="jpg" || ass.substr(ass.length-3,3)==="png")? <Image /> :
        (ass.length>0 && ass.substr(ass.length-3,3)==="pdf")? <Doc /> : <Movie /> 
                }   
            </IconButton>
              ))
            }
          </TableCell>
            </TableRow>
            </Table>
            </Dialog>
            }
            </React.Fragment>
          
  )}
    </TableBody>
      </Table>
     
      </Paper>
      : <Typography variant='body1' align="center" >هیچ تمرینی بارگزاری نشده است</Typography>}
</div>
    </Collapse>
</React.Fragment>
       

    );
  }
}
ListItemWithCollapse.propTypes = {
  label:PropTypes.string.isRequired,
  data:PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(ListItemWithCollapse);

