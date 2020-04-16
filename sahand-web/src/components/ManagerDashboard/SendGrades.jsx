import React, {Component} from 'react';
import {Grid, Tabs, Tab, Paper} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from "prop-types";
import DTable from "../DTable/Dtable";
import classRegisterHeader from "../ManagerDashboard/classRegisterHeader";

const styles = theme => ({
    

});

class SendGrades extends Component {
    constructor(props) {
        super(props);

        this.state = {
           
        }

      
    }

    

    render() {
        const {classes} = this.props;
        return (
           
                <DTable
              prefetchLimit={2}
              header={classRegisterHeader}
              url="/classes"
            />
           
        );
    }
}
SendGrades.propTypes = {
    classes: PropTypes.object.isRequired
};
export default withStyles(styles)(SendGrades);