import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import persian from 'persian';

const styles = theme => ({
    root: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        display:"flex",
        alignItems: "center",
        justifyContent: "center"
    }
});

class Pagination extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.handleBackButtonClick = this
            .handleBackButtonClick
            .bind(this)
        this.handleFirstPageButtonClick = this
            .handleFirstPageButtonClick
            .bind(this)
        this.handleLastPageButtonClick = this
            .handleLastPageButtonClick
            .bind(this)
        this.handleNextButtonClick = this
            .handleNextButtonClick
            .bind(this)
    }
    handleFirstPageButtonClick (event) {
        this
            .props
            .onChangePage(event, 1);
    }

    handleBackButtonClick (event) {
        this
            .props
            .onChangePage(event, this.props.page - 1);
    }

    handleNextButtonClick (event) {
        this
            .props
            .onChangePage(event, this.props.page + 1);
    }

    handleLastPageButtonClick(event) {
        this
            .props
            .onChangePage(event, this.props.endPage);
    }

    render() {
        const {classes, page, endPage} = this.props;

        return (
            <div className={classes.root}>
                <IconButton
                    onClick={this.handleFirstPageButtonClick}
                    disabled={page === 1}
                    aria-label="First Page">
                    {<FirstPageIcon/>}
                </IconButton>
                <IconButton
                    onClick={this.handleBackButtonClick}
                    disabled={page === 1}
                    aria-label="Previous Page">
                    {<KeyboardArrowLeft/>}
                </IconButton>
                <span>{persian.toPersian(page) + "از" + persian.toPersian(endPage)}</span>
                <IconButton
                    onClick={this.handleNextButtonClick}
                    disabled={page === endPage}
                    aria-label="Next Page">
                    {<KeyboardArrowRight/>}
                </IconButton>
                <IconButton
                    onClick={this.handleLastPageButtonClick}
                    disabled={page === endPage}
                    aria-label="Last Page">
                    {<LastPageIcon/>}
                </IconButton>
                
            </div>
        );
    }
}

Pagination.propTypes = {
    classes: PropTypes.object.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    endPage: PropTypes.number.isRequired,
    itemsPerPage: PropTypes.number.isRequired
};

export default withStyles(styles)(Pagination);