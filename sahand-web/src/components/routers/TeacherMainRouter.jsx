import React from 'react';
import {Switch, Route} from 'react-router-dom';
import DTable from '../DTable/Dtable';
 import About from "../TeacherDashboard/About";
// import HomeActivity from "../ParentDashboard/HomeActivity";
 import Attendance from "../TeacherDashboard/Attendance";
 //import Appointments from "../TeacherDashboard/Appointments";
 import SendAssignment from "../TeacherDashboard/SendAssignment";
 import Encourages from "../TeacherDashboard/Encourages";
 import TeacherTimeTable from "../TeacherDashboard/TeacherTimeTable";
import TeacherGallery from "../TeacherDashboard/Gallery";
import Students from "../TeacherDashboard/Students";
import Calendar from "../TeacherDashboard/Calendar";
import Main from "../TeacherDashboard/Main";
import newsHeader from "../ParentDashboard/newsHeader";
import magazineHeader from '../ParentDashboard/magazineHeader';
import Chats from "../TeacherDashboard/Chats";
 

function ParentMainRouter(props)
{
  const url = {
    newses: `/app/teacher/school/newses/${localStorage.getItem("school-id")}`,
    magazines: `/app/teacher/school/magazines/${localStorage.getItem("school-id")}`,
  }

  return (
    <Switch>
      <Route exact path="/sahand/teacher/dashboard/" component={Main} />
        <Route path='/sahand/teacher/dashboard/attendance' component={()=>{
          return (
         
          <Attendance />
          )}} />
        <Route path='/sahand/teacher/dashboard/students' component={()=>{
          return (
         
           <Students />
          )}} />
        <Route path='/sahand/teacher/dashboard/news' component={()=>{
        return (
          <DTable
            prefetchLimit={2}
            header={newsHeader}
            url={url.newses}
          />
        );}} />
        <Route path='/sahand/teacher/dashboard/gallery' component={()=>{
          return (
          
           <TeacherGallery />
          )}} />
        <Route path='/sahand/teacher/dashboard/encourages' component={()=>{
        return (
          
           <Encourages />
        );}} />
        <Route path="/sahand/teacher/dashboard/sendAssignment"  component={() => {
          return (
           
             <SendAssignment />
          );
        }} />
        <Route path="/sahand/teacher/dashboard/grade"  component={() => {
          return (<div></div>
            // <Grade />
          );
        }} />
        <Route path='/sahand/teacher/dashboard/messages' component={()=>{
        return (<Chats />)}} />
        <Route path='/sahand/teacher/dashboard/teacherTimeTable' component={()=>{
        return (
         <TeacherTimeTable />
        )}} />
        <Route
        path="/sahand/teacher/dashboard/calendar"
        component={() => {
          return (
           
             <Calendar />
          );
        }}
      />
      <Route path='/sahand/teacher/dashboard/homeActivity' component={()=>{
      return (<div></div>
        //  <HomeActivity />
         )}} />
      <Route path='/sahand/teacher/dashboard/magazine' component={()=>{
        return ( <DTable
          prefetchLimit={2}
          header={magazineHeader}
          url={url.magazines}
        />)}} />
      <Route path='/sahand/teacher/dashboard/about' component={()=>{
        return (
        
         <About />
        )}} />
      <Route path='/sahand/teacher/dashboard/appointments' component={()=>{
      return (
        <div></div>
      //<Appointments />
      )}} />
      
        
    </Switch>
  );
}
export default ParentMainRouter;
