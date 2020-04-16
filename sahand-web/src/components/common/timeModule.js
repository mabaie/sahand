/*
props list:
   submit:(schoolObject)=>{},
    DefaultColor:'#9357DF',
    submitTextColor:'#ffffff',
    fontFamily:'tahoma'
*/
import React from "react";
import PropTypes from "prop-types";
//import ReactDOM from 'react-dom';
import { withStyles } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';

import $ from 'jquery';

//import Arrow from "./ui-icons_444444_256x240.png";

// import 'jquery-ui/themes/base/core.css';
// import 'jquery-ui/themes/base/theme.css';
// import 'jquery-ui/themes/base/selectable.css';

import '../../assets/css/core.css'
import '../../assets/css/theme.css'
import '../../assets/css/selectable.css'

// const fildWidth = 300;
// const DefaultColor='#9357DF';
// const submitTextColor='#ffffff';
// const fontFamily='tahoma';

var styles = theme => ({
  columnStyle: {
    display: "flex",
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent:'center',
    opacity: 0.7,
    borderRadius:10,
    width:"100%",
  },
  button: {
    position:'absolute',
    button:0,
    right:0,
    alignItems: 'center',
    justifyContent:'center',
    width:20,
    height:20,
    minHeight:10,
    boxShadow: '0 0px 0px 0px rgba(255, 105, 135, .3)',
  },
});

class TimeModule extends React.Component {
  constructor(props) {
		super(props);
    this.state={
      disabled:this.props.disabled|| false,
      backgroundColor:this.props.backgroundColor,
      height:(this.props.height*this.getHeightFromPeriod(this.props.period)),
      title:this.props.title,
      start:(this.props.height*this.getStartMinFromPeriod(this.props.period)),
      period:{start:this.props.period.start,end:this.props.period.end},
      day:this.props.day,
      firstPriod:this.props.period
    }
    this.day=this.props.day
    this.fixWidth=this.props.fixWidth
    this.minHeightComp=this.props.height/4
    
  }
  convertToPersianNumber(input){
    var persianDigits = "۰۱۲۳۴۵۶۷۸۹";
    var persianMap = persianDigits.split("");
      return input.replace(/\d/g,function(m){
          return persianMap[parseInt(m)];
      });
  }

  getStartMinFromPeriod(period){
    return parseInt(period.start.substr(3,2))/60
  }
  getStartHourFromPeriod(period){
    return parseInt(period.start.substr(0,2))
  }
  getHeightFromPeriod(period){
    var x= parseInt(period.start.substr(0,2))+parseInt(period.start.substr(3,2))/60
    var y= parseInt(period.end.substr(0,2))+parseInt(period.end.substr(3,2))/60
    return y-x
  }
  getStart(top){
    return Math.floor(top/this.minHeightComp)*this.minHeightComp+Math.floor(top/(4*this.minHeightComp))*(this.fixWidth*0.015)
  }
  getColumn(left){
    return Math.floor(left/this.fixWidth)*this.fixWidth*1.015
  }
  getHeight(height){
    return Math.floor(height/this.minHeightComp)*this.minHeightComp+Math.floor(height/(5*this.minHeightComp))*(this.fixWidth*0.015)
  }
  setDragChengePeriod(top,left){
    var hInit=parseInt(this.state.firstPriod.start.substr(0,2))

    var hs=parseInt(this.state.period.start.substr(0,2))
    var ms=parseInt(this.state.period.start.substr(3,2))

    var he=parseInt(this.state.period.end.substr(0,2))
    var me=parseInt(this.state.period.end.substr(3,2))

    var elaps=he*60+me-hs*60-ms

    var dm=Math.floor((top-Math.floor(top/(4*this.minHeightComp))*(this.fixWidth*0.015))/this.minHeightComp)
    hs=hInit+Math.floor(15*dm/60)
    ms=(15*dm)%60
    ms=Math.abs((ms<0)?ms+60:ms)

    he=hs+Math.floor((ms+elaps)/60)
    me=(hs*60+ms+elaps)%60
    me=Math.abs((me<0)?me+60:me)

     this.setState({
       period:{
        start:String("00" + hs).slice(-2)+':'+String("00" + ms).slice(-2),
        end:String("00" + he).slice(-2)+':'+String("00" + me).slice(-2)
       },
       day:(this.day-Math.round(1.015*left/this.fixWidth)),
    })
    //Math.floor(left/this.fixWidth)*this.fixWidth*1.015
    //
  }

  setResizeChengePeriod(height){
    var hs=parseInt(this.state.period.start.substr(0,2))
    var ms=parseInt(this.state.period.start.substr(3,2))

    var elaps=15*Math.floor((height-Math.floor(height/(5*this.minHeightComp))*(this.fixWidth*0.015))/this.minHeightComp)

    var he=hs+Math.floor((ms+elaps)/60)
    var me=(hs*60+ms+elaps)%60
    me=Math.abs((me<0)?me+60:me)

    var {period}=this.state
    period.end=String("00" + he).slice(-2)+':'+String("00" + me).slice(-2)
  }

    componentDidMount() {
        // Every React component has a function that exposes the
        // underlying DOM node that it is wrapping. We can use that
        // DOM node, pass it to jQuery and initialize the plugin.

        // You'll find that many jQuery plugins follow this same pattern
        // and you'll be able to pass the component DOM node to jQuery
        // and call the plugin function.

        // So, get the DOM note first,
        //const node = ReactDOM.findDOMNode(this);
        const node =this.element
        // ... and store the jQuery element reference.
        this.$node = $(node);

        this.$node.parent().css({position: 'relative'});

        this.$node.draggable({
          disabled: this.state.disabled,
          opacity: 0.35,
          drag: ( event, ui )=> {
            ui.position.left=this.getColumn(ui.position.left)
            ui.position.top=this.getStart(ui.position.top)
            this.setDragChengePeriod(ui.position.top,ui.position.left);
          },
          stop:( event, ui )=> {
            this.setDragChengePeriod(ui.position.top,ui.position.left);
            this.props.onChange(this.state.period,this.state.day)
          }
        });
        this.$node.resizable({
          disabled: this.state.disabled,
          minWidth:this.fixWidth,
          maxWidth:this.fixWidth,
          minHeight:this.minHeightComp,
          classes:{
            "ui-resizable-se": "ui-icon ui-icon-grip-solid-horizontal",
          },
          resize:( event, ui )=> {
            ui.size.height=this.getHeight(ui.size.height)
            var tempState=this.state;
            tempState.height = ui.size.height
            this.setResizeChengePeriod(ui.size.height)
          },
          stop:( event, ui )=> {
            this.setResizeChengePeriod(ui.size.height)
            this.props.onChange(this.state.period,this.state.day)
          }
        });
    }

    render() {
	//var xxx=false
      const { classes } = this.props;
        return (
          <div id="draggable" className={classes.columnStyle} style={{backgroundColor:this.state.backgroundColor,position:'absolute',height:this.state.height,top:this.state.start}} ref={(element) => {this.element = element }}>
            <Typography style={{position:'absolute',top:0,width:"100%",color:'black'}} align='center'>{this.convertToPersianNumber(this.state.title)}</Typography>
            {(this.state.height>=3*this.minHeightComp)?
              <Typography style={{position:'absolute',top:this.minHeightComp,width:"100%",color:'black'}} align='center'>{this.convertToPersianNumber(this.state.period.start)+' - '+this.convertToPersianNumber(this.state.period.end)}</Typography>
              :<div/>
            }
            {(!this.state.disabled)?
              <Button variant='fab' onClick={()=>{this.props.delete();}} className={classes.button} style={{backgroundColor:this.state.backgroundColor}}>
                <DeleteIcon  style={{color:"black",width:15,height:15,margin:0}} />
              </Button>:<div/>
          }
		{/*(xxx)?<img src={Arrow}/> :<div/>*/}
          </div>
        );
    }

    componentWillUnmount() {
        // Clean up the mess when the component unmounts
        this.$node.draggable('destroy');
        this.$node.resizable('destroy');
    }
}

TimeModule.propTypes = {
  period:PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
  backgroundColor:PropTypes.string.isRequired,
  height:PropTypes.number.isRequired,
  fixWidth:PropTypes.number.isRequired,
  title:PropTypes.string.isRequired,
  day: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  delete:PropTypes.func.isRequired,
  classes:PropTypes.object.isRequired
};

export default withStyles(styles)(TimeModule);
