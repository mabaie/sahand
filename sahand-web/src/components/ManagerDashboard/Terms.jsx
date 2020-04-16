import React, {Component} from 'react';
import {Paper,
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
    Button,
    DialogActions,
    Fab,
    IconButton,
    Icon
} from '@material-ui/core';
import jMoment from 'moment-jalaali';
import persian from "persian";
import {withStyles} from '@material-ui/core/styles';
import PropTypes from "prop-types";
import AddIcon from '@material-ui/icons/Add';
import configs from "../../configs";

const styles = theme => ({
    container: {
        textAlign: 'right'
    },
    active: {
        backgroundColor: '#aaa',
        color: theme.palette.common.white
    }
    ,
    table: {
      minWidth: 700,
    },
});

class Terms extends Component {
    constructor(props) {
        super(props);

        this.state = {
            waiting: false,
            data: [],
            edit: {},
            edittext: '',
            edit_id:'',
            newText: '',
            open: false,
            openEdit: false
        }
        this.handleChangeText = this
            .handleChangeText
            .bind(this);
        this.just_persian = this.just_persian.bind(this);
        this.handleChangeNewText = this.handleChangeNewText.bind(this);
    }
    handleChangeNewText(text) {
      if (this.just_persian(text)||text.length==0) {
        this.setState({newText: text})
      } 
    }
    addNewTerm() {
        this.setState({open: true})
    }

    handleCloseEdit(){
      this.setState({openEdit: false})
    }

    handleCloseAdd(){
        this.setState({open: false, newText: ''})
      
    }
    editTerm(){
        const req1 = axios.create({
            baseURL: configs.apiUrl,
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("access-token")
            }
        });
        this.setState({
            waiting: true
        }, () => {
            req1
                .put(`/term-update`, {ID:this.state.edit_id,Title: this.state.edittext})
                .then((response) => {
                    console.log(response.data)

                    req1
                        .get(`/term-list`)
                        .then((response) => {
                            console.log(response.data)

                            this.setState({waiting: false,edit_id:"",edittext:"", openEdit: false, data: response.data})
                        })
                        .catch(err => {
                            console.log(err)
                        });

                })
                .catch(err => {
                    console.log(err)
                });
        })
    }
    addTerm() {
        const req1 = axios.create({
            baseURL: configs.apiUrl,
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("access-token")
            }
        });
        this.setState({
            waiting: true
        }, () => {
            req1
                .post(`/term-add`, {Title: this.state.newText})
                .then((response) => {
                    console.log(response.data)

                    req1
                        .get(`/term-list`)
                        .then((response) => {
                            console.log(response.data)

                            this.setState({waiting: false,newText:"", open: false, data: response.data})
                        })
                        .catch(err => {
                            console.log(err)
                        });

                })
                .catch(err => {
                    console.log(err)
                });
        })
    }

    just_persian(str) {
        var p = /^[\u0600-\u06FF\s]+$/;

        if (p.test(str)) {
            return true
        } else {
            return false
        }
    }
    handleChangeText(text) {
        if (this.just_persian(text)||text.length==0) {
          this.setState({edittext: text})
        } 
    }
    openEdit(data) {
        this.setState({edittext: data.title,edit_id:data._id,openEdit:true})
    }

    componentDidMount() {

        const req1 = axios.create({
            baseURL: configs.apiUrl,
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("access-token")
            }
        });
        this.setState({
            waiting: true
        }, () => {
            req1
                .get(`/term-list`)
                .then((response) => {
                    console.log(response.data)

                    this.setState({waiting: false, data: response.data/*[
                      {
                          _id: "1",
                          title: 'name',
                          active: true,
                          last_modify:'iso date',
                          create_date:'iso date'
                      }
                  ]*/
                  
                  })
                })
                .catch(err => {
                    console.log(err)
                });
        })
    }

    render() {
        const {classes} = this.props;
        return (
            <div style={{
                    flexGrow: 1
                }}>
                 
                <Dialog open={this.state.waiting}>
                     <div
                        style={{
                            padding: 20,
                            overflowX: 'hidden',
                            overflowY: 'hidden',
                        }}>
                        <Typography variant='body1' align='center'>منتظر بمانید</Typography>
                        <CircularProgress
                            style={{
                                marginTop: 20,
                                marginBottom: 20,
                                marginLeft: 30,
                                marginRight: 30
                            }}/>
                    </div> 
                    
                </Dialog>
               
                 <Dialog
                    open={this.state.open}
                    onClose={this.handleCloseAdd}
                    aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">اضافه کردن ترم جدید</DialogTitle>
                    <DialogContent>

                        <TextField
                            autoFocus="autoFocus"
                            margin="dense"
                            id="name"
                            label="عنوان"
                            type="text"
                            value={this.state.newText}
                            onChange={(e) => this.handleChangeNewText(e.target.value)}
                            fullWidth="fullWidth"/>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={(e)=>this.handleCloseAdd()} color="primary">
                            انصراف
                        </Button>
                        <Button disabled={this.state.newText==0} onClick={(e)=>this.addTerm()} color="primary">
                            تایید
                        </Button>
                    </DialogActions>
                </Dialog>
 
                <Dialog
                    open={this.state.openEdit}
                    onClose={this.handleCloseEdit}
                    aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">ویرایش ترم</DialogTitle>
                    <DialogContent>

                        <TextField
                            autoFocus="autoFocus"
                            margin="dense"
                            id="name"
                            label="عنوان"
                            type="text"
                            value={this.state.edittext}
                            onChange={(e) => this.handleChangeText(e.target.value)}
                            fullWidth="fullWidth"/>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={(e)=>this.handleCloseEdit()} color="primary">
                            انصراف
                        </Button>
                        <Button disabled={this.state.edittext==0} onClick={(e)=>this.editTerm()} color="primary">
                            تایید
                        </Button>
                    </DialogActions>
                </Dialog>  

                <Grid  container="container" spacing={24}>
                <Grid item xs={12}>
                <Button     
                    fullWidth
                    variant="contained"
                    color="secondary"
                    onClick={(e)=>this.addNewTerm()}>
                    <AddIcon />
                    افزودن ترم جدید
                </Button>
                </Grid>
                    
                    <Grid item xs={12}>
                    <Paper >
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell align="right">نام ترم</TableCell>
                                <TableCell align="right" >زمان ایجاد</TableCell>
                                <TableCell align="right">آخرین زمان تغییر</TableCell>
                                <TableCell align="right"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                this
                                    .state
                                    .data
                                    .map((row) => 
                                        <TableRow
                                            
                                            key={row._id}>
                                            <TableCell >
                                                {
                                                    row.active
                                                        ? 'ترم فعال'
                                                        : ' '
                                                }
                                            </TableCell>
                                            <TableCell align="right">{row.title}</TableCell>
                                            <TableCell align="right">{persian.toPersian(jMoment(row.last_modify).format('HH:mm jYYYY/jM/jD'))}</TableCell>
                                            <TableCell align="right">{persian.toPersian(jMoment(row.create_date).format('HH:mm jYYYY/jM/jD'))}</TableCell>
                                            <TableCell align="right">
                                                <IconButton
                                                    color='secondary'
                                                    disable={!row.active}
                                                    onClick={(e) => this.openEdit(row)}>
                                                    <Icon>edit_icon</Icon>
                                                </IconButton>
                                            </TableCell>

                                        </TableRow>
                                    )
                            }
                        </TableBody>
                    </Table>
                    </Paper>
                    </Grid> 

                </Grid> 

            </div>
        )
    }
}
Terms.propTypes = {
    classes: PropTypes.object.isRequired
};
export default withStyles(styles)(Terms);