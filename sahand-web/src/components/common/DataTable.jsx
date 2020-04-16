import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import TableHead from '@material-ui/core/TableHead';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import configs from '../../configs';
import AdminTableData from '../AdminDashboard/TableData';
import AdminFilterForm from '../AdminDashboard/FilterForm';
import AdminTableHeader from '../AdminDashboard/TableHeader';
import LastPage from '@material-ui/icons/LastPage';
import FirstPage from '@material-ui/icons/FirstPage';
import ChevronRight from '@material-ui/icons/ChevronRight';
import ChevronLeft from '@material-ui/icons/ChevronLeft';

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5,
  },
});

class TablePaginationActions extends React.Component {
  handleFirstPageButtonClick = event => {
    this.props.onChangePage(event, 0);
  };

  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1);
  };

  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1);
  };

  handleLastPageButtonClick = event => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
    );
  };

  render() {
    const { classes, count, page, rowsPerPage, theme } = this.props;

    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="First Page"
        >
          {theme.direction === 'rtl' ? <LastPage /> : <FirstPage />}
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page"
        >
          {theme.direction === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
        >
          {theme.direction === 'rtl' ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page"
        >
          {theme.direction === 'rtl' ? <FirstPage /> : <LastPage />}
        </IconButton>
      </div>
    );
  }
}

TablePaginationActions.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired,
};

const TablePaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(
  TablePaginationActions,
);

const styles = theme => ({
  root: {
    display: 'flex-block',
    alignItems: 'flex-start',
    margin: theme.spacing.unit * 2,
  },
  table: {
    minWidth: 500,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

class CustomPaginationActionsTable extends React.Component {
  constructor(props) {
    super(props);
    this.req = axios.create({
      baseURL: configs.apiUrl,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('access-token'),
      },
    });
    this.state = {
      data: [],
      page: 0,
      rowsPerPage: 5,
    };
  }
  componentDidMount() {
    const startId = this.state.page * this.state.rowsPerPage;
    const count = this.state.rowsPerPage*2;

    this.req.post(`/managers/${startId}/${count}`).then(response=>{
      this.setState({data: response.data});
    }).catch((err)=>{
      window.alert('خطای دسترسی به سرور');
    })
  }
  handleChangePage = (event, page) => 
  {  
      this.setState((prevState)=>
      {
        if(page == Math.ceil(this.state.data.length / this.state.rowsPerPage) - 1) 
        {
          const skipCount = (page+1)*this.state.rowsPerPage;
          const count = this.state.rowsPerPage * 2;
          this.req.post(`/managers/${skipCount}/${count}`).then(response=>
          {
            let prevData = prevState.data;
            prevData = prevData.concat(response.data);
            this.setState({data: prevData});
          }).catch(()=>{
            window.alert('can not contact the server');
          });
        }
        return {page};
      });
  };

  handleChangeRowsPerPage = event => {
    this.setState(prevState=>{
      const oldRowsPerPage = prevState.rowsPerPage;
      const newRowsPerPage = event.target.value;
      const {page} = this.state;
      const newPage = Math.floor((page+1)*oldRowsPerPage/newRowsPerPage);
      if(newPage == Math.ceil(this.state.data.length / newRowsPerPage) - 1) 
      {
        let windowCount = Math.ceil((page + 1)/2);
        const skipCount = (windowCount*2)*oldRowsPerPage;
        const count = newRowsPerPage * 2;
        this.req.post(`/managers/${skipCount}/${count}`).then(response=>
        {
          let prevData = prevState.data;
          prevData = prevData.concat(response.data);
          this.setState({data: prevData});
        }).catch(()=>{
          window.alert('can not contact the server');
        });
      }
      return {rowsPerPage: newRowsPerPage, page: newPage};
    });
  };

  render() {
    const { classes } = this.props;
    const { data, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <div>
        <AdminFilterForm />
        <Paper className={classes.root}>
          <div className={classes.tableWrapper}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <AdminTableHeader />
                </TableRow>
              </TableHead>
              <TableBody>
                {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
                return (
                    <AdminTableData data={n} key={n._id}/>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 48 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  style={{marginLeft:0, marginRight:'16px'}}
                  colSpan={3}
                  count={data.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActionsWrapped}
                  labelRowsPerPage='تعداد در یک سطر'
                  labelDisplayedRows={({from, to, count})=>`${to}-${from} از ${count} سطر `}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Paper>
      </div>
    );
  }
}

CustomPaginationActionsTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(CustomPaginationActionsTable));
