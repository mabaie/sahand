'use strict';
import React, {Component} from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import theme from './assets/styles/themes/root';
import AppRouter from './components/routers/App';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { create } from 'jss';
import rtl from 'jss-rtl';
import JssProvider from 'react-jss/lib/JssProvider';
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles';
import PropTypes from 'prop-types'; 

import './App.css';

// Configure JSS
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

// Custom Material-UI class name generator.
const generateClassName = createGenerateClassName();

function RTL(props) {
  return (
    <JssProvider jss={jss} generateClassName={generateClassName}>
      {props.children}
    </JssProvider>
  );
}
RTL.propTypes = {
    children: PropTypes.object.isRequired,
}

export default class App extends Component{
    render() {
        return (
            <Router>
                <RTL>
                    <MuiThemeProvider theme={theme}>
                        <AppRouter />
                    </MuiThemeProvider>
                </RTL>
            </Router>
        );        
    }
}