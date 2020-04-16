import React from 'react'

// import momentj from 'moment-jalaali';
var momentj = require('jalali-moment');

import _ from 'lodash';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Paper, Icon} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import persian from 'persian';

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

const monthName=['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];

class Calender extends React.Component {

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
            .clickDate(y, m, d)
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
        // momentj.loadPersian({usePersianDigits: true})
        // momentj.loadPersian({dialect: 'persian-modern'})
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
                .changeDate(y, m)
            this.setState({
                month: m,
                monthst: this
                    .state
                    .today
                    .format('jM'),
                year: y,
                weekday: (this
                    .state
                    .today
                    .startOf('jmonth')
                    .weekday()+1)%7,
                endday: this
                    .state
                    .today
                    .endOf('jmonth')
                    .jDate(),
                endweekfirstday: 28 - (this
                    .state
                    .today
                    .startOf('jmonth')
                    .weekday()+1)%7
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
                .changeDate(y, m)
            this.setState({
                month: m,
                monthst: this
                    .state
                    .today
                    .format('jM'),
                year: y,
                weekday: (this
                    .state
                    .today
                    .startOf('jmonth')
                    .weekday()+1)%7,
                endday: this
                    .state
                    .today
                    .endOf('jmonth')
                    .jDate(),
                endweekfirstday: 28 - (this
                    .state
                    .today
                    .startOf('jmonth')
                    .weekday()+1)%7
            })

        } else {

            var today = momentj((new Date()).toISOString());
            console.log('today is: ',today)
            console.log('end day',momentj((new Date()).toISOString().substr(0,10),
                'YYYY-MM-DD').local('en').format('jYYYY-jMM-jDD'));
            this
                .props
                .clickDate(today.jDate())

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
                monthst: today.format('jM'),
                weekday: (today
                    .startOf('jMonth')
                    .weekday()+1)%7,
                endday: today
                    .endOf('jMonth')
                    .jDate(),
                endweekfirstday: 28 - (today
                    .startOf('jMonth')
                    .weekday()+1)%7

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
                                <Icon onClick={() => this.getdate("pre")}>chevron_right</Icon>
                                <span style={{fontFamily: "IRANSans"}} >{monthName[this.state.monthst-1]}-{persian.toPersian(this.state.year)}</span>
                                <Icon onClick={() => this.getdate("next")}>chevron_left</Icon>
                            </th>
                        </tr>
                        <tr >
                            <th style={{fontFamily: "IRANSans"}} >ش</th>
                            <th style={{fontFamily: "IRANSans"}} >ی</th>
                            <th style={{fontFamily: "IRANSans"}} >د</th>
                            <th style={{fontFamily: "IRANSans"}} >س</th>
                            <th style={{fontFamily: "IRANSans"}} >چ</th>
                            <th style={{fontFamily: "IRANSans"}} >پ</th>
                            <th style={{fontFamily: "IRANSans"}} >ج</th>
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
                                            <div style={{fontFamily: "IRANSans"}}>{persian.toPersian(i - this.state.weekday + 1)}</div>
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
                                            <div style={{fontFamily: "IRANSans"}}>{persian.toPersian(i + 7 - this.state.weekday)}</div>
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
                                            <div style={{fontFamily: "IRANSans"}}>{persian.toPersian(i + (14 - this.state.weekday))}</div>
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
                                            <div style={{fontFamily: "IRANSans"}}>{persian.toPersian(i + 21 - this.state.weekday)}</div>
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
                                                <div style={{fontFamily: "IRANSans"}}>{persian.toPersian(i)}</div>
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
                                                    <div style={{fontFamily: "IRANSans"}}>{persian.toPersian(i)}</div>
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
                                                    <div style={{fontFamily: "IRANSans"}}>{persian.toPersian(i)}</div>
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
                                                )} style={{fontFamily: "IRANSans"}}>{persian.toPersian(i)}</td>
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
                                                    )} style={{fontFamily: "IRANSans"}}>{persian.toPersian(i)}</td>
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

Calender.propTypes = {
    clickDate: PropTypes.func.isRequired,
    changeDate: PropTypes.func.isRequired,
    item: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired
};
export default withStyles(styles)(Calender);
