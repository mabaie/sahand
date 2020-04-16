import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import green from "@material-ui/core/colors/green";
import PopMessages from "../common/PopMessages";
import Typography from "@material-ui/core/Typography";
import {QuillDeltaToHtmlConverter} from 'quill-delta-to-html';
import configs from '../../configs';

const persianAlphaNum = /^[\u0621-\u0628\u062A-\u063A\u0641-\u0642\u0644-\u0648\u064E-\u0651\u0655\u067E\u0686\u0698\u06A9\u06AF\u06BE\u06CC\s\u06F0-\u06F90-9]+$/;

const styles = theme => {
  return {
    primary: {
      marginTop: theme.spacing.unit,
      marginLeft: theme.spacing.unit * 2,
      margigRight: theme.spacing.unit * 2
    },
    buttonProgress: {
      color: green[500],
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: -12,
      marginLeft: -12
    }
  };
};
class NewsDetailPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      errors: {
        title: false,
        news: false
      },
      waiting: false,
      changed: false,
      messageOpen: false,
      messageType: "error",
      message: "",
      htmlNews:'<div/>'
    };
    this.handleMessageClose = this.handleMessageClose.bind(this);
   
  }
  componentDidMount() {
    const { record } = this.props;
    var options = {
      debug: 'info',
      modules: {
        toolbar: false
      },
      readOnly: true
    };


    const req1 = axios.create({
      baseURL: configs.apiUrl,
      headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("access-token")
      }
  });
  this.setState({waiting: true}, () => {
      req1
          .get(`/app/parent/school/news/${record._id}`)
          .then((response) => {
            /*this.quill = new Quill(`#container-${record._id}`,options);
            this.quill.format("directrion", "rtl");
            this.quill.format("align", "right");
            this.quill.format("size", "Normal");
            this.quill.format("font", "IRANSans");
            this.quill.setContents(response.data.news);*/
            
            let cfg = {};
            
            let converter = new QuillDeltaToHtmlConverter(response.data.news.ops, cfg);
            converter.beforeRender(function (groupType, data) {
              data.ops.forEach(e => {
                console.log('e is',e)
                 if (e.insert.type=='image') {
                  console.log('attributes is',e.attributes)
                  e.attributes['width']= "98%" ;
                 }
              })
            })
            this.setState({ title: record.title, changed: false,htmlNews: converter.convert()});
            console.log('html:',response.data.news.ops)
          })
          .catch(err => {
              
          });
        })
    
        
    
  }
 
  handleMessageClose(event, reason) {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ messageOpen: false, waiting: false, changed: true }, () => {
      if (this.state.messageType === "success") {
        this.props.onRegister();
      }
    });
  }
  
  render() {
    const { classes, record } = this.props;
    const {
      messageOpen,
      messageType,
      message,
      title,
    } = this.state;
    return (
     
        <Grid container direction="column" spacing={16}>
          <PopMessages
            open={messageOpen}
            variant={messageType}
            message={message}
            onClose={this.handleMessageClose}
          />
          <Grid item className={classes.primary} xs={12}>
            
            <Typography gutterBottom variant="body1" >
            عنوان خبر:
          </Typography>
          <Typography variant="title">
            {title}
          </Typography>
          </Grid>
          <Grid item className={classes.primary} xs={12}>
            
            <Typography variant="body2">شرح خبر</Typography>
            <br />
            <div>
              <td dangerouslySetInnerHTML={{__html: this.state.htmlNews}} />
            </div>
          </Grid>
        </Grid>
   
    );
  }
}
NewsDetailPanel.propTypes = {
  classes: PropTypes.object.isRequired,
  record: PropTypes.object.isRequired,
  waiting: PropTypes.bool.isRequired,
  onWaiting: PropTypes.func.isRequired,
  onRegister: PropTypes.func.isRequired
};
export default withStyles(styles)(NewsDetailPanel);
