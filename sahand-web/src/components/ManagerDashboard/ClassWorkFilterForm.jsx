import React, { Component } from "react";
import { Grid, FormControl,FormLabel,Select,MenuItem,IconButton } from "@material-ui/core";
import SearchOutlined from "@material-ui/icons/SearchOutlined";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import configs from '../../configs';


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

      coname: "",
      teacher: 0,
      cname: 0,
      grade: 0,
      periods: {},
      capacity: 0,
      selected: 0,
      conameerr: true,
      data: {},

      errorMessages: [],
      loading: true,
      schedule: false,
      reload: false,
      exportData: false
    };
    this.grades = ["همه مقاطع"];
    this.cnames = [{cname:"همه کلاس‌ها",_id:"default"}];
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  handleTextChange(name) {
    return e => {
      if (name === "grade") {
        if(e.target.value==0){
          this.cnames = [{cname:"همه کلاس‌ها",_id:"default"}];
          this.setState(
            {
              grade: e.target.value,
              cname: 0,
              selected: 0,
              reload: true
            }
            );
          return;
        }
        console.log(name)
        this.cnames = _.uniq(
          this.classes
            .filter(el => el.grade === this.grades[e.target.value])
            .map(obj => {return {cname:obj.cname,_id:obj._id}})
        ).sort((a,b)=>{
          if(a.cname>b.cname){
            return 1;
          }else if(a.cname<b.cname){
            return -1;
          }else{
            return 0;
          }
        });
        this.setState(prevState => {
          const selected = this.classes.findIndex(el => {
            return (
              el.cname === this.cnames[0].cname &&
              el.grade === this.grades[e.target.value]
            );
          });
          return {
            grade: e.target.value,
            cname: 0,
            selected: selected,
            reload: true
          };
        });
      } else if (name === "cname") {
        this.setState(prevState => {
          const selected = this.classes.findIndex(
            el =>
              el.cname === this.cnames[e.target.value].cname &&
              el.grade === this.grades[prevState.grade]
          );
          return { cname: e.target.value, selected: selected, reload: true };
        });
      }else if(name === "search"){
        console.log(this.state.cname)
        this.props.onChange({classID:this.cnames[this.state.cname]._id})
      }else {
        this.setState({
          [name]: e.target.value
        });
      }
    };
  }

  componentDidMount() {
    const req = axios.create({
      baseURL: configs.apiUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("access-token")
      }
    });
    req
      .get("/classes")
      .then(res => {
        this.classes = res.data;
        this.grades = this.grades.concat(_.uniq(this.classes.map(obj => obj.grade)).sort(
          (x, y) => {
            switch (x) {
              case "پیش‌دبستانی": return true;
              case "اول":
                return y === "پیش‌دبستانی";
              case "دوم":
                return y === "پیش‌دبستانی" || y === "اول";
              case "سوم":
                return y === "پیش‌دبستانی" || y === "اول" || y === "دوم";
              case "چهارم":
                return y === "پیش‌دبستانی" || y !== "پنجم" && y !== "ششم";
              case "پنجم":
                return y === "پیش‌دبستانی" || y !== "ششم";
              case "ششم":
                return false;
            }
          }
        ));
        this.cnames = this.cnames.concat( _.uniq(
          this.classes
            .filter(e => e.grade === this.grades[this.state.grade])
            .map(obj => {return {cname:obj.cname,_id:obj._id}})
        ).sort((a,b)=>{
          if(a.cname>b.cname){
            return 1;
          }else if(a.cname<b.cname){
            return -1;
          }else{
            return 0;
          }
        }));
        console.log('calass name and id',this.cnames)
        this.forceUpdate();
      })
      .catch(() => {
        this.handleError("خطای دسترسی به سرور");
      });
  }
  
  render() {
    const { classes, waiting} = this.props;
    const {
      grade,cname
    } = this.state;
    return (
      <Grid className={classes.root} container justify="center">
        <Grid container direction="row" alignItems="stretch" spacing={16}>
            <Grid item style={{ flexGrow: 1}}>
            <FormControl required fullWidth>
                <FormLabel>پایه</FormLabel>
                <Select
                  value={grade}
                  onChange={this.handleTextChange("grade")}
                  fullWidth
                  required
                >
                  {this.grades.map((grade, index) => {
                    return (
                      <MenuItem key={index} value={index}>
                        {grade}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item style={{ flexGrow: 1}}>
            <FormControl required fullWidth>
              <FormLabel>کلاس</FormLabel>
                <Select
                  value={cname}
                  onChange={this.handleTextChange("cname")}
                  fullWidth
                  required
                >
                  {this.cnames.map((cname, index) => {
                    return (
                      <MenuItem key={index} value={index}>
                        {cname.cname}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item style={{ flexGrow: 1}}>
              <IconButton
                disabled={waiting}
                onClick={this.handleTextChange("search")}
                size="small"
              >
                <SearchOutlined />
              </IconButton>
            </Grid>
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
  // onRegister: PropTypes.func.isRequired,
  // onDelete: PropTypes.func.isRequired,
};
export default withRouter(withStyles(styles)(ClassFilterForm));
