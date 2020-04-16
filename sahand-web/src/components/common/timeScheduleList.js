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

import $ from 'jquery';

// import 'jquery-ui/themes/base/core.css';
// import 'jquery-ui/themes/base/theme.css';
// import 'jquery-ui/themes/base/selectable.css';

import '../../assets/css/core.css'
import '../../assets/css/theme.css'
import '../../assets/css/selectable.css'

var styles = theme => ({
  columnStyle: {
    display: "flex",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    opacity: 0.7,
    borderRadius:10,
    // width:"100%",
    margin:"0.1%"
  }
});

class WeekScheduler extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      height:this.props.height,
      title:this.props.title,
      backgroundColor:this.props.backgroundColor
    }
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
        const node=this.element
        // ... and store the jQuery element reference.
        this.$node = $(node);

        this.$node.draggable({
          helper: "clone",
          start:( event, ui )=> {
            this.startLeft=ui.position.left,
            this.starttop=ui.position.top
          },
          stop:( event, ui )=> {
            
            this.props.onChenge
            (
              ui.position.left-this.startLeft,
              ui.position.top-this.starttop
            )
          }
        });
    }
    convertToPersianNumber(input){
      var persianDigits = "۰۱۲۳۴۵۶۷۸۹";
      var persianMap = persianDigits.split("");
        return input.replace(/\d/g,function(m){
            return persianMap[parseInt(m)];
        });
    }
    render() {
      const { classes } = this.props;
        return (
          <div id="sortable" className={classes.columnStyle} style={{color:'black',backgroundColor:this.state.backgroundColor, height:this.state.height}} 
          ref={(element) => {this.element = element }}
          >
            {'درس '+this.convertToPersianNumber(this.state.title)}
          </div>
        );
    }
}

WeekScheduler.propTypes = {
  height: PropTypes.number.isRequired,
  title:PropTypes.string.isRequired,
  backgroundColor:PropTypes.string.isRequired,
  onChenge:PropTypes.func.isRequired,
  classes:PropTypes.object.isRequired
};
      

export default withStyles(styles)(WeekScheduler);
