import React, {Component} from 'react';
import TeacherGallery from './TeacherGallery.js';
import BossGallery from './BossGallery.js';
import {Grid, Tabs, Tab, Paper} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from "prop-types";

const styles = theme => ({
    container: {
        textAlign: 'right'
    },
    tab: {
        backgroundColor: '#33eaff'
    },
    tabsContent: {
        padding: '2em'
    }

});

class Gallery extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: 0
        }

        this.handleChangeTab = this
            .handleChangeTab
            .bind(this)
    }

    selectTab(name) {
        this.setState({tab: name})
    }

    handleChangeTab(event, value) {
        this.setState({value});
    }

    render() {
        const {classes} = this.props;
        return (
            <div style={{
                    flexGrow: 1
                }}>
                <Grid className={classes.container} container spacing={24}>
                    <Paper
                        style={{
                            flexGrow: 1
                        }}>
                        <Grid item xs={12}>

                            <Tabs
                                centered={true}
                                className={classes.tab}
                                value={this.state.value}
                                onChange={this.handleChangeTab}
                                indicatorColor='secondary'>

                                <Tab label="گالری معلم"/>
                                <Tab label="گالری مدیر"/>

                            </Tabs>
                        </Grid>
                        <Grid className={classes.tabsContent} item xs={12}>

                            {
                                (this.state.value === 0)
                                    ? <TeacherGallery></TeacherGallery>
                                    : <BossGallery></BossGallery>

                            }

                        </Grid>
                    </Paper>
                </Grid>
            </div>
        );
    }
}
Gallery.propTypes = {
    classes: PropTypes.object.isRequired
};
export default withStyles(styles)(Gallery);