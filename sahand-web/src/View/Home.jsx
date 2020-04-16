import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar } from '@material-ui/core';
import homeStyle from '../assets/styles/JSS/Home';
import { withRouter } from 'react-router-dom';
import HomeAppBarContent from '../components/Home/AppBarContent';
import LoginForm from '../components/common/LoginForm';
import PopMessages from '../components/common/PopMessages';
import LandingPage from '../components/landing/landing';
class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            showLogin: false,
            showMessage: false,
            messageType: '',
            message: ''
        }
    }
    handleLogin() {
        this.setState({showLogin: true});
    }
    handleLoginClose() {
        this.setState({showLogin: false});
    }
    handleLoginError(message){
        this.setState({
            showMessage: true,
            messageType: 'error',
            message: message
        })
    }
    handleMessageExited(){
        this.setState({
            showMessage:false,
            messageType: '',
            message: ''
        })
    }
    handleLoginSuccess(message) {
        this.setState({
            showMessage: true,
            messageType: 'success',
            message: message
        })
    }
    render() {
        const { classes } = this.props;
        console.log(this.state.showMessage)
        return (
            <div className={classes.root}>
                {/*<AppBar position='static'>
                    <Toolbar>
                        <HomeAppBarContent onLogin={this.handleLogin.bind(this)}/>
                    </Toolbar>
                </AppBar>*/}
                <LandingPage match={this.props.match} 
                        history={this.props.history} 
                        onClose={this.handleLoginClose.bind(this)}
                        onError={this.handleLoginError.bind(this)}
                        onSuccess={this.handleLoginSuccess.bind(this)} />
                {this.state.showMessage && 
                    <PopMessages 
                        variant={this.state.messageType} 
                        message={this.state.message}
                        open={true}
                        onClose={this.handleMessageExited.bind(this)} />}
                {/*this.state.showLogin && 
                    <LoginForm from={this.props.match} 
                        history={this.props.history} 
                        onClose={this.handleLoginClose.bind(this)}
                        onError={this.handleLoginError.bind(this)}
                        onSuccess={this.handleLoginSuccess.bind(this)}
                />*/}
            </div>
        );
    }
}
Home.propTypes = {
    classes: PropTypes.object.isRequired,
    match: PropTypes.object,
    history: PropTypes.object,
    location: PropTypes.object
}
export default withRouter(withStyles(homeStyle)(Home));
