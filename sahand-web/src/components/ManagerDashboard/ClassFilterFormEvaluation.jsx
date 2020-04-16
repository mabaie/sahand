import React, { Component } from "react";
import { Grid, Slide, Button } from "@material-ui/core";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import { withRouter } from "react-router-dom";
import AdminAddingFormRouter from "../routers/AdminAddingFormRouter";
import persian from 'persian';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const styles = theme => {
  return {
    root: {
      margin: 16
    },
    primary: {
      margin: theme.spacing.unit
    }
  };
};
class ClassFilterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      add: false,
    };
    
  }
  

  
  render() {
    const { classes, waiting} = this.props;
    const { add } = this.state;
    return (
      <Grid className={classes.root} container justify="center">
        <Grid container item xs={12} justify="flex-end" alignItems='flex-end' spacing={16}>
        <Button  variant="contained" size="large" color="secondary" style={{marginRight:20}} >
          تایید نمرات
        </Button>
         
          
        </Grid>
        
      </Grid>
    );
  }
}
ClassFilterForm.propTypes = {
  classes: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  waiting: PropTypes.bool.isRequired,
  onError: PropTypes.func,
  onRegister: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
export default withRouter(withStyles(styles)(ClassFilterForm));
