import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {TableCell, Typography} from '@material-ui/core';
import persian from 'persian'
import LockOpen from '@material-ui/icons/LockOpen';
import Lock from '@material-ui/icons/Lock';
import VerifiedUser from '@material-ui/icons/VerifiedUser';
import HighLightOff from '@material-ui/icons/HighlightOff'

import JMoment from 'moment-jalaali';
class ManagerData extends Component{
    render(){
        const {record} = this.props;
        return ( 
            <React.Fragment>
                <TableCell>
                    <Typography variant="body1">{record.fname}</Typography>
                </TableCell>
                <TableCell>
                    <Typography variant="body1">{record.lname}</Typography>
                </TableCell>
                <TableCell>
                    <Typography variant="body1">{persian.toPersian(record.userName)}</Typography>
                </TableCell>
                <TableCell>
                    {record.canLogin ? <LockOpen /> : <Lock />}
                    {record.isActive ? <VerifiedUser /> : <HighLightOff /> }     
                </TableCell>
                <TableCell>
                    <Typography variant="body1">{JMoment(record.last_login).calendar()}</Typography>     
                </TableCell>
          </React.Fragment>
        );
    }
}
ManagerData.propTypes = {
    record: PropTypes.object.isRequired,
}
export default ManagerData;