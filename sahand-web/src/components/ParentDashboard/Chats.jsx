import React, {Component} from 'react';
import {
    Grid,
    Paper,
    TextField,
    Dialog,
    DialogContent,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    ListItemText,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableFooter,
    TablePagination,
    Typography
} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from "prop-types";
import Messages from './Messages'
import SearchIcon from '@material-ui/icons/Search';
import configs from "../../configs";
import PersonAdd from '@material-ui/icons/PersonAdd';
import jMoment from 'moment-jalaali';
import persian from 'persian'
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

const styles = theme => ({
    container: {
        direction: 'rtl',
        textAlign: 'right'
    },
    list: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        overflow: 'auto',
        maxHeight: "100px",
        overflowY: "scroll",
        display: "flex",
        flexDirection: "column",
        margin: "0",
        padding: "10px"
    },
    send: {
        backgroundColor: "#aaa",
        textAlign: "right",
        color: "#fff",
        maxWidth: '300px',
        margin: "10px",
        listStyle: "none"
    },
    receive: {
        backgroundColor: "#fff",
        textAlign: "right",
        float: "left",
        maxWidth: '300px',
        margin: "10px",
        listStyle: "none",
        alignSelf: "flex-end"
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 300,
        minHeight: 300
    },
    pointer: {
        cursor: "pointer"
    },
    head:{
        backgroundColor:"#000",
       
      },
      headcell:{
    color:"#fff"
      }
});

class Chats extends Component {

    constructor(props) {
        super(props);

        this.state = {
            waiting: false,
            data: [],
            contacts: [],
            searchText: "",
            searchMood: false,
            contactID: "",
            chatID: "",
            contactName: "",
            page: 0,
            rowsPerPage: 10
        }
        this.onRegister = this
            .onRegister
            .bind(this)
        this.searchContact = this
            .searchContact
            .bind(this)
        this.handleClose = this
            .handleClose
            .bind(this)
        this.handleCloseChat = this
            .handleCloseChat
            .bind(this)
        this.handleClickExpand = this
            .handleClickExpand
            .bind(this)
    }
    handleClickExpand(contactID, chatID, contactName) {
        this.setState(state => ({
            open: !state.open,
            contactID,
            chatID: chatID,
            contactName: contactName,
            searchMood: false
        }));
    }

    onRegister(text, i) {
        console.log('Reg called');
        var data = this
            .state
            .data
            data[i]
            .messages
            .push({
                type: "send",
                date: (new Date()).toISOString(),
                text: text
            })

        this.setState({data})
        //////////////////set new data ////////////need api for send message

    }

    searchContact() {

        const req = axios.create({
            baseURL: configs.apiUrl,
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("access-token")
            }
        });
        this.setState({
            waiting: true
        }, () => {
            req
                .post(
                    `/app/parent/chat-contact-list/${localStorage.getItem("student-id")}`,
                    {lname: this.state.searchText}
                )
                .then((response) => {
                    console.log(response.data)
                    this.setState({data: response.data, waiting: false, searchMood: true});
                })
                .catch(err => {});
        })
    }
    handleClickAdd() {
        this.setState({searchMood: true});
    }
    handleSearchContact(searchText) {
        this.setState({searchText})
    }
    componentDidMount() {
        /////////////////need get records api////////set state data
        const req = axios.create({
            baseURL: configs.apiUrl,
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("access-token")
            }
        });
        this.setState({
            waiting: true
        }, () => {
            req
                .post(`/chat-list`, {
                    skip: 0,
                    limit: 20
                })
                .then((response) => {
                    console.log('chat-list', response.data)
                    this.setState({contacts: response.data, waiting: false});
                })
                .catch(err => {});
        })

    }
    shouldComponentUpdate() {
        return true
    }
    handleClose() {
        this.setState({searchMood: false})
    }
    handleCloseChat() {
        this.setState({open: false})
        /////////////////need get records api////////set state data
        const req = axios.create({
            baseURL: configs.apiUrl,
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("access-token")
            }
        });
        this.setState({
            
        }, () => {
            req
                .post(`/chat-list`, {
                    skip: 0,
                    limit: 20
                })
                .then((response) => {
                    console.log('chat-list', response.data)
                    this.setState({contacts: response.data, waiting: false});
                })
                .catch(err => {});
        })
    }
    handleChangePage(event, page) {
        this.setState({page});
    }

    handleChangeRowsPerPage(event) {
        this.setState({page: 0, rowsPerPage: event.target.value});
    }
    render() {
        const {classes} = this.props;
        const {rowsPerPage, page} = this.state;
        return (
            <div style={{
                    padding: 16
                }}>
                <Grid className={classes.root} container="container" justify="center">
                    <Grid
                        container="container"
                        item="item"
                        xs={12}
                        justify="flex-end"
                        alignItems='flex-end'
                        spacing={16}>

                        <IconButton
                            disabled={this.state.waiting}
                            size="small"
                            onClick={() => this.handleClickAdd()}>
                            <PersonAdd/>
                        </IconButton>

                    </Grid>
                    <Grid item="item" xs={12}>
                        <Paper>

                            <Table className={classes.table}>
                                <TableHead className={classes.head}>
                                    <TableRow>
                                        <TableCell>
                                            <Typography variant="body1" className={classes.headcell}>مخاطب</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1" className={classes.headcell}>تاریخ آخرین پیام</Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>

                                    {

                                        this
                                            .state
                                            .contacts
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row, i) => {
                                                return (
                                                    <TableRow
                                                        key={i}
                                                        className={classes.pointer}
                                                        button="button"
                                                        onClick={() => this.handleClickExpand("", row._id, row.contact_fname + " " + row.contact_lname)}>

                                                        <TableCell >

                                                            <Typography variant="body1">
                                                                {row.contact_fname + " " + row.contact_lname}</Typography>
                                                        </TableCell>
                                                        <TableCell >

                                                            <Typography variant="body1">
                                                                {persian.toPersian(jMoment(row.modified_at).format('HH:mm jYYYY/jM/jD'))}</Typography>

                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })
                                    }

                                </TableBody>
                                <TableFooter >
                                    <TableRow >
                                        <TableCell colSpan={2}>
                                            <Grid container="container" justify="center">
                                                <TablePagination
                                                    rowsPerPageOptions={[10]}
                                                    count={this.state.contacts.length}
                                                    rowsPerPage={rowsPerPage}
                                                    page={page}
                                                    SelectProps={{
                                                        native: true
                                                    }}
                                                    onChangePage={this.handleChangePage}
                                                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                                    ActionsComponent={TablePaginationActionsWrapped}
                                                    labelDisplayedRows={({from, to, count}) => ` ${persian.toPersian(Math.ceil(count / rowsPerPage))} از ${persian.toPersian(
                                                        page + 1
                                                    )} `}/>
                                            </Grid>
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </Paper>
                    </Grid>
                </Grid>

                <Dialog
                    fullWidth
                    open={this.state.open}
                    keepMounted="keepMounted"
                    onClose={() => this.handleCloseChat()}>
                    <Messages
                        contactName={this.state.contactName}
                        contactID={this.state.contactID}
                        chatID={this.state.chatID}/>
                </Dialog>
                <Dialog
                    onClose={() => this.handleClose()}
                    open={this.state.searchMood}
                    maxWidth='md'>
                    {/* <DialogTitle >
            {contactName}
          </DialogTitle> */
                    }
                    <DialogContent className={classes.textField}>
                        <TextField
                            id="standard-search"
                            label="جستجوی مخاطب"
                            type="search"
                            fullWidth="fullWidth"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    this.searchContact()
                                }
                            }}
                            margin="normal"
                            onChange={(e) => this.handleSearchContact(e.target.value)}
                            value={this.state.searchText}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="Toggle password visibility"
                                            onClick={this.searchContact}>
                                            <SearchIcon/>
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}/>

                        <List component="nav">
                            {
                                this
                                    .state
                                    .data
                                    .map((row, i) => {
                                        return (

                                            <ListItem
                                                key={i}
                                                button="button"
                                                onClick={() => this.handleClickExpand(row._id, "", row.fname + " " + row.lname)}>
                                                <ListItemText primary={row.fname + " " + row.lname}/>
                                            </ListItem>
                                        );
                                    })
                            }
                        </List>

                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}

Chats.propTypes = {
    classes: PropTypes.object.isRequired
};
export default withStyles(styles)(Chats);

const actionsStyles = theme => ({
    root: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        marginLeft: theme.spacing.unit * 2.5
    }
});

class TablePaginationActions extends React.Component {
    handleFirstPageButtonClick(event) {
        this
            .props
            .onChangePage(event, 0);
    }

    handleBackButtonClick(event) {
        this
            .props
            .onChangePage(event, this.props.page - 1);
    }

    handleNextButtonClick(event) {
        this
            .props
            .onChangePage(event, this.props.page + 1);
    }

    handleLastPageButtonClick(event) {
        this
            .props
            .onChangePage(
                event,
                Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
            )
    }

    render() {
        const {classes, count, page, rowsPerPage, theme} = this.props;

        return (
            <div className={classes.root}>
                <IconButton
                    onClick={this.handleFirstPageButtonClick}
                    disabled={page === 0}
                    aria-label="First Page">
                    {
                        theme.direction === 'rtl'
                            ? <LastPageIcon/>
                            : <FirstPageIcon/>
                    }
                </IconButton>
                <IconButton
                    onClick={this.handleBackButtonClick}
                    disabled={page === 0}
                    aria-label="Previous Page">
                    {
                        theme.direction === 'rtl'
                            ? <KeyboardArrowRight/>
                            : <KeyboardArrowLeft/>
                    }
                </IconButton>
                <IconButton
                    onClick={this.handleNextButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label="Next Page">
                    {
                        theme.direction === 'rtl'
                            ? <KeyboardArrowLeft/>
                            : <KeyboardArrowRight/>
                    }
                </IconButton>
                <IconButton
                    onClick={this.handleLastPageButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label="Last Page">
                    {
                        theme.direction === 'rtl'
                            ? <FirstPageIcon/>
                            : <LastPageIcon/>
                    }
                </IconButton>
            </div>
        );
    }
}

TablePaginationActions.propTypes = {
    classes: PropTypes.object.isRequired,
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    theme: PropTypes.object.isRequired
};

const TablePaginationActionsWrapped = withStyles(
    actionsStyles,
    {withTheme: true}
)(TablePaginationActions,);
