import React, {Component} from 'react';
import {
    Grid,
    Typography,
    FormControl,
    Dialog,
    CircularProgress,
    Select,
    TextField,
    FormLabel,
    MenuItem,
    IconButton,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from '@material-ui/core';
import SearchOutlined from "@material-ui/icons/SearchOutlined";
import Print from "@material-ui/icons/Print";
import persian from 'persian';
import ReactToPrint from 'react-to-print';
import jMoment from 'moment-jalaali';
import moment from 'moment';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from "prop-types";
import configs from '../../configs';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: "#fafafa",
        padding:"20px"
    },
    head:{
      backgroundColor:"#000",
     
    },
    headcell:{
      color:"#fff"
    },
})

class LargeMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            registerMin:new Date("2018-04-20"),
            registerMax:new Date(),
            birthMin:moment().subtract(10, 'years').toDate(),
            birthMax:new Date(),
            timeOption:0,

            birthMonth:0,
      
            cname: 0,
            grade: 0,
            selected: 0,
      
            loading: true,
            students:[]
        };
        this.grades = ["همه مقاطع"];
        this.cnames = [{cname:"همه کلاس‌ها",_id:"default"}];
        this.handleTextChange = this.handleTextChange.bind(this);
        this.registerMin = null;
        this.registerMax = null;
        this.handleChange = this.handleChange.bind(this)
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
            this.cnames = [{cname:"همه کلاس‌ها",_id:"default"}].concat( _.uniq(
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
            }));
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
            const query={
                register_min:this.state.registerMin.toISOString(),
                register_max:this.state.registerMax.toISOString(),
                birth_min:this.state.birthMin.toISOString(),
                birth_max:this.state.birthMax.toISOString(),
                birth_month:this.state.birthMonth,
                grade: this.state.grade==0 ? "default": this.grades[this.state.grade],
                cname: this.state.cname==0 ? "default": this.cnames[this.state.cname].cname
            };
            this.setState({loading:true})
            const req = axios.create({
                baseURL: configs.apiUrl,
                headers: {
                  "Content-Type": "application/json",
                  Authorization: localStorage.getItem("access-token")
                }
              });
              req
                .post("/student-report",query)
                .then(res => {
                    this.setState({students:res.data,loading:false})
                }).catch(err=>{
                  this.setState({loading:false})
                })
          }else {
            this.setState({
              [name]: e.target.value
            });
          }
        };
      }

    componentDidMount(){
        this.registerMin = $("#registerMin").persianDatepicker({
            format: "YYYY/MM/DD",
            minDate: new Date("2018-04-20"),
            maxDate: new Date(),
            toolbox: {
                calendarSwitch: {
                enabled: false
                }
            },
            dayPicker: {
                onSelect: date => {
                    this.setState({registerMin: moment(new Date(date)).startOf('day').toDate()})
                }
            }
        });
        this.registerMin.setDate((new Date("2018-04-20")).valueOf())
        this.registerMax = $("#registerMax").persianDatepicker({
            format: "YYYY/MM/DD",
            minDate: new Date("2018-08-01"),
            maxDate: new Date(),
            toolbox: {
                calendarSwitch: {
                enabled: false
                }
            },
            dayPicker: {
                onSelect: date => {
                    this.setState({registerMax: moment(new Date(date)).endOf('day').toDate()})
                }
            }
        });

        this.birthMin = $("#birthMin").persianDatepicker({
            format: "YYYY/MM/DD",
            minDate: new Date("1980-04-20"),
            maxDate: new Date(),
            toolbox: {
                calendarSwitch: {
                enabled: false
                }
            },
            dayPicker: {
                onSelect: date => {
                    this.setState({birthMin: moment(new Date(date)).startOf('day').toDate()})
                }
            }
        });
        this.birthMin.setDate(moment().subtract(10, 'years').toDate().valueOf())
        this.birthMax = $("#birthMax").persianDatepicker({
            format: "YYYY/MM/DD",
            minDate: new Date("1980-04-20"),
            maxDate: new Date(),
            toolbox: {
                calendarSwitch: {
                enabled: false
                }
            },
            dayPicker: {
                onSelect: date => {
                    this.setState({birthMax: moment(new Date(date)).endOf('day').toDate()})
                }
            }
        });

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
              this.grades = ["همه مقاطع","پیش‌دبستانی","اول","دوم","سوم","چهارم","پنجم","ششم"];
              /*this.grades.concat(_.uniq(this.classes.map(obj => obj.grade)).sort(
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
              ));*/
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
              this.setState({loading:false})
            })
            .catch(() => {
              this.handleError("خطای دسترسی به سرور");
            });
    }

    handleChange (name){
        return (event) => {
            this.setState({ [name]: event.target.value });
            if(name === 'timeOption'){
                switch(event.target.value){
                    case "0":
                        this.registerMin.setDate(new Date("2018-04-20").valueOf());
                        this.registerMax.setDate(new Date().valueOf());
                        this.setState({registerMin:new Date("2018-04-20"),registerMax: new Date()})
                        break;
                    case "1":
                        this.registerMin.setDate(moment().startOf('day').toDate().valueOf());
                        this.registerMax.setDate(moment().endOf('day').toDate().valueOf());
                        this.setState({registerMin:moment().startOf('day').toDate(),registerMax: moment().endOf('day').toDate()})
                        break;
                    case "2":
                        this.registerMin.setDate(moment().subtract(1, 'days').startOf('day').toDate().valueOf());
                        this.registerMax.setDate(moment().subtract(1, 'days').endOf('day').toDate().valueOf());
                        this.setState({registerMin:moment().subtract(1, 'days').startOf('day').toDate(),registerMax: moment().subtract(1, 'days').endOf('day').toDate()})
                        break;
                    case "3":
                        this.registerMin.setDate(moment().subtract(7, 'days').startOf('day').toDate().valueOf());
                        this.registerMax.setDate(new Date().valueOf());
                        this.setState({registerMin:moment().subtract(7, 'days').startOf('day').toDate(),registerMax: new Date()})
                        break;
                }
            }else if(name === 'birthOption'){
              switch(event.target.value){
                  case "0":
                      this.birthMin.setDate(new Date("2000-04-20").valueOf());
                      this.birthMax.setDate(new Date().valueOf());
                      this.setState({birthMin:new Date("2000-04-20"),birthMax: new Date()})
                      break;
              }
          }
        }
    }

   
    render() {
        const {
            grade,cname,loading
          } = this.state;
        const {classes} = this.props;
        return (
            <Grid>
                <Grid direction='row' alignItems="stretch" className={classes.root} spacing={16}>
                <Dialog open={loading}>
                  <div style={{padding:20, overflowX:'hidden', overflowY:'hidden'}}>
                    <Typography variant='body1' align='center'>منتظر بمانید</Typography> 
                    <CircularProgress style={{marginTop:20, marginBottom:20, marginLeft:30, marginRight:30}}/>
                  </div>
                </Dialog>
                    <Grid textalign="center" item="item" xs={2} style={{ flexGrow: 1}}>
                        <FormControl fullWidth className={classes.formControl}>
                            <FormLabel>بازه ثبت‌نام</FormLabel>
                            <Select
                                native
                                value={this.state.age}
                                onChange={this.handleChange('timeOption')}
                                inputProps={{
                                name: 'بازه ثبت‌نام',
                                }}
                            >
                                <option value={0}>همه تاریخ‌ها</option>
                                <option value={1}>امروز</option>
                                <option value={2}>دیروز</option>
                                <option value={3}>هفته گذشته</option>
                                <option value={4}>بازه زمانی</option>
                            </Select>
                            <TextField
                                inputProps={{
                                style: { textAlign: "center" }
                                }}
                                id={"registerMin"}
                                disabled={this.state.timeOption!=4}
                            />
                            <TextField
                                inputProps={{
                                style: { textAlign: "center" }
                                }}
                                id={"registerMax"}
                                disabled={this.state.timeOption!=4}
                            />
                        </FormControl>
                    </Grid>
                    <Grid textalign="center" item="item" xs={2} style={{ flexGrow: 1}}>
                        <FormControl fullWidth className={classes.formControl}>
                            <FormLabel>بازه تولد</FormLabel>
                            <Select
                                native
                                value={this.state.age}
                                onChange={this.handleChange('birthOption')}
                                inputProps={{
                                name: 'بازه تولد',
                                }}
                            >
                                <option value={0}>همه تاریخ‌ها</option>
                                <option value={4}>بازه زمانی</option>
                            </Select>
                            <TextField
                                inputProps={{
                                style: { textAlign: "center" }
                                }}
                                id={"birthMin"}
                                disabled={this.state.birthOption!=4}
                            />
                            <TextField
                                inputProps={{
                                style: { textAlign: "center" }
                                }}
                                id={"birthMax"}
                                disabled={this.state.birthOption!=4}
                            />
                        </FormControl>
                    </Grid>
                    <Grid textalign="center" item="item" xs={2} style={{ flexGrow: 1}}>
                        <FormControl fullWidth className={classes.formControl}>
                            <FormLabel>ماه تولد</FormLabel>
                            <Select
                                native
                                value={this.state.age}
                                onChange={this.handleChange('birthMonth')}
                                inputProps={{
                                name: 'ماه تولد',
                                }}
                            >
                                <option value={0}>همه ماه‌ها</option>
                                <option value={1}>فروردین</option>
                                <option value={2}>اردیبهشت</option>
                                <option value={3}>خرداد</option>
                                <option value={4}>تیر</option>
                                <option value={5}>مرداد</option>
                                <option value={6}>شهریور</option>
                                <option value={7}>مهر</option>
                                <option value={8}>آبان</option>
                                <option value={9}>آذر</option>
                                <option value={10}>دی</option>
                                <option value={11}>بهمن</option>
                                <option value={12}>اسفند</option>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item style={{ flexGrow: 1}} xs={2}>
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
                    <Grid item style={{ flexGrow: 1}} xs={1}>
                        <IconButton
                            onClick={this.handleTextChange("search")}
                            size="large"
                        >
                            <SearchOutlined />
                        </IconButton>
                    </Grid>
                    <Grid item style={{ flexGrow: 1}} xs={1}></Grid>
                    <Grid item style={{ flexGrow: 1}} xs={1}>
                      <ReactToPrint
                        trigger={() => <IconButton
                          onClick={this.handleTextChange("search")}
                          size="large"
                      >
                          <Print />
                      </IconButton>}
                        content={() => this.componentRef}
                        pageStyle= 'height: 100px;'
                      />
                    </Grid>
                </Grid>
                <Grid className={classes.root}>
                  <div dir='rtl' style={{width:"100%"}} ref={el => (this.componentRef = el)}>
                    {this.state.students.length!==0?
                    <Table>
                      <TableHead className={classes.head}>
                        <TableRow>
                            <TableCell align="right"><Typography className={classes.headcell} variant="body1">نام</Typography></TableCell>
                            <TableCell align="right"><Typography className={classes.headcell} variant="body1">نام خانوادگی</Typography></TableCell>
                            <TableCell align="right"><Typography className={classes.headcell} variant="body1">نام پدر</Typography></TableCell>
                            <TableCell align="right"><Typography className={classes.headcell} variant="body1">شماره ملی</Typography></TableCell>
                            <TableCell align="right"><Typography className={classes.headcell} variant="body1">تاریخ تولد</Typography></TableCell>
                            <TableCell align="right"><Typography className={classes.headcell} variant="body1">پایه</Typography></TableCell>
                            <TableCell align="right"><Typography className={classes.headcell} variant="body1">تاریخ آخرین ثبت‌نام</Typography></TableCell>
                            <TableCell align="right"><Typography className={classes.headcell} variant="body1">آخرین سال تحصیلی</Typography></TableCell>
                        </TableRow>
                      </TableHead>
                        <TableBody>
                        {this.state.students.map(s => (
                            <TableRow key={s._id}>
                            <TableCell align="right"><Typography variant="body1" className={classes.items}>{s.fname}</Typography></TableCell>
                            <TableCell align="right"><Typography variant="body1" className={classes.items}>{s.lname}</Typography></TableCell>
                            <TableCell align="right"><Typography variant="body1" className={classes.items}>{s.faname}</Typography></TableCell>
                            <TableCell align="right"><Typography variant="body1" className={classes.items}>{persian.toPersian(s.userName)}</Typography></TableCell>
                            <TableCell align="right"><Typography variant="body1" className={classes.items}>{persian.toPersian(jMoment(s.birthday).format('jYYYY/jM/jD'))}</Typography></TableCell>
                            <TableCell align="right"><Typography variant="body1" className={classes.items}>{s.grade}</Typography></TableCell>
                            <TableCell align="right"><Typography variant="body1" className={classes.items}>{persian.toPersian(jMoment(s.modified_at).format('HH:mm jYYYY/jM/jD'))}</Typography></TableCell>
                            <TableCell align="right"><Typography variant="body1" className={classes.items}>{persian.toPersian(
                              s.hasOwnProperty('academic_year')? jMoment(s.academic_year.map(p=>{return p.year}).sort()[0]).jYear()+'-'+(jMoment(s.academic_year.map(p=>{return p.year}).sort()[0]).jYear()+1):'ثبت‌نام نشده')}</Typography></TableCell>
                        </TableRow>
                        ))}
                        </TableBody>
                    </Table>:
                    <Typography fullWidth textAlign='center'>موردی یافت نشد!</Typography>
                    }
                  </div>
                </Grid>
            </Grid>
        );
    }
}

LargeMenu.propTypes = {
    classes: PropTypes.object.isRequired
};
export default withStyles(styles)(LargeMenu);