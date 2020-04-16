import React, { Component } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import FilterForm from '../DTable/FilterForm';
import TeacherForm from '../ManagerDashboard/TeacherListFilterForm';
import PropTypes from 'prop-types';
import CourseFilterForm from '../ManagerDashboard/CourseFilterForm';
import ClassFilterForm from '../ManagerDashboard/ClassFilterForm';
import ClassFilterFormEvaluation from '../ManagerDashboard/ClassFilterFormEvaluation';
import NewsFilterForm from '../ManagerDashboard/NewsFilterForm';
import MagazineFilterForm from '../ManagerDashboard/magazineFilterForm';
import ReportFilterForm from '../ManagerDashboard/reportFilterForm';
import ClassWorkFilterForm from '../ManagerDashboard/ClassWorkFilterForm';

class FilterFormRouter extends Component {
  render() {
    return (
      <Switch>
        <Route
          path="/sahand/admin/dashboard"
          component={() => {
            return <FilterForm onChange={this.props.onChange} waiting={this.props.waiting} onError={this.props.onError} onRegister={this.props.onRegister} onDelete={this.props.onDelete}/>;
          }}
        />
        <Route
          path="/sahand/manager/dashboard/student-register"
          component={() => {
            return <FilterForm onChangeSort={this.props.onChangeSort} onChange={this.props.onChange} waiting={this.props.waiting} onError={this.props.onError} onRegister={this.props.onRegister} onDelete={this.props.onDelete}/>;
          }}
        />
        <Route
          path="/sahand/manager/dashboard/teacher-register"
          component={() => {
            return <TeacherForm onChange={this.props.onChange} waiting={this.props.waiting} onError={this.props.onError} onRegister={this.props.onRegister} onDelete={this.props.onDelete}/>;
          }}
        />
        <Route
          path="/sahand/manager/dashboard/class-register"
          component={() => {
            return <ClassFilterForm onChange={this.props.onChange} waiting={this.props.waiting} onError={this.props.onError} onRegister={this.props.onRegister} onDelete={this.props.onDelete}/>;
          }}
        />
        <Route
          path="/sahand/manager/dashboard/evaluation"
          component={() => {
            return <ClassFilterFormEvaluation onChange={this.props.onChange} waiting={this.props.waiting} onError={this.props.onError} onRegister={this.props.onRegister} onDelete={this.props.onDelete}/>;
          }}
        />
        <Route
          path="/sahand/manager/dashboard/course-register"
          component={() => {
            return <CourseFilterForm onChange={this.props.onChange} waiting={this.props.waiting} onError={this.props.onError} onRegister={this.props.onRegister} onDelete={this.props.onDelete}/>;
          }}
        />
        <Route
          path="/sahand/manager/dashboard/news"
          component={() => {
            return <NewsFilterForm onChange={this.props.onChange} waiting={this.props.waiting} onError={this.props.onError} onRegister={this.props.onRegister} onDelete={this.props.onDelete}/>;
          }}
        />
        <Route
          path="/sahand/manager/dashboard/magazine"
          component={() => {
            return <MagazineFilterForm onChange={this.props.onChange} waiting={this.props.waiting} onError={this.props.onError} onRegister={this.props.onRegister} onDelete={this.props.onDelete}/>;
          }}
        />
        <Route
          path="/sahand/manager/dashboard/report"
          component={() => {
            return <ReportFilterForm onChange={this.props.onChange} waiting={this.props.waiting} onError={this.props.onError} onRegister={this.props.onRegister} onDelete={this.props.onDelete}/>;
          }}
        />
        <Route
          path="/sahand/manager/dashboard/class-work"
          component={() => {
            return <ClassWorkFilterForm onChange={this.props.onChange} waiting={this.props.waiting} onError={this.props.onError}/>;
          }}
        />
      </Switch>
    );
  }
}

FilterFormRouter.propTypes = {
  onChange: PropTypes.func.isRequired,
  onChangeSort: PropTypes.func,
  waiting: PropTypes.bool.isRequired,
  onError: PropTypes.func,
  onRegister: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default withRouter(FilterFormRouter);
