import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import homeAppBarContentStyles from '../../assets/styles/JSS/Home/AppBarContentStyles';

class HomeAppBarContent extends Component {
    render() {
        const {classes, onLogin} = this.props;
        return (
            <div className={classes.root}>
                <Button className={classes.button} color='inherit' onClick={onLogin}>ورود</Button>
            </div>
        );
    }
}

HomeAppBarContent.propTypes = {
    classes: PropTypes.object.isRequired,
    onLogin: PropTypes.func.isRequired
}

export default withStyles(homeAppBarContentStyles)(HomeAppBarContent);