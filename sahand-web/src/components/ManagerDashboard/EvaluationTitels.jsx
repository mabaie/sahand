import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Delete from '@material-ui/icons/Delete';
import configs from "../../configs";
import AddIcon from '@material-ui/icons/Add';
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
    import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
const styles = theme => ({
    container: {
        textAlign: 'left'
    },
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems:" baseline"
    },
    margin: {
      margin: theme.spacing.unit,
    minWidth: 120
    },
    bootstrapFormLabel: {
      fontSize: 18,
    },
    rootList: {
        width: '100%',
        maxWidth: 360,
        background: theme.palette.background.paper,
        textAlign: 'left'
      }
});


const req = axios.create({
  baseURL: configs.apiUrl,
  headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("access-token")
  }
});

class EvaluationTitels extends Component {
    constructor(props) {
        super(props);

        this.state = {
           selectedGrade:'',
           selectedCourse:'',
           type:"نامشخص" ,
           edittype:"",
           gradeList:[],
           courseList:[],
           gradingListTitle:[],
           show:false,
           openTitle:false,
           openSub:false,
           newTitle:"",
           selectedTitle:"",
           selectedTitleIndex:0,
           newSub:"",
           forReq:[]
        }

        this.openAddSub=this.openAddSub.bind(this)
    }
    just_persian(str) {
        var p = /^[\u0600-\u06FF\s]+$/;

        if (!p.test(str)) {
            return true
        } else {
            return false
        }
    }
    
    handleChangeNewTitle(text){
        if (this.just_persian(text)) {

            this.setState({newTitle: ""})
        } else {
            this.setState({newTitle: text})
        }
    }

    handleChangeNewSub(text){
        if (this.just_persian(text)) {
            this.setState({newSub: ""})
        } else {
            
            this.setState({newSub: text})
        }
    }

    openAddTitle(){
        this.setState({openTitle:true})
    }

    openAddSub(title,index){
        this.setState({openSub:true,selectedTitle:title,selectedTitleIndex:index})
    }

    
    handleCloseAddTitle(){
        this.setState({openTitle:false})
    }

    handleCloseAddSub(){
        this.setState({openSub:false})
    }

    addTitle(){
        var arr = this.state.gradingListTitle
        var len = this.state.gradingListTitle.length
        arr.push({
            _id:len,
            title:this.state.newTitle,
            sub_title:[]
        })
        this.setState({openTitle:false})
    }

    addSub(){
        var arr = this.state.gradingListTitle
        var len = this.state.gradingListTitle[this.state.selectedTitleIndex].sub_title.length
        arr[this.state.selectedTitleIndex].sub_title.push(
        
                    {
                        _id:len,
                        title:this.state.newSub
                    }
             )
        var arrReq=this.state.forReq
        arrReq.push(
            {
                grade: this.state.selectedGrade,
                course_name:this.state.selectedCourse,
                title:this.state.selectedTitle,
                sub_title:this.state.newSub
            }
            
            )     
        this.setState({openSub:false,gradingListTitle:arr})
    }
    handleChange(event,name){
      if(name==="grade"){
        this.setState({type:"نامشخص",selectedGrade: event.target.value,courseList:["ریاضی","هدیه"]})
    // this.setState({waiting: true}, () => {
    //   req
    //       .post(`/grade-course-list`,
    //       {
    //         grade:event.target.value
    //       })
    //       .then((response) => {
    //          console.log(response.data)
            
    //          this.setState({waiting:false,selectedGrade: event.target.value,courseList:response.data})
    //       })
    //       .catch(err => {
    //         console.log(err)
    //       });
          
    //     })

        // this.setState({waiting: true}, () => {
        //   req
        //       .post(`/grading-type`,
        //       {
        //         grade:event.target.value
        //       })
        //       .then((response) => {
        //          console.log(response.data)
                
        //          this.setState({waiting:false,type:response.data.type})
        //       })
        //       .catch(err => {
        //         console.log(err)
        //       });
              
        //     })
      }
      else if(name==="course"){
        this.setState({ selectedCourse: event.target.value,gradingListTitle:[
                {
                    _id:'1',
                    title:'عنوان اصلی اول',
                    sub_title:[
                        {
                            _id:'1',
                            title:'عنوان فرعی اول'
                        }
                    ]
                }
            ],show:true
            
            
              });
        // this.setState({waiting: true}, () => {
        //   req
        //       .post(`/grading-title-list`,
        //       {
        //         grade:selectedGrade,
        //         course_name:event.target.value
        //       })
        //       .then((response) => {
        //          console.log(response.data)
                
        //          this.setState({waiting:false,gradingTitleList:response.data})
        //       })
        //       .catch(err => {
        //         console.log(err)
        //       });
              
        //     })
      }
    }
    handleChangeType(event){
      this.setState({edittype:event.target.value})
    }
    componentDidMount(){
  
        this.setState({gradeList:["اول","دوم","سوم"]})  
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

    render() {
        const {classes} = this.props;
        return (
            <div style={{
                    flexGrow: 1,
                    padding:20
                }}>
                <Dialog
                    open={this.state.openTitle}
                    onClose={()=>this.handleCloseAddTitle()}
                    aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">اضافه کردن عنوان اصلی</DialogTitle>
                    <DialogContent>

                        <TextField
                            autoFocus="autoFocus"
                            margin="dense"
                            id="name"
                            label="عنوان اصلی"
                            type="text"
                            value={this.state.newTitle}
                            onChange={(e) => this.handleChangeNewTitle(e.target.value)}
                            fullWidth="fullWidth"/>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={(e)=>this.handleCloseAddTitle()} color="primary">
                            انصراف
                        </Button>
                        <Button onClick={(e)=>this.addTitle()} color="primary">
                            تایید
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={this.state.openSub}
                    onClose={()=>this.handleCloseAddSub()}
                    aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">اضافه کردن زیر عنوان</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            عنوان اصلی:{this.state.selectedTitle}
                        </DialogContentText>
                        <TextField
                            autoFocus="autoFocus"
                            margin="dense"
                            id="name"
                            label="زیر عنوان"
                            type="text"
                            value={this.state.newSub}
                            onChange={(e) => this.handleChangeNewSub(e.target.value)}
                            fullWidth="fullWidth"/>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={(e)=>this.handleCloseAddSub()} color="primary">
                            انصراف
                        </Button>
                        <Button onClick={(e)=>this.addSub()} color="primary">
                            تایید
                        </Button>
                    </DialogActions>
                </Dialog>
                <Grid className={classes.container} container spacing={24}>
                <Grid item xs={12}>
                <form className={classes.root} autoComplete="off">
       
        <FormControl className={classes.margin}>
          <InputLabel htmlFor="age-customized-select" className={classes.bootstrapFormLabel}>
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
          <InputLabel htmlFor="age-customized-select" className={classes.bootstrapFormLabel}>
            درس
          </InputLabel>
          <Select
            value={this.state.selectedCourse}
            onChange={(e)=>this.handleChange(e,"course")}
            input={<Input name="age" id="age-customized-select" />}
          >
            {
              this.state.courseList.map((course,i)=>
              <MenuItem key={i} value={i}>{course}</MenuItem>
              )
            }
            
          </Select>
        </FormControl>
        <FormControl style={{
                    display:"block"
                }} className={classes.margin}>
        <Typography style={{
                    display:"inline-block",
                    marginLeft: "36px"
                }}>نوع نمره دهی:</Typography>
      {
        (this.state.type==="نامشخص")?
        
        
        <div style={{
            display:"inline-block"
        }} >
        
         <FormControlLabel
              
              control={<Radio
                checked={this.state.edittype === "توصیفی"}
                onChange={(e)=>this.handleChangeType(e)}
                value="توصیفی"
                name="radio-button-demo"
                
              />}
              label="توصیفی"
              labelPlacement="start"
            />
            <FormControlLabel
              
              control={<Radio
                checked={this.state.edittype === "نمره"}
                onChange={(e)=>this.handleChangeType(e)}
                value="نمره"
                name="radio-button-demo"
                
              />}
              label="نمره"
              labelPlacement="start"
            />
        
        </div>
     
      :
      <Typography style={{
        display:"inline-block"
    }}>{this.state.type}</Typography>
      }
       </FormControl>
      </form>
      </Grid>
      <Grid item xs={12}>

      <List style={{
        width: '100%',
        textAlign: 'right'
       }}>
       {this.state.gradingListTitle.map((list,i) => {
        return (
            <ListItemWithCollapse key={i} list={list} index={i} openAddSub={this.openAddSub}  />
        )        
        })}
</List>
         
      </Grid>
      <Grid item xs={12}>
      {this.state.show &&
      <Chip
      avatar={
        <Avatar>
          <AddIcon />
        </Avatar>
      }
        
        label="اضافه کردن عنوان اصلی"
        clickable
        color="primary"
        onClick={()=>this.openAddTitle()} 
        
      />}
      </Grid>
      <Grid  xs={12} justify="center" container direction="row" alignItems="center">
      {this.state.forReq.length!==0 && 
      <Button  variant="contained" size="large" color="secondary" >
          ثبت تغییرات
        </Button>
      }
        </Grid>
                </Grid>
            </div>
        );
    }
}
EvaluationTitels.propTypes = {
    classes: PropTypes.object.isRequired
};
export default withStyles(styles)(EvaluationTitels);



class ListItemWithCollapse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open:false
    };
   
  }
  handleClick(){
    this.setState(state => ({ open: !state.open }));
  }

  render() {
      
    return (<React.Fragment>
    <ListItem button onClick={()=>this.handleClick()} >
    {this.state.open ? <ExpandLess /> : <ExpandMore />}
          <ListItemText inset primary={ this.props.list.title} />
          
        </ListItem>

       <Collapse in={this.state.open} timeout="auto" unmountOnExit>
       
       <List style={{
        width: '100%',
        maxWidth: 360,
        textAlign: 'right'
       }} >
        {this.props.list.sub_title.map((item,j) => {
        return ( 
        
    <div key={j}>
       
        <ListItem  key={j}>
       <ListItemText primary={item.title}  />
       <ListItemSecondaryAction>
                      <IconButton aria-label="Delete">
                      <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
       
       </ListItem> 
       </div> 
   
       )
      })
      
      }
      
      <ListItem>
      <Chip
      avatar={
        <Avatar>
          <AddIcon />
        </Avatar>
      }
        
        label=" اضافه کردن زیر عنوان"
        clickable
        color="secondary"
        onClick={()=>this.props.openAddSub(this.props.list.title,this.props.index)} 
        variant="outlined"
        
      />
 </ListItem>
 </List>
 </Collapse>
       

    </React.Fragment>)
  
  }

}
ListItemWithCollapse.propTypes = {
  index:PropTypes.number.isRequired,
  openAddSub:PropTypes.func.isRequired,
  list:PropTypes.object.isRequired
};