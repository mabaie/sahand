// import React, {Component} from 'react';
// import {Grid, Tabs, Tab, Paper} from '@material-ui/core';
// import {withStyles} from '@material-ui/core/styles';
// import PropTypes from "prop-types";

// const styles = theme => ({
//     container: {
//         textAlign: 'right'
//     }

// });

// class RegisterGrades extends Component {
//     constructor(props) {
//         super(props);

//         this.state = {
            
//         }

       
//     }

    

//     render() {
//         const {classes} = this.props;
//         return (
//             <Paper style={{
//                     flexGrow: 1
//                 }}>
//                 <Grid className={classes.container} container spacing={24}>
//                     <Grid item xs={12}>
                    
//                     </Grid>
//                         </Grid>
                   
               
//             </Paper>
//         );
//     }
// }
// RegisterGrades.propTypes = {
//     classes: PropTypes.object.isRequired
// };
// export default withStyles(styles)(RegisterGrades);

import React, {Component} from 'react';
import {Paper,
    RadioGroup,
    Radio,
    Chip,
    Avatar,
    ListSubheader,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Input ,
    NativeSelect,
    InputLabel,
    FormControl,
    FormControlLabel,
    Select,
    MenuItem,
    Dialog,
    Typography,
    Grid,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    DialogTitle,
    DialogContent,
    DialogContentText,
    Button,
    DialogActions,
    IconButton,
    Icon,
    Collapse,
    ListItemSecondaryAction} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from "prop-types";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import SearchOutlined from "@material-ui/icons/SearchOutlined";

const styles = theme => ({
    container: {
        textAlign: 'right'
    },  
    head:{
        backgroundColor:"#000",
       
      },
    headcell:{
    color:"#fff"
      },
      margin: {
        margin: theme.spacing.unit,
      minWidth: 120
      }

});

class RegisterGrades extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedGrade:"",
            courseList:[],
            gradeList:[],
            classList:[],
            studentList:[],
            termList:[],
            activeTerm:{},
            term:"",
            selectedCourse:"",
            selectedClass:"",
            forReqArray:[]

        }

        this.grades = [];
        this.cnames = [];
        this.addToReqArray=this.addToReqArray.bind(this)
    }
    addToReqArray(element){
     var a=this.state.forReqArray
      function findreq(req) {
        return (
           req.term_id=== element.term_id &&
          
           req.student_id=== element.student_id &&
           req.course_id=== element.course_id &&
          req.title_id===element.title_id &&
          req.sub_title===element.sub_title) 
    }
    if(a.find(findreq)){
a[a.findIndex(findreq)]=element
    }else{
a.push(element)
    }
    
this.setState({forReqArray:a})
    }
registerAllNewgrades(){
  console.log(this.state.forReqArray)
}

    handleChange(event,name){
        if(name==="grade"){
            
            this.cnames = []
            this.classes = [
                {
                  "_id": "5c1f35e67dfe4919426b7c83",
                  "cname": "ابوریحان",
                  "year": "2018-03-20T20:30:00.000Z",
                  "grade": "دوم",
                  "capacity": 20,
                  "modified_at": "2018-12-23T07:14:46.839Z",
                  "school_id": "5bf96b8e4d5405146315ed86"
                },
                {
                  "_id": "5c0f9d4b7977a3532cb45a23",
                  "cname": "خوارزمی",
                  "year": "2018-03-20T20:30:00.000Z",
                  "grade": "دوم",
                  "capacity": 20,
                  "modified_at": "2018-12-11T11:19:39.277Z",
                  "school_id": "5bf96b8e4d5405146315ed86"
                },
                {
                  "_id": "5c0f96518d309939d82f8a41",
                  "cname": "جامی",
                  "year": "2018-03-20T20:30:00.000Z",
                  "grade": "سوم",
                  "capacity": 20,
                  "modified_at": "2018-12-11T10:49:53.139Z",
                  "school_id": "5bf96b8e4d5405146315ed86"
                },
                {
                  "_id": "5c0e8dc3b335053469767c91",
                  "cname": "تجربی",
                  "year": "2018-03-20T20:30:00.000Z",
                  "grade": "دوم",
                  "capacity": 20,
                  "modified_at": "2018-12-10T16:01:07.408Z",
                  "school_id": "5bf96b8e4d5405146315ed86"
                },
                {
                  "_id": "5bf97e62878a8f1839f7e0f4",
                  "cname": "خیام",
                  "year": "2018-03-21T00:00:00.000Z",
                  "grade": "چهارم",
                  "capacity": 25,
                  "modified_at": "2018-11-24T16:37:54.877Z",
                  "school_id": "5bf96b8e4d5405146315ed86"
                },
                {
                  "_id": "5bf97e62878a8f1839f7e0f9",
                  "cname": "دو خیام",
                  "year": "2018-03-21T00:00:00.000Z",
                  "grade": "اول",
                  "capacity": 25,
                  "modified_at": "2018-11-24T16:37:54.877Z",
                  "school_id": "5bf96b8e4d5405146315ed86"
                },{
                    "_id": "5bf97e62878a8f1839f7e1f2",
                    "cname": "2پیش‌دبستانی",
                    "year": "2018-03-21T00:00:00.000Z",
                    "grade": "پیش‌دبستانی",
                    "capacity": 25,
                    "modified_at": "2018-11-24T16:37:54.877Z",
                    "school_id": "5bf96b8e4d5405146315ed86"
                  }
              ]
              
         
        this.cnames = this.cnames.concat( _.uniq(
            this.classes
              .filter(e => e.grade === this.state.gradeList[event.target.value])
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
this.setState({studentList:[],classList:this.cnames,selectedGrade: event.target.value})
    //   this.setState({waiting: true}, () => {
    //     req
    //         .post(`/grade-course-list`,
    //         {
    //           grade:event.target.value
    //         })
    //         .then((response) => {
    //            console.log(response.data)
              
    //            this.setState({waiting:false,selectedGrade: event.target.value,courseList:response.data})
    //         })
    //         .catch(err => {
    //           console.log(err)
    //         });
            
    //       })
  
    //       this.setState({waiting: true}, () => {
    //         req
    //             .post(`/grading-type`,
    //             {
    //               grade:event.target.value
    //             })
    //             .then((response) => {
    //                console.log(response.data)
                  
    //                this.setState({waiting:false,type:response.data.type})
    //             })
    //             .catch(err => {
    //               console.log(err)
    //             });
                
    //           })
    /////////////////////////////////////////////
    // req
    //   .get(`/classes`)
    //   .then(res => {
    //     this.classes = res.data;
    //     this.grades = this.grades.concat(_.uniq(this.classes.map(obj => obj.grade)).sort(
    //       (x, y) => {
    //         switch (x) {
    //           case "پیش‌دبستانی": return true;
    //           case "اول":
    //             return y === "پیش‌دبستانی";
    //           case "دوم":
    //             return y === "پیش‌دبستانی" || y === "اول";
    //           case "سوم":
    //             return y === "پیش‌دبستانی" || y === "اول" || y === "دوم";
    //           case "چهارم":
    //             return y === "پیش‌دبستانی" || y !== "پنجم" && y !== "ششم";
    //           case "پنجم":
    //             return y === "پیش‌دبستانی" || y !== "ششم";
    //           case "ششم":
    //             return false;
    //         }
    //       }
    //     ));
    //     this.cnames = this.cnames.concat( _.uniq(
    //         this.classes
    //           .filter(e => e.grade === this.grades[this.state.grade])
    //           .map(obj => {return {cname:obj.cname,_id:obj._id}})
    //       ).sort((a,b)=>{
    //         if(a.cname>b.cname){
    //           return 1;
    //         }else if(a.cname<b.cname){
    //           return -1;
    //         }else{
    //           return 0;
    //         }
    //       }));
    //       console.log('calass name and id',this.cnames)
    //     })
    //     .catch(err => {
    //         console.log(err)
    //     });
    /////////////////////////////////////////////////////////////////////
        }
        else if(name==="class"){
          var carr=
          [
            {
              "_id": "5bf9886d1345ee2ce980dd65",
              "coname": "هدیه",
              "class_id": "5bf97e62878a8f1839f7e0f4",
          
              "periods": {
                "day0": [
                  {
                    "start": "07:45",
                    "end": "09:15"
                  }
                ],
                "day1": [
                  {
                    "start": "08:00",
                    "end": "10:00"
                  }
                ],
                "day3": [
                  {
                    "start": "07:45",
                    "end": "09:30"
                  },
                  {
                    "start": "11:00",
                    "end": "12:45"
                  }
                ],
                "day5": [
                  {
                    "start": "12:00",
                    "end": "14:30"
                  }
                ]
              },
          
              "modified_at": "2018-11-24T17:20:45.942Z",
          
              "students": [
                "5bfb05854e70ec54a9e13009",
                "5bfb00233412c424e3710afa",
                "5bf97d87878a8f1839f7e0f2"
              ],
          
              "attendance": {
                "2018-12-23T04:30:00.000Z": [
                  {
                    "period": 0,
                    "registerTime": "2018-12-23T06:06:12.669Z",
                    "present": [
                      "5bf97d87878a8f1839f7e0f2",
                      "5bfb00233412c424e3710afa"
                    ]
                  }
                ],
                "2018-12-18T04:15:00.000Z": [
                  {
                    "period": 0,
                    "registerTime": "2018-12-22T17:17:39.388Z",
                    "present": [
                      "5bf97d87878a8f1839f7e0f2",
                      "5bfb05854e70ec54a9e13009"
                    ]
                  }
                ],
                "2018-12-18T07:30:00.000Z": [
                  {
                    "period": 1,
                    "registerTime": "2018-12-22T17:17:39.433Z",
                    "present": [
                      "5bf97d87878a8f1839f7e0f2",
                      "5bfb05854e70ec54a9e13009"
                    ]
                  }
                ],
                "2018-12-25T04:15:00.000Z": [
                  {
                    "period": 0,
                    "registerTime": "2019-02-13T01:24:53.986Z",
                    "present": [
                      "5bfb00233412c424e3710afa",
                      "5bf97d87878a8f1839f7e0f2"
                    ]
                  }
                ],
                "2018-12-25T07:30:00.000Z": [
                  {
                    "period": 1,
                    "registerTime": "2019-02-13T01:24:54.074Z",
                    "present": [
                      "5bfb05854e70ec54a9e13009",
                      "5bf97d87878a8f1839f7e0f2"
                    ]
                  }
                ],
                "2018-12-30T04:30:00.000Z": [
                  {
                    "period": 0,
                    "registerTime": "2019-02-13T01:25:17.561Z",
                    "present": [
                      "5bfb05854e70ec54a9e13009",
                      "5bf97d87878a8f1839f7e0f2"
                    ]
                  }
                ],
                "2019-01-10T08:30:00.000Z": [
                  {
                    "period": 0,
                    "registerTime": "2019-02-13T01:25:32.933Z",
                    "present": [
                      "5bfb05854e70ec54a9e13009",
                      "5bf97d87878a8f1839f7e0f2"
                    ]
                  }
                ],
                "2019-01-01T04:15:00.000Z": [
                  {
                    "period": 0,
                    "registerTime": "2019-02-13T01:26:30.980Z",
                    "present": [
                      "5bfb05854e70ec54a9e13009",
                      "5bfb00233412c424e3710afa"
                    ]
                  }
                ],
                "2019-01-03T08:30:00.000Z": [
                  {
                    "period": 0,
                    "registerTime": "2019-02-13T01:26:40.561Z",
                    "present": [
                      "5bfb05854e70ec54a9e13009",
                      "5bf97d87878a8f1839f7e0f2"
                    ]
                  }
                ],
                "2019-01-06T04:30:00.000Z": [
                  {
                    "period": 0,
                    "registerTime": "2019-02-13T01:26:47.912Z",
                    "present": [
                      "5bfb05854e70ec54a9e13009",
                      "5bf97d87878a8f1839f7e0f2"
                    ]
                  }
                ],
                "2019-01-08T07:30:00.000Z": [
                  {
                    "period": 1,
                    "registerTime": "2019-02-13T01:26:57.551Z",
                    "present": [
                      "5bfb00233412c424e3710afa",
                      "5bf97d87878a8f1839f7e0f2"
                    ]
                  }
                ],
                "2019-01-08T04:15:00.000Z": [
                  {
                    "period": 0,
                    "registerTime": "2019-02-13T01:26:57.597Z",
                    "present": [
                      "5bfb05854e70ec54a9e13009",
                      "5bfb00233412c424e3710afa"
                    ]
                  }
                ],
                "2019-01-13T04:30:00.000Z": [
                  {
                    "period": 0,
                    "registerTime": "2019-02-13T01:27:07.398Z",
                    "present": [
                      "5bfb05854e70ec54a9e13009",
                      "5bfb00233412c424e3710afa"
                    ]
                  }
                ],
                "2019-01-15T04:15:00.000Z": [
                  {
                    "period": 0,
                    "registerTime": "2019-02-13T01:27:14.276Z",
                    "present": [
                      "5bfb00233412c424e3710afa",
                      "5bf97d87878a8f1839f7e0f2"
                    ]
                  }
                ],
                "2019-01-15T07:30:00.000Z": [
                  {
                    "period": 1,
                    "registerTime": "2019-02-13T01:27:14.324Z",
                    "present": [
                      "5bfb05854e70ec54a9e13009",
                      "5bf97d87878a8f1839f7e0f2"
                    ]
                  }
                ],
                "2019-01-17T08:30:00.000Z": [
                  {
                    "period": 0,
                    "registerTime": "2019-02-13T01:27:20.762Z",
                    "present": [
                      "5bfb05854e70ec54a9e13009",
                      "5bfb00233412c424e3710afa"
                    ]
                  }
                ],
                "2019-01-20T04:30:00.000Z": [
                  {
                    "period": 0,
                    "registerTime": "2019-02-13T01:29:36.380Z",
                    "present": [
                      "5bfb05854e70ec54a9e13009"
                    ]
                  }
                ],
                "2019-02-24T04:30:00.000Z": [
                  {
                    "period": 0,
                    "registerTime": "2019-02-24T10:37:53.890Z",
                    "present": [
                      "5bfb00233412c424e3710afa",
                      "5bf97d87878a8f1839f7e0f2"
                    ]
                  }
                ],
                "2019-02-21T08:30:00.000Z": [
                  {
                    "period": 0,
                    "registerTime": "2019-02-24T10:38:04.984Z",
                    "present": [
                      "5bfb00233412c424e3710afa",
                      "5bf97d87878a8f1839f7e0f2"
                    ]
                  }
                ],
                "2019-02-03T04:30:00.000Z": [
                  {
                    "period": 0,
                    "registerTime": "2019-02-25T11:23:07.587Z",
                    "present": [
                      "5bfb00233412c424e3710afa",
                      "5bf97d87878a8f1839f7e0f2"
                    ]
                  }
                ],
                "2019-01-22T04:15:00.000Z": [
                  {
                    "period": 0,
                    "registerTime": "2019-02-26T07:56:53.641Z",
                    "present": [
                      "5bfb00233412c424e3710afa",
                      "5bf97d87878a8f1839f7e0f2"
                    ]
                  }
                ],
                "2019-01-22T07:30:00.000Z": [
                  {
                    "period": 1,
                    "registerTime": "2019-02-26T07:56:53.689Z",
                    "present": [
                      "5bfb05854e70ec54a9e13009",
                      "5bf97d87878a8f1839f7e0f2"
                    ]
                  }
                ],
                "2019-01-24T08:30:00.000Z": [
                  {
                    "period": 0,
                    "registerTime": "2019-02-26T07:57:06.764Z",
                    "present": [
                      "5bfb00233412c424e3710afa",
                      "5bf97d87878a8f1839f7e0f2",
                      "5bfb05854e70ec54a9e13009"
                    ]
                  }
                ],
                "2019-01-29T04:15:00.000Z": [
                  {
                    "period": 0,
                    "registerTime": "2019-02-26T07:59:01.911Z",
                    "present": [
                      "5bfb05854e70ec54a9e13009"
                    ]
                  }
                ],
                "2019-02-17T04:30:00.000Z": [
                  {
                    "period": 0,
                    "registerTime": "2019-02-26T08:10:45.800Z",
                    "present": [
                      "5bfb00233412c424e3710afa",
                      "5bf97d87878a8f1839f7e0f2"
                    ]
                  }
                ],
                "2019-02-12T04:15:00.000Z": [
                  {
                    "period": 0,
                    "registerTime": "2019-02-26T08:11:32.488Z",
                    "present": [
                      "5bfb00233412c424e3710afa",
                      "5bf97d87878a8f1839f7e0f2"
                    ]
                  }
                ],
                "2019-02-12T07:30:00.000Z": [
                  {
                    "period": 1,
                    "registerTime": "2019-02-26T08:11:32.547Z",
                    "present": [
                      "5bfb05854e70ec54a9e13009",
                      "5bf97d87878a8f1839f7e0f2"
                    ]
                  }
                ],
                "2019-02-05T04:15:00.000Z": [
                  {
                    "period": 0,
                    "registerTime": "2019-02-26T08:11:53.032Z",
                    "present": [
                      "5bfb00233412c424e3710afa",
                      "5bf97d87878a8f1839f7e0f2"
                    ]
                  }
                ],
                "2019-02-05T07:30:00.000Z": [
                  {
                    "period": 1,
                    "registerTime": "2019-02-26T08:11:53.069Z",
                    "present": [
                      "5bfb05854e70ec54a9e13009"
                    ]
                  }
                ]
              },
              "tfname": "سهراب",
              "tlname": "خانی",
              "cname": "خیام",
              "year": "2018-03-21T00:00:00.000Z",
              "grade": "اول"
            }
          ]
          var coursesarr=[]
          carr.forEach((c)=>
          {
            coursesarr.push({coname:c.coname,_id:c._id})
          })
            this.setState({studentList:[],selectedClass: event.target.value,courseList:coursesarr });
            
        }
        else if(name==="course"){
            ////////////////////api for student list and type
          this.setState({studentList:[], selectedCourse: event.target.value,type:"توصیفی"});
        //   this.setState({waiting: true}, () => {
        //     req
        //         .post(`/grading-title-list`,
        //         {
        //           grade:selectedGrade,
        //           course_name:event.target.value
        //         })
        //         .then((response) => {
        //            console.log(response.data)
                  
        //            this.setState({waiting:false,gradingTitleList:response.data})
        //         })
        //         .catch(err => {
        //           console.log(err)
        //         });
                
        //       })
        }else if(name==="term"){
         
            this.setState({studentList:[], term: event.target.value,activeTerm:this.state.termList[event.target.value]})
        }
      }
      clickShowResult(){
        this.setState({type_prop:this.state.type, courseID_prop: this.state.courseList[this.state.selectedCourse]._id, activeTerm_prop :this.state.activeTerm,
           studentList:
            [
              {
                "_id": "5bfb05854e70ec54a9e13009",
                "fname": "احسان",
                "lname": "سپهری",
                "userName": "0900070900"
              },
              {
                "_id": "5bfb00233412c424e3710afa",
                "fname": "پرهام",
                "lname": "اکبرزاده",
                "userName": "0900010010"
              },
              {
                "_id": "5bf97d87878a8f1839f7e0f2",
                "fname": "علی",
                "lname": "عباسی",
                "userName": "1000970000"
              }
            ]
            
             });
      }
    componentDidMount(){
  
        this.setState({gradeList:["پیش‌دبستانی","اول","دوم","سوم","چهارم"]
        ,termList:
        [
            {
                _id: '1',
                title: 'ترم۱',
                active: false,
                last_modify:'iso date',
                create_date:'iso date'
            },
            {
                _id: '2',
                title: 'ترم۲',
                active: true,
                last_modify:'iso date',
                create_date:'iso date'
            }
        ]
        
    })  
        // this.setState({waiting: true}, () => {
        //     req
        //         .get(`/grade-list`)
        //         .then((response) => {
        //            console.log(response.data)
                  
        //            this.setState({waiting:false,gradeList:response.data})
        //         })
        //         .catch(err => {
        //           console.log(err)
        //         });
        //       })
        } 
       
        shouldComponentUpdate() {
          return true
      }
    render() {
        const {classes} = this.props;
        return (
            <div style={{
                    flexGrow: 1
                }}>
                <Grid className={classes.container} container spacing={24}>
                    <Grid item xs={12} justify="right" container direction="row" alignItems="right">
                    <form className={classes.root} autoComplete="off">
       
                    

       <FormControl className={classes.margin}>
         <InputLabel htmlFor="age-customized-select" >
           مقطع
         </InputLabel>
         <Select
           value={this.state.selectedGrade}
           onChange={(e)=>this.handleChange(e,"grade")}
           input={<Input name="age" id="age-customized-select" />}
         >
           {
             this.state.gradeList.map((grade,i)=>
             <MenuItem key={i} value={i}>{grade}</MenuItem>
             )
           }
           
         </Select>
       </FormControl>

       <FormControl className={classes.margin}>
         <InputLabel htmlFor="age-customized-select" >
           کلاس
         </InputLabel>
         <Select
           value={this.state.selectedClass}
           onChange={(e)=>this.handleChange(e,"class")}
           input={<Input name="age" id="age-customized-select" />}
         >
           {
             this.state.classList.map((course,i)=>
             <MenuItem key={i} value={i}>{course.cname}</MenuItem>
             )
           }
           
         </Select>
       </FormControl>

       <FormControl className={classes.margin}>
         <InputLabel htmlFor="age-customized-select">
           درس
         </InputLabel>
         <Select
           value={this.state.selectedCourse}
           onChange={(e)=>this.handleChange(e,"course")}
           input={<Input name="age" id="age-customized-select" />}
         >
           {
             this.state.courseList.map((course,i)=>
             <MenuItem key={i} value={i}>{course.coname}</MenuItem>
             )
           }
           
         </Select>
       </FormControl>
       <FormControl className={classes.margin}>
         <InputLabel htmlFor="age-customized-select">
           ترم
         </InputLabel>
         <Select
           value={this.state.term}
           onChange={(e)=>{this.handleChange(e,"term")}}
           input={<Input name="age" id="age-customized-select" />}
         >
           {
             this.state.termList.map((term,i)=>
             <MenuItem key={i}  value={i}>{term.title}</MenuItem>
             )
           }
           
         </Select>
       </FormControl>
       <IconButton
                // disabled={waiting}
                onClick={()=>this.clickShowResult()}
                size="small"
              >
                <SearchOutlined />
        </IconButton>
     </form>
                    </Grid>
                    <Grid item xs={12} justify="right" container direction="row" alignItems="right">
                    <Typography variant="body1" >نوع نمره‌دهی:{this.state.type}</Typography>
                    </Grid>
                    <Grid item xs={12} justify="flex-end" container direction="row" alignItems="left">
                    {(this.state.forReqArray.length!==0)&&
      <Button onClick={()=>this.registerAllNewgrades()} variant="contained" size="large" color="secondary" >
      ثبت تغییرات
    </Button>
      }
                    {(this.state.studentList.length!==0)&&
                    <Button  variant="contained" size="large" color="secondary" style={{marginRight:20}} >
          تایید نمرات
        </Button>
                    }
                   
                    </Grid>
                    <Grid item xs={12}>
                    {(this.state.studentList.length!==0)&&
                      <Paper className={classes.root}>
           <Table >
        <TableHead className={classes.head}>
          <TableRow>
          <TableCell align="right" >
           
            </TableCell>
            <TableCell align="right" >
            <Typography variant="body1" className={classes.headcell} >نام</Typography>
            </TableCell>
            
            <TableCell align="right" >
            <Typography variant="body1" className={classes.headcell} >نام‌خانوادگی</Typography>
            </TableCell>
            <TableCell align="right" >
            <Typography variant="body1" className={classes.headcell} >کد ملی</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            this.state.studentList.map((student,i)=>
            <ListItemWithCollapse addToReqArray={this.addToReqArray} key={i} type={this.state.type_prop} courseID={this.state.courseID_prop} student={student} activeTerm={this.state.activeTerm_prop}/>
            
            )
          }
          
        </TableBody>
      </Table> 
      </Paper>}
                    </Grid>
                        </Grid>
                   
               
            </div>
        );
    }
}
RegisterGrades.propTypes = {
    classes: PropTypes.object.isRequired
};
export default withStyles(styles)(RegisterGrades);




class ListItemWithCollapse extends Component {
    constructor(props) {
      super(props);
      this.state = {
        open:false,
        studentGrades:[],
        forReq:[]
      };
     
    }
    handleClick(){
      if(this.state.open){
      this.setState({ open: false })
      }else{
        var arr =[
          {
              _id:'1',
              title:'string',
              sub_title:[
                  {
                      _id:'1',
                      title:'string',
                      grade:"2"
                  }
              ]
          }
      ]
        
      
        this.setState({ open: true,studentGrades:arr })
      }
    };
 
 handleChangeGrade(e,i,j){
  var arr = this.state.studentGrades
  var reqarr= this.state.forReq
var a =this.props.activeTerm._id
 var b =this.props.student._id 
 var c=this.props.courseID 
 

  function findreq(req,index) {
    return (
       req.term_id=== a &&
      
       req.student_id=== b &&
       req.course_id=== c &&
      req.title_id===arr[i]._id &&
      req.sub_title===arr[i].sub_title[j]._id) 
}

if(reqarr.find(findreq)){

reqarr[reqarr.findIndex(findreq)].grade=e.target.value
this.props.addToReqArray(reqarr[reqarr.findIndex(findreq)])
}
else{
  console.log(reqarr.some(findreq))
  reqarr.push({
    term_id:this.props.activeTerm._id,
    course_id:this.props.courseID,
    student_id:this.props.student._id,
    title_id:arr[i]._id,
    sub_title:arr[i].sub_title[j]._id,
    grade:e.target.value
  })
  this.props.addToReqArray({
    term_id:this.props.activeTerm._id,
    course_id:this.props.courseID,
    student_id:this.props.student._id,
    title_id:arr[i]._id,
    sub_title:arr[i].sub_title[j]._id,
    grade:e.target.value
  })
}

if(arr[i].sub_title[j].hasOwnProperty("grade")){
  arr[i].sub_title[j].grade=e.target.value
  this.setState({studentGrades:arr,forReq:reqarr })
  
}else{
  arr[i].sub_title[j] = {...arr[i].sub_title[j], grade:e.target.value}
  this.setState({studentGrades:arr,forReq:reqarr })
  
}


 } 
 registerNewgrades(){
   console.log(this.state.forReq)
 }
 
 componentDidMount()
{
console.log(this.props.activeTerm)
}  
shouldComponentUpdate() {
  return true
}
    render() {
      
      return (
        <React.Fragment>
        <TableRow button onClick={()=>this.handleClick()}>
          <TableCell align="right" >
          {this.state.open ? <ExpandLess /> : <ExpandMore />}
              </TableCell>
          <TableCell align="right" >
              <Typography variant="body1"  >{this.props.student.fname}</Typography>
              </TableCell>
              <TableCell align="right" >
              <Typography variant="body1"  >{this.props.student.lname}</Typography>
              </TableCell>
              <TableCell align="right" >
              <Typography variant="body1"  >{this.props.student.userName}</Typography>
              </TableCell>
        </TableRow>
        {this.state.open && <TableRow style={{
                    backgroundColor: '#fafafa'
                }}>
          <TableCell colSpan={4}
          style={{
            padding:20
        }}>
        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
        

        <Table style={{
                    backgroundColor: '#fff',
                    border:"1px solid rgba(224, 224, 224, 1)",
                    marginBottom:20
                }}>
        
        <TableBody>
          {this.state.studentGrades.map((list,i) => (
<React.Fragment>
            <TableRow key={i}>
              <TableCell colSpan={3} component="th" scope="row">{list.title}</TableCell>
            </TableRow>
           {
              list.sub_title.map((item,j) =>(
<TableRow key={j}>
            
            <TableCell  align="right" colSpan={2}>{item.title}</TableCell>
            <TableCell align="left" style={{
                   textAlign:"left"
                }}colSpan={1} >
            {this.props.activeTerm.active ?(
  item.hasOwnProperty("grade") ?( 
    (this.props.type==="توصیفی") ? 
<form style={{
            display:"inline-block"
        }} >
        
         <FormControlLabel
              
              control={<Radio
                checked={item.grade === "1"}
                 onChange={(e)=>this.handleChangeGrade(e,i,j)}
                value="1"
                name="radio-button-demo"
                color='primary'
                
              />}
              label="1"
              labelPlacement="start"
            />
            <FormControlLabel
              
              control={<Radio
                checked={item.grade ==="2"}
                 onChange={(e)=>this.handleChangeGrade(e,i,j)}
                value="2"
                name="radio-button-demo"
                color='primary'
                
              />}
              label="2"
              labelPlacement="start"
            />
             <FormControlLabel
              
              control={<Radio
                checked={item.grade === "3"}
                 onChange={(e)=>this.handleChangeGrade(e,i,j)}
                value="3"
                name="radio-button-demo"
                color='primary'
                
              />}
              label="3"
              labelPlacement="start"
            />
             <FormControlLabel
              
              control={<Radio
                checked={item.grade ==="4"}
                 onChange={(e)=>this.handleChangeGrade(e,i,j)}
                value="4"
                name="radio-button-demo"
                color='primary'
                
              />}
              label="4"
              labelPlacement="start"
            />
        
        </form>
:
  <TextField
  id="outlined-bare"
  value={item.grade}
  onChange={(e)=>this.handleChangeGrade(e,i,j)}
  margin="normal"
  variant="outlined"
/>
 ) : 
 (this.props.type==="توصیفی") ? 
 <form style={{
             display:"inline-block"
         }} >
         
          <FormControlLabel
               
               control={<Radio
                 checked={false}
                  onChange={(e)=>this.handleChangeGrade(e,i,j)}
                 value="1"
                 name="radio-button-demo"
                 color='primary'
                 
               />}
               label="1"
               labelPlacement="start"
             />
             <FormControlLabel
               
               control={<Radio
                 checked={false}
                  onChange={(e)=>this.handleChangeGrade(e,i,j)}
                 value="2"
                 name="radio-button-demo"
                 color='primary'
                 
               />}
               label="2"
               labelPlacement="start"
             />
              <FormControlLabel
               
               control={<Radio
                 checked={false}
                  onChange={(e)=>this.handleChangeGrade(e,i,j)}
                 value="3"
                 name="radio-button-demo"
                 color='primary'
                 
               />}
               label="3"
               labelPlacement="start"
             />
              <FormControlLabel
               
               control={<Radio
                 checked={false}
                  onChange={(e)=>this.handleChangeGrade(e,i,j)}
                 value="4"
                 name="radio-button-demo"
                 color='primary'
                 
               />}
               label="4"
               labelPlacement="start"
             />
         
         </form>
 :
 (this.props.type==="توصیفی") ? 
 <form style={{
             display:"inline-block"
         }} >
         
          <FormControlLabel
               
               control={<Radio
                 checked={false}
                  onChange={(e)=>this.handleChangeGrade(e,i,j)}
                 value="1"
                 name="radio-button-demo"
                 color='primary'
                 disabled
               />}
               label="1"
               labelPlacement="start"
             />
             <FormControlLabel
               
               control={<Radio
                 checked={false}
                  onChange={(e)=>this.handleChangeGrade(e,i,j)}
                 value="2"
                 name="radio-button-demo"
                 color='primary'
                 disabled
               />}
               label="2"
               labelPlacement="start"
             />
              <FormControlLabel
               
               control={<Radio
                 checked={false}
                  onChange={(e)=>this.handleChangeGrade(e,i,j)}
                 value="3"
                 name="radio-button-demo"
                 color='primary'
                 disabled
               />}
               label="3"
               labelPlacement="start"
             />
              <FormControlLabel
               
               control={<Radio
                 checked={false}
                  onChange={(e)=>this.handleChangeGrade(e,i,j)}
                 value="4"
                 name="radio-button-demo"
                 color='primary'
                 disabled
               />}
               label="4"
               labelPlacement="start"
             />
         
         </form>
 :
<TextField
  id="outlined-bare"
  defaultValue=""
  onChange={(e)=>this.handleChangeGrade(e,i,j)}
  margin="normal"
  variant="outlined"
 />  
 
 )
  : 
  (
  item.hasOwnProperty("grade") ? 
  (this.props.type==="توصیفی") ? 
  <form style={{
              display:"inline-block"
          }} >
          
           <FormControlLabel
                
                control={<Radio
                  checked={item.grade === "1"}
                   onChange={(e)=>this.handleChangeGrade(e,i,j)}
                  value="1"
                  name="radio-button-demo"
                  color='primary'
                  disabled
                />}
                label="1"
                labelPlacement="start"
              />
              <FormControlLabel
                
                control={<Radio
                  checked={item.grade ==="2"}
                   onChange={(e)=>this.handleChangeGrade(e,i,j)}
                  value="2"
                  name="radio-button-demo"
                  color='primary'
                  disabled
                />}
                label="2"
                labelPlacement="start"
              />
               <FormControlLabel
                
                control={<Radio
                  checked={item.grade === "3"}
                   onChange={(e)=>this.handleChangeGrade(e,i,j)}
                  value="3"
                  name="radio-button-demo"
                  color='primary'
                  disabled
                />}
                label="3"
                labelPlacement="start"
              />
               <FormControlLabel
                
                control={<Radio
                  checked={item.grade ==="4"}
                   onChange={(e)=>this.handleChangeGrade(e,i,j)}
                  value="4"
                  name="radio-button-demo"
                  color='primary'
                  disabled
                />}
                label="4"
                labelPlacement="start"
              />
          
          </form>
  :
  <TextField
  id="outlined-bare"
  
  defaultValue={item.grade}
  margin="normal"
  variant="outlined"
  disabled
/>  : 
<TextField
  id="outlined-bare"
  defaultValue=""
  margin="normal"
  variant="outlined"
  disabled
  /> )
  }
            </TableCell>
          </TableRow>

              ) )
               
              
           }
    </React.Fragment>      
          ))}
          
          
        </TableBody>

      </Table>
    
      <Grid  xs={12} justify="center" container direction="row" alignItems="center">
      {this.state.forReq.length!==0 && 
      <Button  variant="contained" size="large" color="secondary" onClick={()=>this.registerNewgrades()}>
          ثبت تغییرات
        </Button>
      }
        </Grid>
          
          </Collapse>
          </TableCell>
          </TableRow>}
  </React.Fragment>
  
      );
    }
  }
  ListItemWithCollapse.propTypes = {
    student:PropTypes.object.isRequired,
    activeTerm:PropTypes.object.isRequired,
    courseID:PropTypes.string.isRequired,
    type:PropTypes.string.isRequired
  };


  
// <div>
//  {this.state.studentGrades.map((list,i) => {
//   return (
//  <List   key={i} subheader={<ListSubheader>{list.title}</ListSubheader>}>
//   {list.sub_title.map((item,j) => {
//   return ( 
  
// <div key={j}>
 
//   <ListItem  key={j}>
//  <ListItemText primary={item.title}  />
//  {this.props.active ?(
//   item.hasOwnProperty("grade") ? 
//   <TextField
//   id="outlined-bare"
//   defaultValue={item.grade}
//   margin="normal"
//   variant="outlined"
// />  : 
// <TextField
//   id="outlined-bare"
//   defaultValue=""
//   margin="normal"
//   variant="outlined"
//  />  )
//   : 
//   (
//   item.hasOwnProperty("grade") ? 
//   <TextField
//   id="outlined-bare"
  
//   defaultValue={item.grade}
//   margin="normal"
//   variant="outlined"
//   disabled
// />  : 
// <TextField
//   id="outlined-bare"
//   defaultValue=""
//   margin="normal"
//   variant="outlined"
//   disabled
//   /> )
//   }
//  </ListItem> 
//  </div> 

//  )
// })

// }
// <ListItem>

// </ListItem>
//   </List>
//   )        
//   })}
// </div>


