import React, {Component} from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import Home from '../../View/Home';
import Dashboard from '../../View/Dashboard';

class AppRouter extends Component {
    render() {
        return (
            <Switch>
                <Route path='/sahand/admin/dashboard' component={Dashboard} />
                <Route path='/sahand/manager/dashboard' component={Dashboard} />
                <Route path='/sahand/teacher/dashboard' component={Dashboard} />
                <Route path='/sahand/parent/dashboard' component={Dashboard} />
                <Route path='/' component={Home} />
            </Switch>
        )
    }
}
export default withRouter(AppRouter);
