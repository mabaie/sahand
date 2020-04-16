import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import{ withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import MiniDrawer from '../components/Dashboard/DashboardTemp';
const dashboardStyle = theme => {
    return {
        root: {
            flexGrow: 1,
        }
    }
}

class Dashboard extends Component {
    render() {
        return (
            <div>
                <MiniDrawer />
            </div>
        );
    }
}
Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
}
export default withRouter(withStyles(dashboardStyle)(Dashboard));
