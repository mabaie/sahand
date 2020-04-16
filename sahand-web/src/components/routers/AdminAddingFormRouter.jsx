import React, {Component} from 'react';
import {Switch, Route, withRouter} from 'react-router-dom';
import AddManagerForm from '../AdminDashboard/AddManagerForm';
import AddStudentForm from '../ManagerDashboard/AddStudentForm';
import AddTeacherForm from '../ManagerDashboard/AddTeacherForm';
import AddClassForm from '../ManagerDashboard/AddClassForm';
import PropTypes from 'prop-types';
import AddCourseForm from '../ManagerDashboard/AddCourseForm';
import AddNewsForm from '../ManagerDashboard/AddNewsForm';
import AddMagazine from '../ManagerDashboard/AddMagazineForm';
import AddReport from '../ManagerDashboard/AddReportForm';
class AdminAddingFormRouter extends Component
{
    render() {
        const {onRegister, onCancel} = this.props;
        return (
            <Switch>
                <Route path='/sahand/admin/dashboard' component={()=>{
                    return <AddManagerForm onRegister={onRegister} onCancel={onCancel} onError={this.props.onError}/>
                }} />
                <Route path='/sahand/manager/dashboard/student-register' component={()=>{
                    return <AddStudentForm onRegister={onRegister} onCancel={onCancel} onError={this.props.onError}/>
                }} />
                 <Route path='/sahand/manager/dashboard/teacher-register' component={()=>{
                    return <AddTeacherForm onRegister={onRegister} onCancel={onCancel} onError={this.props.onError}/>
                }} />
                 <Route path='/sahand/manager/dashboard/class-register' component={()=>{
                    return <AddClassForm onRegister={onRegister} onCancel={onCancel} onError={this.props.onError}/>
                }} />
                
                <Route path='/sahand/manager/dashboard/course-register' component={()=>{
                    return <AddCourseForm onRegister={onRegister} onCancel={onCancel} onError={this.props.onError}/>
                }} />
                <Route path='/sahand/manager/dashboard/news' component={()=>{
                    return <AddNewsForm onRegister={onRegister} onCancel={onCancel} onError={this.props.onError}/>
                }} />
                <Route path='/sahand/manager/dashboard/magazine' component={()=>{
                    return <AddMagazine onRegister={onRegister} onCancel={onCancel} onError={this.props.onError}/>
                }} />
                <Route path='/sahand/manager/dashboard/report' component={()=>{
                    return <AddReport onRegister={onRegister} onCancel={onCancel} onError={this.props.onError}/>
                }} />
            </Switch>
        );
    }
}
AdminAddingFormRouter.propTypes = {
    onRegister: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onError: PropTypes.func,
}
export default withRouter(AdminAddingFormRouter);
