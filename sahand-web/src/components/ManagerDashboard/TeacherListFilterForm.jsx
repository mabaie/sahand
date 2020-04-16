import React, { Component } from "react";
import { Grid, TextField, Dialog, Slide, IconButton } from "@material-ui/core";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import SearchOutlined from '@material-ui/icons/SearchOutlined';
import Delete from '@material-ui/icons/Delete';
import PersonAdd from '@material-ui/icons/PersonAdd';
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
class FilterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      text_lname: "",
      add: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  handleChange(name) {
    return (e)=>{
      this.setState({ [name]: persian.toPersian(e.target.value) });
    }
  }

  handleClick(name) {
    switch (name) {
      case "search":
        return () => {
          this.props.onChange(
            {ID:this.state.text === "" ? "default" : persian.toEnglish(this.state.text)}
          );
          this.setState({text: ""});
        };
      case "searchEnter": 
        return (e) => {
          if (e.key === 'Enter') {
            this.props.onChange(
              {ID:this.state.text === "" ? "default" : persian.toEnglish(this.state.text)}
            );
            this.setState({text: ""});
          }
        };
        case "searchLName":
        return () => {
          this.props.onChange(
            {lastname:this.state.text_lname === "" ? "default" : this.state.text_lname}
          );
          this.setState({text: ""});
        };
      case "searchLNameEnter": 
        return (e) => {
          if (e.key === 'Enter') {
            this.props.onChange(
              {lastname:this.state.text_lname === "" ? "default" : this.state.text_lname}
            );
            this.setState({text: ""});
          }
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
         <Grid container item xs={6} spacing={16} alignItems='flex-end'>
          <Grid container item xs={6} spacing={16} alignItems='flex-end'>
            <TextField
              disabled={waiting}
              className={classes.primary}
              label="شماره ملی"
              onChange={this.handleChange('text')}
              onKeyPress= {this.handleClick("searchEnter")}
              value={this.state.text}
            />
            <IconButton
              disabled={waiting}
              onClick={this.handleClick("search")}
              size="small"
            >
            <SearchOutlined />
            </IconButton>
          </Grid>
          <Grid container item xs={6} spacing={16} alignItems='flex-end'>
            <TextField
              disabled={waiting}
              className={classes.primary}
              label="نام خانوادگی"
              onChange={this.handleChange('text_lname')}
              onKeyPress= {this.handleClick("searchLNameEnter")}
              value={this.state.text_lname}
            />
            <IconButton
              disabled={waiting}
              onClick={this.handleClick("searchLName")}
              size="small"
            >
            <SearchOutlined />
            </IconButton>
          </Grid>
        </Grid>
        <Grid container item xs={6} justify="flex-end" alignItems='flex-end' spacing={16}>
          <IconButton onClick={this.props.onDelete}>
            <Delete />
          </IconButton>
          <IconButton
            disabled={waiting}
            size="small"
            onClick={this.handleClick("add")}
          >
          <PersonAdd />
          </IconButton>
          <Dialog open={add} TransitionComponent={Transition} maxWidth='md'>
            <AdminAddingFormRouter onRegister={this.handleClose} onCancel={this.handleClose} onError={this.props.onError}/>
          </Dialog>
        </Grid>
        
      </Grid>
    );
  }PersonAdd
}
FilterForm.propTypes = {
  classes: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  waiting: PropTypes.bool.isRequired,
  onError: PropTypes.func,
  onRegister: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
export default withRouter(withStyles(styles)(FilterForm));
