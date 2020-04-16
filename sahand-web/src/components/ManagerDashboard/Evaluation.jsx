import React, {Component} from 'react';
import {Grid, Tabs, Tab, Paper} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from "prop-types";

import RegisterGrades from './RegisterGrades';
import EvaluationTitels from './EvaluationTitels';
import Terms from './Terms';
import SendGrades from './SendGrades';
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

class Evaluation extends Component {
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
                    flexGrow: 1,
                    padding:32
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

                                <Tab label="ترم"/>
                                <Tab label="عناوین نمره‌دهی"/>
                                <Tab label="ثبت نمرات"/>
                                <Tab label="ارسال نمرات"/>
                            </Tabs>
                        </Grid>
                        <Grid className={classes.tabsContent} item xs={12}>

                            {
                                (this.state.value === 0)
                                    ? 
                                    <Terms  />
                                    : (this.state.value === 1)
                                    ?
                                    <EvaluationTitels />
                                    : (this.state.value === 2)
                                    ?
                                    <RegisterGrades />
                                    :
                                    <SendGrades />
                            }

                        </Grid>
                    </Paper>
                </Grid>
            </div>
        );
    }
}
Evaluation.propTypes = {
    classes: PropTypes.object.isRequired
};
export default withStyles(styles)(Evaluation);