import React, { Component } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import ManagerData from "../AdminDashboard/ManagerData";
import StudentData from "../ManagerDashboard/StudentData";
import PropTypes from "prop-types";
import TeacherData from "../ManagerDashboard/teacherData";
import ClassData from "../ManagerDashboard/classData";
import CourseData from "../ManagerDashboard/CourseData";
import NewsDataManager from "../ManagerDashboard/NewsData";
import MagazineData from "../ManagerDashboard/magazineData";
import ReportDataManager from "../ManagerDashboard/reportData";

import MagazineDataParent from "../ParentDashboard/magazineData";
import NewsDataParent from "../ParentDashboard/NewsData";
import ReportDataParent from "../ParentDashboard/reportData";

class AdminTableRouter extends Component {
  render() {
    const { record } = this.props;
    return (
      <Switch>
        <Route
          path="/sahand/admin/dashboard"
          component={() => {
            return <ManagerData record={record} />;
          }}
        />
        <Route
          path="/sahand/manager/dashboard/student-register"
          component={() => {
            return <StudentData record={record} />;
          }}
        />
        <Route
          path="/sahand/manager/dashboard/teacher-register"
          component={() => {
            return <TeacherData record={record} />;
          }}
        />
        <Route
          path="/sahand/manager/dashboard/class-register"
          component={() => {
            return <ClassData record={record} />;
          }}
        />
        <Route
          path="/sahand/manager/dashboard/evaluation"
          component={() => {
            return <ClassData record={record} />;
          }}
        />
        <Route
          path="/sahand/manager/dashboard/course-register"
          component={() => {
            return <CourseData record={record} />;
          }}
        />
        <Route
          path="/sahand/manager/dashboard/class-work"
          component={() => {
            return <CourseData record={record} />;
          }}
        />
        <Route
          path="/sahand/manager/dashboard/news"
          component={() => {
            return <NewsDataManager record={record} />;
          }}
        />
        <Route
          path="/sahand/parent/dashboard/news"
          component={() => {
            return <NewsDataParent record={record} />;
          }}
        />
        <Route
          path="/sahand/teacher/dashboard/news"
          component={() => {
            return <NewsDataParent record={record} />;
          }}
        />
        <Route
          path="/sahand/manager/dashboard/magazine"
          component={() => {
            return <MagazineData record={record} />;
          }}
        />
        <Route
          path="/sahand/parent/dashboard/magazine"
          component={() => {
            return <MagazineDataParent record={record} />;
          }}
        />
        <Route
          path="/sahand/teacher/dashboard/magazine"
          component={() => {
            return <MagazineDataParent record={record} />;
          }}
        />
        <Route
          path="/sahand/manager/dashboard/report"
          component={() => {
            return <ReportDataManager record={record} />;
          }}
        />
        <Route
          path="/sahand/parent/dashboard/report"
          component={() => {
            return <ReportDataParent record={record} />;
          }}
        />
        
      </Switch>
    );
  }
}

AdminTableRouter.propTypes = {
  record: PropTypes.object.isRequired
};

export default withRouter(AdminTableRouter);
