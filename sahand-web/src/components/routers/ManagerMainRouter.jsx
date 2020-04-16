import React from "react";
import { Switch, Route } from "react-router-dom";
import Main from "../ManagerDashboard/Main";
import DTable from "../DTable/Dtable";
import studentRegisterHeader from "../ManagerDashboard/studentRegisterHeader";
import teacherRegisterHeader from "../ManagerDashboard/teacherRegisterHeader";
import classRegisterHeader from "../ManagerDashboard/classRegisterHeader";
import courseRegisterHeader from '../ManagerDashboard/courseRegisterHeader';
import newsHeader from '../ManagerDashboard/newsHeader';
import magazineHeader from '../ManagerDashboard/magazineHeader';
import reportHeaderSchool from '../ManagerDashboard/reportHeader';
import Calendar from '../ManagerDashboard/Calendar';
import Encourage from '../ManagerDashboard/Encourage';
import Settings from "../ManagerDashboard/Settings";
import Gallery from "../common/gallery/Gallery";
import HomeActivity from "../ManagerDashboard/HomeActivity";
import Appointment from "../ManagerDashboard/SettingAppointments";
import Chats from "../ManagerDashboard/Chats";
import Evaluation from "../ManagerDashboard/Evaluation";
import MainReport from "../ManagerDashboard/MainReport";
import StudentReport from "../ManagerDashboard/reportStudent";


function ManagerMainRouter(props) {
  const url = {
    students: "/students",
    teachers: "/teachers",
    classes: "/classes",
    courses: "/courses",
    newses: "/newses",
    magazines: "/magazines",
    reports_school: "/reportes"
  };
  return (
    <Switch>
      <Route
        path="/sahand/manager/dashboard/report/school"
        component={() => {
          return (
            <DTable
              prefetchLimit={2}
              header={reportHeaderSchool}
              url={url.reports_school}
            />
          );
        }}
      />
      <Route
        path="/sahand/manager/dashboard/report/students"
        component={StudentReport}
      />

      <Route
        path="/sahand/manager/dashboard/teacher-register"
        component={() => {
          return (
            <DTable
              prefetchLimit={2}
              header={teacherRegisterHeader}
              url={url.teachers}
            />
          );
        }}
      />

      <Route
        path="/sahand/manager/dashboard/student-register"
        component={() => {
          return (
            <DTable
              prefetchLimit={2}
              header={studentRegisterHeader}
              url={url.students}
            />
          );
        }}
      />
      <Route
        path="/sahand/manager/dashboard/class-register"
        component={() => {
          return (
            <DTable
              prefetchLimit={2}
              header={classRegisterHeader}
              url={url.classes}
            />
          );
        }}
      />
      <Route
        path="/sahand/manager/dashboard/course-register"
        component={() => {
          return (
            <DTable
              prefetchLimit={2}
              header={courseRegisterHeader}
              url={url.courses}
            />
          );
        }}
      />
      <Route
        path="/sahand/manager/dashboard/class-work"
        component={() => {
          return (
            <DTable
              prefetchLimit={2}
              header={courseRegisterHeader}
              url={url.courses}
            />
          );
        }}
      />
      <Route
        path="/sahand/manager/dashboard/Settings"
        component={() => {
          return (
            <Settings />
          );
        }}
      />
      <Route
        path="/sahand/manager/dashboard/news"
        component={() => {
          return (
            <DTable
              prefetchLimit={2}
              header={newsHeader}
              url={url.newses}
            />
          );
        }}
      />
      <Route
        path="/sahand/manager/dashboard/magazine"
        component={() => {
          return (
            <DTable
              prefetchLimit={2}
              header={magazineHeader}
              url={url.magazines}
            />
          );
        }}
      />
      <Route
        path="/sahand/manager/dashboard/report"
        component={MainReport}
      />
      <Route
        path="/sahand/manager/dashboard/calendar"
        component={() => {
          return (
            <Calendar />
          );
        }}
      />
      <Route
        path="/sahand/manager/dashboard/gallery"
        component={() => {
          return (
            <Gallery/>
          );
        }}
      />
      <Route
        path="/sahand/manager/dashboard/encourage"
        component={() => {
          return (
            <Encourage />
          );
        }}
      />
      <Route
        path="/sahand/manager/dashboard/home-activity"
        component={() => {
          return (
            <HomeActivity />
          );
        }}
      />
      <Route
        path="/sahand/manager/dashboard/appointment"
        component={() => {
          return (
            <Appointment />
          );
        }}
      />
      <Route 
        path='/sahand/manager/dashboard/messages' 
        component={()=>{
          return (
          <Chats />
          )
          }} 
      />
      <Route
        path="/sahand/manager/dashboard/evaluation"
        component={() => {
          return (
            <Evaluation />
          );
        }}
      />
      <Route path="/sahand/manager/dashboard/" component={Main} />
    </Switch>
  );
}
export default ManagerMainRouter;
