import React from 'react'

import momentj from 'moment-jalaali';

import _ from 'lodash';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Paper, Icon} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import persian from 'persian'

const styles = theme => ({
    root: {

        margin: theme.spacing.unit * 3,
        overflowX: 'auto'
    },
    table: {
        width: '100%',
        textAlign: 'center'
    },
    today: {
        color: '#33eaff'
    },
    reserved: {
        backgroundColor: '#aaa'
    },
    selected: {
        backgroundColor: '#bac'
    },
    td: {
        cursor: 'pointer'
    }
})

class Calendar extends React.Component {

    constructor(props) {

        super(props);
        this.state = {
            today: {},
            year: 0,
            month: 0,
            monthst: "",
            todaymonth: "",
            day: 0,
            weekday: 0,
            endweekfirstday: 0,
            endday: 0,
            item: [],
            selected: {
                year: 0,
                month: 0,
                day: 0
            }
        }

        this.getdate = this
            .getdate
            .bind(this);
        this.reservefind = this
            .reservefind
            .bind(this);
        this.handleClick = this
            .handleClick
            .bind(this);
        this.selectedfind = this
            .selectedfind
            .bind(this)
        // this.toPersianDigits = this.toPersianDigits.bind(this)
    }

    handleClick(y, m, d) {

        this
            .props
            .clickDate(y,m,d)
        this.setState({
            selected: {
                year: y,
                month: m,
                day: d
            }
        })
    }

    // toPersianDigits(s){     var id= ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    // return s.toString().replace(/[0-9]/g, function(w){         return id[+w]
    // }); }

    reservefind(y, m, d) {

        function findday(daydate) {
            if (daydate.year === y && daydate.month === m && daydate.day === d) {

                return daydate

            }
        }

        return this
            .props
            .item
            .some(findday)
    }
    selectedfind(y, m, d) {

        if (this.state.selected.year === y && this.state.selected.month === m && this.state.selected.day === d) {

            return true

        }

    }
    getdate(s) {
        momentj.loadPersian({usePersianDigits: true})
        momentj.loadPersian({dialect: 'persian-modern'})
        var m,
            y = ""

        if (s === "next") {

            m = this
                .state
                .today
                .add(1, 'jMonth')
                .jMonth()
            y = this
                .state
                .today
                .jYear()
            this
                .props
                .changeDate(y,m)
            this.setState({
                month: m,
                monthst: this
                    .state
                    .today
                    .format('jMMMM'),
                year: y,
                weekday: this
                    .state
                    .today
                    .startOf('jmonth')
                    .weekday(),
                endday: this
                    .state
                    .today
                    .endOf('jmonth')
                    .jDate(),
                endweekfirstday: 28 - this
                    .state
                    .today
                    .startOf('jmonth')
                    .weekday()
            })

        } else if (s === "pre") {

            m = this
                .state
                .today
                .subtract(1, 'jMonth')
                .jMonth()
            y = this
                .state
                .today
                .jYear()
            this
                .props
                .changeDate(y,m)
            this.setState({
                month: m,
                monthst: this
                    .state
                    .today
                    .format('jMMMM'),
                year: y,
                weekday: this
                    .state
                    .today
                    .startOf('jmonth')
                    .weekday(),
                endday: this
                    .state
                    .today
                    .endOf('jmonth')
                    .jDate(),
                endweekfirstday: 28 - this
                    .state
                    .today
                    .startOf('jmonth')
                    .weekday()
            })

        } else {

            var today = momentj()
            // this
            //     .props
            //     .clickDate(today.jDate())
                
            this.setState({
                today: today,
                selected: {
                    year: today.jYear(),
                    month: today.jMonth(),
                    day: today.jDate()
                },
                day: today.jDate(),
                todaymonth: today.jMonth(),
                year: today.jYear(),
                month: today.jMonth(),
                monthst: today.format('jMMMM'),
                weekday: today
                    .startOf('jmonth')
                    .weekday(),
                endday: today
                    .endOf('jmonth')
                    .jDate(),
                endweekfirstday: 28 - today
                    .startOf('jmonth')
                    .weekday()

            })

        }
    }

    shouldComponentUpdate(newProps, newState) {
        return true;
    }
    componentDidMount() {

        this.getdate("now")

    }

    render() {
        const {classes} = this.props
        return (
            <Paper className={classes.root}>
                <table className={classes.table}>
                    <thead>
                        <tr >
                            <th colSpan={7} width="100%">
                                <ChevronLeft onClick={() => this.getdate("pre")}/>
                                <span >{this.state.monthst} - {persian.toPersian(this.state.year)}</span>
                                <ChevronRight onClick={() => this.getdate("next")}/>
                            </th>
                        </tr>
                        <tr >
                            <th>ش</th>
                            <th >ی</th>
                            <th >د</th>
                            <th >س</th>
                            <th >چ</th>
                            <th >پ</th>
                            <th >ج</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {
                                _
                                    .range(0, this.state.weekday)
                                    .map((i) => <td key={i} className="pad"></td>)
                            }
                            {
                                _
                                    .range(this.state.weekday, 7)
                                    .map(
                                        (i) => <td
                                            onClick={() => this.handleClick(this.state.year, this.state.month, i - this.state.weekday + 1)}
                                            key={i}
                                            className={classNames(classes.td, (
                                                this.reservefind(this.state.year, this.state.month, i - this.state.weekday + 1)
                                                    ? classes.reserved
                                                    : ''
                                            ), (
                                                this.selectedfind(this.state.year, this.state.month, i - this.state.weekday + 1)
                                                    ? classes.selected
                                                    : ''
                                            ), (
                                                ((i - this.state.weekday + 1) === this.state.day && this.state.month === this.state.todaymonth)
                                                    ? classes.today
                                                    : ''
                                            ))}>
                                            <div>{persian.toPersian(i - this.state.weekday + 1)}</div>
                                        </td>
                                    )
                            }
                        </tr>

                        <tr>
                            {
                                _
                                    .range(1, 8)
                                    .map(
                                        (i) => <td
                                            onClick={() => this.handleClick(this.state.year, this.state.month, i - this.state.weekday + 7)}
                                            key={i}
                                            className={classNames(
                                                classes.td,
                                                this.reservefind(this.state.year, this.state.month, i - this.state.weekday + 7)
                                                    ? classes.reserved
                                                    : '',
                                                this.selectedfind(
                                                    this.state.year,
                                                    this.state.month,
                                                    i - this.state.weekday + 7
                                                )
                                                    ? classes.selected
                                                    : '',
                                                (
                                                    ((i + 7 - this.state.weekday) === this.state.day && this.state.month === this.state.todaymonth)
                                                        ? classes.today
                                                        : ''
                                                )
                                            )}>
                                            <div>{persian.toPersian(i + 7 - this.state.weekday)}</div>
                                        </td>
                                    )
                            }
                        </tr>

                        <tr>
                            {
                                _
                                    .range(1, 8)
                                    .map(
                                        (i) => <td
                                            onClick={() => this.handleClick(this.state.year, this.state.month, i - this.state.weekday + 14)}
                                            key={i}
                                            className={classNames(
                                                classes.td,
                                                this.reservefind(this.state.year, this.state.month, i - this.state.weekday + 14)
                                                    ? classes.reserved
                                                    : '',
                                                this.selectedfind(
                                                    this.state.year,
                                                    this.state.month,
                                                    i - this.state.weekday + 14
                                                )
                                                    ? classes.selected
                                                    : '',
                                                (
                                                    ((i + 14 - this.state.weekday) === this.state.day && this.state.month === this.state.todaymonth)
                                                        ? classes.today
                                                        : ''
                                                )
                                            )}>
                                            <div>{persian.toPersian(i + (14 - this.state.weekday))}</div>
                                        </td>
                                    )
                            }
                        </tr>

                        <tr>
                            {
                                _
                                    .range(1, 8)
                                    .map(
                                        (i) => <td
                                            onClick={() => this.handleClick(this.state.year, this.state.month, i - this.state.weekday + 21)}
                                            key={i}
                                            className={classNames(
                                                classes.td,
                                                this.reservefind(this.state.year, this.state.month, i - this.state.weekday + 21)
                                                    ? classes.reserved
                                                    : '',
                                                this.selectedfind(
                                                    this.state.year,
                                                    this.state.month,
                                                    i - this.state.weekday + 21
                                                )
                                                    ? classes.selected
                                                    : '',
                                                (
                                                    ((i + 21 - this.state.weekday) === this.state.day && this.state.month === this.state.todaymonth)
                                                        ? classes.today
                                                        : ''
                                                )
                                            )}>
                                            <div>{persian.toPersian(i + 21 - this.state.weekday)}</div>
                                        </td>
                                    )
                            }
                        </tr>

                        <tr>
                            {
                                (
                                    this.state.endweekfirstday === 22 && (this.state.endday === 30 || this.state.endday === 31)
                                )
                                    ? _
                                        .range(23, 30)
                                        .map(
                                            (i) => <td
                                                onClick={() => this.handleClick(this.state.year, this.state.month, i)}
                                                key={i}
                                                className={classNames(
                                                    classes.td,
                                                    this.reservefind(this.state.year, this.state.month, i)
                                                        ? classes.reserved
                                                        : '',
                                                    this.selectedfind(this.state.year, this.state.month, i)
                                                        ? classes.selected
                                                        : '',
                                                    (
                                                        (i === this.state.day && this.state.month === this.state.todaymonth)
                                                            ? classes.today
                                                            : ''
                                                    )
                                                )}>
                                                <div>{persian.toPersian(i)}</div>
                                            </td>
                                        )
                                    : (
                                        this.state.endweekfirstday === 23 && (this.state.endday === 30 || this.state.endday === 31)
                                    )
                                        ? _
                                            .range(24, 31)
                                            .map(
                                                (i) => <td
                                                    onClick={() => this.handleClick(this.state.year, this.state.month, i)}
                                                    key={i}
                                                    className={classNames(
                                                        classes.td,
                                                        this.reservefind(this.state.year, this.state.month, i)
                                                            ? classes.reserved
                                                            : '',
                                                        this.selectedfind(this.state.year, this.state.month, i)
                                                            ? classes.selected
                                                            : '',
                                                        (
                                                            (i === this.state.day && this.state.month === this.state.todaymonth)
                                                                ? classes.today
                                                                : ''
                                                        )
                                                    )}>
                                                    <div>{persian.toPersian(i)}</div>
                                                </td>
                                            )
                                        : _
                                            .range(this.state.endweekfirstday + 1, this.state.endday + 1)
                                            .map(
                                                (i) => <td
                                                    onClick={() => this.handleClick(this.state.year, this.state.month, i)}
                                                    key={i}
                                                    className={classNames(
                                                        classes.td,
                                                        this.reservefind(this.state.year, this.state.month, i)
                                                            ? classes.reserved
                                                            : '',
                                                        this.selectedfind(this.state.year, this.state.month, i)
                                                            ? classes.selected
                                                            : '',
                                                        (
                                                            (i === this.state.day && this.state.month === this.state.todaymonth)
                                                                ? classes.today
                                                                : ''
                                                        )
                                                    )}>
                                                    <div>{persian.toPersian(i)}</div>
                                                </td>
                                            )
                            }
                        </tr>
                        <tr>{
                                (
                                    this.state.endweekfirstday === 22 && (this.state.endday === 30 || this.state.endday === 31)
                                )
                                    ? _
                                        .range(30, this.state.endday + 1)
                                        .map(
                                            (i) => <td
                                                onClick={() => this.handleClick(this.state.year, this.state.month, i)}
                                                key={i}
                                                className={classNames(
                                                    classes.td,
                                                    this.reservefind(this.state.year, this.state.month, i)
                                                        ? classes.reserved
                                                        : '',
                                                    this.selectedfind(this.state.year, this.state.month, i)
                                                        ? classes.selected
                                                        : '',
                                                    (
                                                        (this.state.day === i && this.state.month === this.state.todaymonth)
                                                            ? classes.today
                                                            : ''
                                                    )
                                                )}>{persian.toPersian(i)}</td>
                                        )

                                    : (this.state.endweekfirstday === 23 && (this.state.endday === 31))
                                        ? _
                                            .range(31, this.state.endday + 1)
                                            .map(
                                                (i) => <td
                                                    onClick={() => this.handleClick(this.state.year, this.state.month, i)}
                                                    key={i}
                                                    className={classNames(
                                                        classes.td,
                                                        this.reservefind(this.state.year, this.state.month, i)
                                                            ? classes.reserved
                                                            : '',
                                                        this.selectedfind(this.state.year, this.state.month, i)
                                                            ? classes.selected
                                                            : '',
                                                        (
                                                            (this.state.day === i && this.state.month === this.state.todaymonth)
                                                                ? classes.today
                                                                : ''
                                                        )
                                                    )}>{persian.toPersian(i)}</td>
                                            )

                                        : <td
                                                style={{
                                                    color: "#fff"
                                                }}>.</td>
                            }</tr>
                    </tbody>
                </table>
            </Paper>

        );

    }
}

Calendar.propTypes = {
    changeDate: PropTypes.func.isRequired,
    item: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired
};
export default withStyles(styles)(Calendar);
