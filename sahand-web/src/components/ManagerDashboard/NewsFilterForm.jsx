import React, { Component } from "react";
import { Grid, Dialog, Slide, IconButton } from "@material-ui/core";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Delete from '@material-ui/icons/Delete';
import Add from '@material-ui/icons/Add';
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
class NewsFilterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      add: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  handleChange(e) {
    this.setState({ text: persian.toPersian(e.target.value) });
  }
  handleClick(name) {
    switch (name) {
      case "search":
        return () => {
          this.props.onChange(
            {title : (this.state.text === "" ? "default" : this.state.text)}
          );
          this.setState({text: ""});
        };
      case "add":
        return () => {
          this.setState({ add: true });
        };
    }
  }
  handleClose() {
    this.props.onRegister();
    this.setState({add: false});
  }
  render() {
    const { classes, waiting} = this.props;
    const { add } = this.state;
    return (
      <Grid className={classes.root} container justify="center">
        <Grid container item xs={12} justify="flex-end" alignItems='flex-end' spacing={16}>
          <IconButton onClick={this.props.onDelete}>
            <Delete />
          </IconButton>
          <IconButton
            disabled={waiting}
            size="small"
            onClick={this.handleClick("add")}
          >
          <Add />
          </IconButton>
          <Dialog open={add} TransitionComponent={Transition} maxWidth={false}>
            <AdminAddingFormRouter onRegister={this.handleClose} onCancel={this.handleClose} onError={this.props.onError}/>
          </Dialog>
        </Grid>
        
      </Grid>
    );
  }
}
NewsFilterForm.propTypes = {
  classes: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  waiting: PropTypes.bool.isRequired,
  onError: PropTypes.func,
  onRegister: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
export default withRouter(withStyles(styles)(NewsFilterForm));
