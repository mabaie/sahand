import React from 'react';
import {Switch, Route} from 'react-router-dom';
import DTable from '../DTable/Dtable';
import About from "../ParentDashboard/About";
import HomeActivity from "../ParentDashboard/HomeActivity";
import Attendance from "../ParentDashboard/attendance";
import Assignments from "../ParentDashboard/Assignments";
import Encourages from "../ParentDashboard/Encourages";
import StudentTimeTable from "../ParentDashboard/StudentTimeTable";
import ParentGallery from "../ParentDashboard/ParentGallery";
import Main from "../ParentDashboard/Main";
import newsHeader from "../ParentDashboard/newsHeader";
import reportHeader from "../ParentDashboard/reportHeader";
import magazineHeader from '../ParentDashboard/magazineHeader';
import Appointments from "../ParentDashboard/Appointments";
import Calendar from "../ParentDashboard/Calendar";
import Chats from "../ParentDashboard/Chats";
        
function ParentMainRouter(props)
{
  const url = {
    newses: `/app/parent/school/newses/${localStorage.getItem("student-id")}`,
    reports: `/app/parent/school/reports/${localStorage.getItem("student-id")}`,
    magazines: `/app/parent/school/magazines/${localStorage.getItem("student-id")}`,
  }

  return (
    <Switch>
      <Route exact path="/sahand/parent/dashboard/" component={Main} />
        <Route path="/sahand/parent/dashboard/assignments"  component={() => {
          return (
            
            <Assignments />
          );
        }} />
        <Route path='/sahand/parent/dashboard/homeActivity' component={()=>{
        return ( <HomeActivity />)}} />
        <Route path='/sahand/parent/dashboard/attendanceReport' component={()=>{
        return (<Attendance />)}} />
        <Route path='/sahand/parent/dashboard/addAppointment' component={()=>{
        return (
        <Appointments />
        )}} />
        <Route path='/sahand/parent/dashboard/encourages' component={()=>{
        return (
          
          <Encourages />
        );}} />
        <Route path='/sahand/parent/dashboard/news' component={()=>{
        return (
          
          <DTable
            prefetchLimit={2}
            header={newsHeader}
            url={url.newses}
          />
        );}} />
        <Route path='/sahand/parent/dashboard/gallery' component={()=>{
        return (<ParentGallery />)}} />
        <Route path='/sahand/parent/dashboard/messages' component={()=>{
        return (<Chats />)}} />
        <Route path='/sahand/parent/dashboard/studentTimeTable' component={()=>{
        return (<StudentTimeTable />)}} />
        <Route path='/sahand/parent/dashboard/report' component={()=>{
        return (
          <DTable
            prefetchLimit={2}
            header={reportHeader}
            url={url.reports}
          />
        );}} />
        <Route path='/sahand/parent/dashboard/about' component={()=>{
        return (<About />)}} />
        <Route path='/sahand/parent/dashboard/magazine' component={()=>{
        return ( <DTable
          prefetchLimit={2}
          header={magazineHeader}
          url={url.magazines}
        />)}} />
         <Route
        path="/sahand/parent/dashboard/calendar"
        component={() => {
          return (
           
             <Calendar />
          );
        }}
      />
    </Switch>
  );
}
export default ParentMainRouter;
