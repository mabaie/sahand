import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";
import PopMessages from "../common/PopMessages";
import Button from "@material-ui/core/Button";
import green from "@material-ui/core/colors/green";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import axios from "axios";
import configs from "../../configs";
import {QuillDeltaToHtmlConverter} from 'quill-delta-to-html';

const styles = theme => {
  return {
    root: {
      padding: theme.spacing.unit * 2,
      margin: theme.spacing.unit * 2,
      marginTop:theme.spacing.unit * 10,
      width:"95%"
    },
    primary: {
      maring: theme.spacing.unit,
      marginTop: theme.spacing.unit,
    },
    buttonProgress: {
      color: green[500],
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: -12,
      marginLeft: -12
    },
    avatar: {
      width: 60,
      height: 60
    }
  };
};
class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // data states
      name: "",
      about: {},
      logoFile: "",
      logoSrc: "",
      //errors
      errors: {
        name: false
      },
      // control States
      messageOpen: false,
      message: "",
      messageType: "error",
      waiting: false,
      changed: false,
      htmlNews:'<div/>'
    };
    this.quill = null;
    this.handleMessageClose = this.handleMessageClose.bind(this);
    
  }
  componentDidMount() {
    var options = {
      debug: 'info',
      modules: {
        toolbar: false
      },
      readOnly: true
    };
    // this.quill = new Quill("#editor",options);
    // this.quill.format("directrion", "rtl");
    // this.quill.format("align", "right");
    // this.quill.format("font", "IRANSans");
    // this.quill.format("size", "Normal");
    
    const req = axios.create({
      baseURL: configs.apiUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("access-token")
      }
    });
    req.get(`/app/parent/school/about/${localStorage.getItem("student-id")}`).then(res => {
      const data = res.data;
      // this.quill.setContents(data.about);
      let cfg = {};
            
    let converter = new QuillDeltaToHtmlConverter(data.about.ops, cfg);
    converter.beforeRender(function (groupType, data) {
      data.ops.forEach(e => {
        console.log('e is',e)
          if (e.insert.type=='image') {
          console.log('attributes is',e.attributes)
          e.attributes['width']= "98%" ;
          }
      })
    })
      this.setState({
        name: data.name,
        logoSrc: configs.publicUrl + data.avatar,
        changed: false,
        htmlNews: converter.convert()
      });
    });
  }

  
  handleMessageClose(event, reason) {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ messageOpen: false, waiting: false, changed: true });
  }
  render() {
    const { classes } = this.props;
    const {
      messageOpen,
      messageType,
      message,
      name,
      logoSrc
    } = this.state;
    return (
      <div styles={{ padding: 16 }}>
        <Grid container direction="column" alignItems="center" spacing={16}>
          <PopMessages
            open={messageOpen}
            variant={messageType}
            message={message}
            onClose={this.handleMessageClose}
          />
          <Paper className={classes.root}>
            <Grid item container direction="row" justify="center">
              {logoSrc && (
                <Avatar
                  component={Button}
                  className={classes.avatar}
                  src={logoSrc}
                  alt="جای لوگو"
                  type="file"
                />
              )}
              
            </Grid>
            <Grid item>
            <Typography variant="body1">نام مدرسه:</Typography>
            <Typography variant="body1">{name}</Typography>
            </Grid>
            <Grid item className={classes.primary} xs={12}>
              <br />
              <Typography variant="body1">درباره‌ی مدرسه:</Typography>
              <br />
              <div>
                <td dangerouslySetInnerHTML={{__html: this.state.htmlNews}} />
              </div>
            </Grid>
            
          </Paper>
        </Grid>
      </div>
    );
  }
}
About.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(About);
