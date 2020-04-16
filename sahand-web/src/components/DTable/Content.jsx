import React, { Component } from "react";
import {
  TableCell,
  TableRow,
  IconButton,
  Collapse,
  Checkbox
} from "@material-ui/core";
import compose from 'recompose/compose';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';
import ExpandMore from "@material-ui/icons/ExpandMore";
import ExpandLess from "@material-ui/icons/ExpandLess";
import PropTypes from "prop-types";
import _ from "lodash";
import axios from "axios";
import configs from "../../configs";
import AdminDetailFormRouter from "../routers/AdminDetailFormRouter";
import { withRouter } from "react-router-dom";
import AdminTableRouter from "../routers/AdminTableRouter";

function fetch(url, skip, limit, filter,sort="id") {
  const req = axios.create({
    baseURL: configs.apiUrl,
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("access-token")
    }
  });
  const data = JSON.stringify({
    skip: skip,
    limit: limit,
    filter: filter,
    sort: sort
  });
  return req.post(url, data).catch(err => {
    
  });
}

class DetailForm extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { onRegister, record, columnCount, waiting, onWaiting } = this.props;
    return (
      <tr>
        <td colSpan={columnCount}>
          <Collapse in={!this.props.open}>
            <AdminDetailFormRouter
              record={record}
              waiting={waiting}
              onWaiting={onWaiting}
              onRegister={onRegister}
            />
          </Collapse>
        </td>
      </tr>
    );
  }
}
DetailForm.propTypes = {
  open: PropTypes.bool.isRequired,
  record: PropTypes.object.isRequired,
  columnCount: PropTypes.number.isRequired,
  waiting: PropTypes.bool.isRequired,
  onWaiting: PropTypes.func.isRequired,
  onRegister: PropTypes.func.isRequired
};

const DetailFormWrapper = withRouter(DetailForm);
class TableRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: true,
    };
    this.handleExpandClick = this.handleExpandClick.bind(this);
    this.handleCheckChange = this.handleCheckChange.bind(this);
  }
  handleExpandClick() {
    this.setState(prevState => {
      return { expand: !prevState.expand };
    });
  }
  handleCheckChange(e) {
    this.props.onCheck(e.target.checked, this.props.record._id);
  }
  render() {
    const { record, columnCount, waiting, onWaiting, onRegister } = this.props;
    return (
      <React.Fragment>
        <TableRow 
          onClick={
            isWidthDown('sm', this.props.width)?this.handleExpandClick:()=>{}} hover>
              {!isWidthDown('sm', this.props.width) &&
                <TableCell padding='checkbox'>
                  <Checkbox
                    checked={this.props.checked}
                    onChange={this.handleCheckChange}
                    value="checked"
                  />
                  <IconButton>
                    {this.state.expand ? (
                      <ExpandMore onClick={this.handleExpandClick} />
                    ) : (
                      <ExpandLess onClick={this.handleExpandClick} />
                    )}
                  </IconButton>
                </TableCell>
              }
          <AdminTableRouter record={record} />
        </TableRow>
        {!this.state.expand && <DetailFormWrapper
          open={this.state.expand}
          record={record}
          columnCount={columnCount}
          waiting={waiting}
          onWaiting={onWaiting}
          onRegister={onRegister}
        />}
      </React.Fragment>
    );
  }
}
TableRecord.propTypes = {
  record: PropTypes.object.isRequired,
  columnCount: PropTypes.number.isRequired,
  waiting: PropTypes.bool.isRequired,
  onWaiting: PropTypes.func.isRequired,
  onRegister: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
  onCheck: PropTypes.func.isRequired
};

const TableRecordWrapper = withRouter((withWidth()) (TableRecord));

class Content extends Component {
  constructor(props) {
    super(props);
    this.url = "";
    this.steps = 100;
    this.lastFilter = { ID: "default" };
    this.lastSort = "default";
    this.lastCheckAll = false;
    this.getData = this.getData.bind(this);
    this.state = {
      checked: {},
      error: false,
    };
    this.rowsPerPage = 0;
    this.firstBeInLastPage = true;
    this.handleCheckChange = this.handleCheckChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }
  componentDidMount() {
    this.url = this.props.url;
    this.steps = this.props.rowsPerPage*this.props.prefetchLimit;
    this.rowsPerPage = this.props.rowsPerPage;
    fetch(this.url, 0, this.steps, this.lastFilter).then(workingSet => {
      if (workingSet.data) {
        this.props.onWorkingSetChange(workingSet.data);
      }
    });
  }
  componentWillUnmount() {
    this.url = "";
    this.setState({ checked: {} });
  }
  componentDidUpdate() {
    const { workingSet, rowsPerPage, page, filter, reload, sort, checkAll} = this.props;
    const lastPage = Math.ceil(workingSet.length / rowsPerPage);
    if (!this.state.error) {
      if(lastPage !== page){
          this.firstBeInLastPage = true;
      }
      if(this.props.rowsPerPage !== this.rowsPerPage){
        this.rowsPerPage = this.props.rowsPerPage;
        this.steps = this.props.prefetchLimit * this.props.rowsPerPage;
      }
      if (reload) {
        this.id = 0;
        this.firstBeInLastPage = true;
        this.lastFilter = { ID: "default" };
        this.lastCheckAll=checkAll
        this.lastSort = "default";
        fetch(this.url, 0, this.steps, this.lastFilter ,this.lastSort).then(workingSet => {
          if (workingSet.data) {
            this.props.onWorkingSetChange(workingSet.data);
          }
        });
      } else if (this.props.mustDelete) {
        this.firstBeInLastPage = true;
        this.handleDelete();
      } else if (lastPage === page && this.firstBeInLastPage) {
        this.firstBeInLastPage = false;
        fetch(
          this.url,
          0,
          workingSet.length + this.steps,
          this.lastFilter,
          this.lastSort
        ).then(workingSet => {
          if (workingSet) {
            this.props.onWorkingSetChange(workingSet.data);
          }
        });
      }
      if (!_.isEqual(this.lastFilter, filter) || !_.isEqual(this.lastSort, sort)) {
        this.firstBeInLastPage = true;
        //this.lastFilter = filter;
        //Object.assign(this.lastFilter, filter);
        this.lastFilter = Object.assign({}, filter);
        this.lastSort = sort;
        fetch(this.url, 0, this.steps, this.lastFilter,this.lastSort).then(workingSet => {
          if (workingSet.data) {
            this.props.onWorkingSetChange(workingSet.data);
          }
        });
      }else if(this.lastCheckAll!=checkAll){
        const { workingSet, page, rowsPerPage, columnCount } = this.props;
        const data = workingSet;
        this.lastCheckAll=checkAll

        const startIdx = (page - 1) * rowsPerPage;
        const endIdx = Math.min(startIdx + rowsPerPage, data.length);
        const pageData = data.slice(startIdx, endIdx);
        pageData.map(record => {
          if (this.lastCheckAll) {
            this.setState(prevState => {
              let nextState = prevState.checked;
              nextState[record._id] = this.lastCheckAll;
              return { checked: nextState };
            });
          } else {
            this.setState(prevState => {
              let nextState = prevState.checked;
              delete nextState[record._id];
              return { checked: nextState };
            });
          }
        });
      }
    } else if (this.props.errorExit.length == 0) {
      this.firstBeInLastPage = true;
      this.setState({ error: false });
    }
  }
  handleCheckChange(value, id) {
    if (value) {
      this.setState(prevState => {
        let nextState = prevState.checked;
        nextState[id] = value;
        return { checked: nextState };
      });
    } else {
      this.setState(prevState => {
        let nextState = prevState.checked;
        delete nextState[id];
        return { checked: nextState };
      });
    }
  }
  handleDelete() {
    let ids = Object.keys(this.state.checked);
    
    const body = { ids: ids };
    const req = axios.create({
      baseUrl: configs.apiUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("access-token")
      }
    });
    if (ids.length > 0) {
      req
        .delete("/sahand/api/v1" + this.props.url.slice(0, -1), { data: body })
        .then(() => {
          this.props.onRegister();
          this.setState({ checked: [] });
        })
        .catch(() => {
          this.setState({ error: true });
          this.props.onError("خطای دسترسی به سرور");
        });
    } else {
      
      this.setState({ error: true });
      this.props.onError("چیزی انتخاب نشده است");
    }
  }
  getData(data, page, rowsPerPage, columnCount) {
    const startIdx = (page - 1) * rowsPerPage;
    const endIdx = Math.min(startIdx + rowsPerPage, data.length);
    const pageData = data.slice(startIdx, endIdx);
    return pageData.map(record => {
      return (
        <TableRecordWrapper
          record={record}
          key={record._id}
          columnCount={columnCount}
          waiting={this.props.waiting}
          onWaiting={this.props.onWaiting}
          onRegister={this.props.onRegister}
          checked={Boolean(this.state.checked[record._id])}
          onCheck={this.handleCheckChange}
        />
      );
    });
  }
  render() {
    const { workingSet, page, rowsPerPage, columnCount } = this.props;
    return (
      <React.Fragment>
        {this.getData(workingSet, page, rowsPerPage, columnCount)}
      </React.Fragment>
    );
  }
}

Content.propTypes = {
  url: PropTypes.string.isRequired,
  workingSet: PropTypes.array.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  onWorkingSetChange: PropTypes.func.isRequired,
  prefetchLimit: PropTypes.number.isRequired,
  filter: PropTypes.object.isRequired,
  sort: PropTypes.string.isRequired,
  checkAll: PropTypes.bool.isRequired,
  columnCount: PropTypes.number.isRequired,
  waiting: PropTypes.bool.isRequired,
  onWaiting: PropTypes.func.isRequired,
  reload: PropTypes.bool.isRequired,
  onRegister: PropTypes.func.isRequired,
  mustDelete: PropTypes.bool.isRequired,
  onError: PropTypes.func.isRequired,
  errorExit: PropTypes.array.isRequired
};

export default withRouter(Content);
