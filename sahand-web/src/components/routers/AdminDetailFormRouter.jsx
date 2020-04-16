import React, {Component} from 'react';
import {Switch, Route, withRouter} from 'react-router-dom';
import ManagerDetailForm from '../AdminDashboard/ManagerInfo';
import PropTypes from 'prop-types';
import StudentDetailPanel from '../ManagerDashboard/studentDetailPanel';
import TeacherInfo from '../ManagerDashboard/TeacherInfo'
import ClassInfo from '../ManagerDashboard/ClassInfo'
import CourseDetailPanel from '../ManagerDashboard/courseDetailPanel';
import NewsDetailPanelManager from '../ManagerDashboard/NewsDetailPanel';
import NewsDetailPanelParent from '../ParentDashboard/NewsDetailPanel';
import MagazineDetailPanel from '../ManagerDashboard/magazinDetailPanel';
import ReportDetailPanelManager from '../ManagerDashboard/reportDetailPanel';
import ClassWorkDetailPanel from '../ManagerDashboard/ClassWorkDetailPanel';

import MagazineDetailPanelParent from '../ParentDashboard/magazinDetailPanel';
import ReportDetailPanelParent from '../ParentDashboard/reportDetailPanel';

class AdminDetailFormRouter extends Component
{
    render() {
        const { record } = this.props;
        return (
            <Switch>
                <Route path='/sahand/admin/dashboard' component={()=>{
                    return <ManagerDetailForm record={record} waiting={this.props.waiting} onWaiting={this.props.onWaiting} onRegister={this.props.onRegister}/>
                }} />
                <Route path='/sahand/manager/dashboard/student-register/' component={()=>{
                    return <StudentDetailPanel record={record} waiting={this.props.waiting} onWaiting={this.props.onWaiting} onRegister={this.props.onRegister}/>
                }} />
                <Route path='/sahand/manager/dashboard/teacher-register/' component={()=>{
                    return <TeacherInfo record={record} waiting={this.props.waiting} onWaiting={this.props.onWaiting} onRegister={this.props.onRegister}/>
                }} />
                <Route path='/sahand/manager/dashboard/class-register/' component={()=>{
                    return <ClassInfo record={record} waiting={this.props.waiting} onWaiting={this.props.onWaiting} onRegister={this.props.onRegister}/>
                }} />
                <Route path='/sahand/manager/dashboard/evaluation' component={()=>{
                    return <ClassInfo record={record} waiting={this.props.waiting} onWaiting={this.props.onWaiting} onRegister={this.props.onRegister}/>
                }} />
                <Route path='/sahand/manager/dashboard/course-register/' component={()=>{
                    return <CourseDetailPanel record={record} waiting={this.props.waiting} onWaiting={this.props.onWaiting} onRegister={this.props.onRegister}/>
                }} />
                <Route path='/sahand/manager/dashboard/class-work/' component={()=>{
                    return <ClassWorkDetailPanel record={record} waiting={this.props.waiting} onWaiting={this.props.onWaiting} onRegister={this.props.onRegister}/>
                }} />
                <Route path='/sahand/manager/dashboard/news' component={()=>{
                    return <NewsDetailPanelManager record={record} waiting={this.props.waiting} onWaiting={this.props.onWaiting} onRegister={this.props.onRegister}/>
                }} />
                <Route path='/sahand/manager/dashboard/magazine' component={()=>{
                    return <MagazineDetailPanel record={record} waiting={this.props.waiting} onWaiting={this.props.onWaiting} onRegister={this.props.onRegister}/>
                }} />
                <Route path='/sahand/manager/dashboard/report' component={()=>{
                    return <ReportDetailPanelManager record={record} waiting={this.props.waiting} onWaiting={this.props.onWaiting} onRegister={this.props.onRegister}/>
                }} />
                <Route path='/sahand/parent/dashboard/news' component={()=>{
                    return <NewsDetailPanelParent record={record} waiting={this.props.waiting} onWaiting={this.props.onWaiting} onRegister={this.props.onRegister}/>
                }} />
                <Route path='/sahand/parent/dashboard/assignments' component={()=>{
                    return <AssignmentsDetailPanel record={record} waiting={this.props.waiting} onWaiting={this.props.onWaiting} onRegister={this.props.onRegister}/>
                }} />
                <Route path='/sahand/parent/dashboard/report' component={()=>{
                    return <ReportDetailPanelParent record={record} waiting={this.props.waiting} onWaiting={this.props.onWaiting} onRegister={this.props.onRegister}/>
                }} />
               <Route path='/sahand/parent/dashboard/magazine' component={()=>{
                    return <MagazineDetailPanelParent record={record} waiting={this.props.waiting} onWaiting={this.props.onWaiting} onRegister={this.props.onRegister}/>
                }} />
                <Route path='/sahand/teacher/dashboard/magazine' component={()=>{
                    return <MagazineDetailPanelParent record={record} waiting={this.props.waiting} onWaiting={this.props.onWaiting} onRegister={this.props.onRegister}/>
                }} />
                <Route path='/sahand/teacher/dashboard/news' component={()=>{
                    return <NewsDetailPanelParent record={record} waiting={this.props.waiting} onWaiting={this.props.onWaiting} onRegister={this.props.onRegister}/>
                }} />
            </Switch>
        );
    }
}
AdminDetailFormRouter.propTypes = {
    record: PropTypes.object.isRequired,
    onWaiting: PropTypes.func.isRequired,
    waiting: PropTypes.bool.isRequired,
    onRegister: PropTypes.func.isRequired,
}
export default withRouter(AdminDetailFormRouter);
