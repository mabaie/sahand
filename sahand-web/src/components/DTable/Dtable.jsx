import React, { Component } from "react";
import {
  Grid,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Typography,
  Button
} from "@material-ui/core";
import PropTypes from "prop-types";
import compose from 'recompose/compose';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';
import { withStyles } from "@material-ui/core/styles";
import Pagination from "./Pagination";
import Content from "./Content";
import FilterFormRouter from '../routers/FilterFormRouter';
import Header from './Header';
import { withRouter } from 'react-router-dom';
import PopMessages from '../common/PopMessages';
import _ from "lodash";

const styles = theme=>{ 
  return {
    root: {
      flexGrow: 1
    },
  }
};
class Dtable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteOpen: false,
      reload: false,
      errorMessages: [],
      waiting: true,
      page: 0,
      rowsPerPage: 10,
      workingSet: [],
      disabled: {
        first: true,
        prev: true,
        next: true,
        last: true
      },
      filter: {
        ID: "default"
      },
      sort:"default",
      checkAll: false,
      mustDelete: false,
    };
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleWorkingSetChange = this.handleWorkingSetChange.bind(this);
    this.handleRowsPerPageChange = this.handleRowsPerPageChange.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleWaiting = this.handleWaiting.bind(this);
    this.handleErrorExit = this.handleErrorExit.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);
    this.handleDeleteOpen = this.handleDeleteOpen.bind(this);
    this.checkAllList = this.checkAllList.bind(this);
  }
  handleRegister(){
    this.setState({waiting: true, reload: true})
  }
  handleSortChange(sort){
    if(!_.isEqual(this.state.sort, sort) )
      this.setState({waiting: true, sort:sort});
  }
  handleWaiting(waiting) {
    this.setState({waiting: waiting});
  }
  handlePageChange(page) {
    this.setState((prevState)=>{
      let disabled = prevState.disabled;
      const lastPage = Math.ceil(prevState.workingSet.length/prevState.rowsPerPage);
      switch(page){
        case 0: disabled = {
          first: true,
          prev: true,
          next: true,
          last: true
        }; break;
        case 1: disabled = {
            first: true,
            prev: true,
            next: page >= lastPage,
            last: page >= lastPage
          }; break;
        case 2: disabled = {
            first: false,
            prev: false,
            next: page >= lastPage,
            last: page >= lastPage
          }; break;
          case lastPage: disabled = {
              first: page <= 1,
              prev: page <= 1,
              next: true,
              last: true
            }; break;
            default: disabled = {
              first: false,
              prev: false,
              next: false,
              last: false,
            }; break;
      }
      return { page: page, disabled: disabled }
    });
  }
  handleWorkingSetChange(workingSet) {
    this.setState(prevState => {
      let nextPage = prevState.page;
      const nextMaxPage = Math.ceil(workingSet.length / prevState.rowsPerPage);
      if (prevState.workingSet.length === 0) {
        nextPage = 1;
      }
      nextPage = Math.min(nextPage, nextMaxPage);
      let disabled = {
        first: nextPage <= 1,
        prev: nextPage <= 1,
        next: nextPage === nextMaxPage,
        last: nextPage === nextMaxPage
      }
      return { workingSet: workingSet, page: nextPage, waiting: false, reload:false, mustDelete: false, disabled: disabled };
    });
  }
  handleError(message){
    
    this.setState((prevState)=>{
        return {errorMessages: prevState.errorMessages.concat(message)}
      })
    }
  handleRowsPerPageChange(newRowsPerPage) {
    this.setState(prevState => {
      const nextMaxPage = Math.ceil(
        prevState.workingSet.length / newRowsPerPage
      );
      const nextPage = Math.min(prevState.page, nextMaxPage);
      const disabled = {
        first: nextPage <= 1,
        prev: nextPage <= 1,
        next: nextPage === nextMaxPage,
        last: nextPage === nextMaxPage
      }
      return { rowsPerPage: newRowsPerPage, page: nextPage, disabled: disabled };
    });
  }
  handleFilterChange(obj) {
    if(!_.isEqual(this.state.filter, obj) )
      this.setState({filter: obj, waiting: true});
  }
  handleErrorExit(id){
    return ()=>{

      this.setState(prevState=>{
        return {errorMessages: prevState.errorMessages.slice(1), mustDelete: false}}
      );
    }
  }
  handleDelete(){
    this.setState({mustDelete: true,checkAll:false})
  }
  handleDeleteOpen(){
    this.setState({deleteOpen: true})
  }
  checkAllList(e){
      this.setState({checkAll:e.target.checked});
  }
  render() {
    const { classes, header, url, prefetchLimit } = this.props;
    const { reload, filter, rowsPerPage, page, waiting, sort, checkAll, workingSet, disabled, mustDelete } = this.state;
    return (
     
      <Grid spacing={16}  className={classes.root} style={{padding: isWidthDown('sm', this.props.width)?2:32}} container justify="center" direction='row'>            
            {this.state.errorMessages.map((err, id)=>{
              return <PopMessages key={id} message={err} variant='error' onExited={this.handleErrorExit(id)}/>
            })}
            <Dialog open={waiting}>
            <div style={{padding:20, overflowX:'hidden', overflowY:'hidden'}}>
              <Typography variant='body1' align='center'>منتظر بمانید</Typography> 
              <CircularProgress style={{marginTop:20, marginBottom:20, marginLeft:30, marginRight:30}}/>
            </div>
          </Dialog>
          <Dialog open={this.state.deleteOpen}>
            <div style={{padding:20, overflowX:'hidden', overflowY:'hidden'}}>
            
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
            آیا از حذف مطمئن هستید؟
            </DialogContentText>
          </DialogContent>
          <DialogActions>
              <Button  color="primary" onClick={()=>{
                this.handleDelete()
                this.setState({deleteOpen:false})
              }
              }
                >تایید</Button>
              <Button  color="primary" onClick={()=>this.setState({deleteOpen:false})}>رد</Button>
              </DialogActions>
            </div>
          </Dialog>
        <FilterFormRouter onChange={this.handleFilterChange} onChangeSort={this.handleSortChange} waiting={waiting} onError={this.handleError} onRegister={this.handleRegister} onDelete={this.handleDeleteOpen}/>
        <Paper style={{width:'100%'}}>
          <Table>
            <TableHead>
              <Header checkAll={this.checkAllList}>
                {header}
              </Header>
            </TableHead>
            <TableBody>
              <Content
                url={url}
                waiting={waiting}
                onWaiting={this.handleWaiting}
                workingSet={workingSet}
                page={page}
                filter={filter}
                sort={sort}
                checkAll={checkAll}
                rowsPerPage={rowsPerPage}
                onWorkingSetChange={this.handleWorkingSetChange}
                prefetchLimit={prefetchLimit}
                columnCount={header.length + 1}
                reload={reload}
                onRegister={this.handleRegister}
                onError={this.handleError}
                errorExit={this.state.errorMessages}
                mustDelete={mustDelete}
              />
              <TableRow>
                <TableCell colSpan={header.length + 1}>
                  <Pagination
                    waiting={waiting}
                    disabled={disabled}
                    totalRows={workingSet.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={this.handlePageChange}
                    onRowsPerPageChange={this.handleRowsPerPageChange}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </Grid>
    );
  }
}
Dtable.propTypes = {
  classes: PropTypes.object.isRequired,
  header: PropTypes.array.isRequired,
  prefetchLimit: PropTypes.number.isRequired,
  url: PropTypes.string.isRequired
};
export default withRouter(compose(withWidth(),withStyles(styles, { withTheme: true }))(Dtable));
