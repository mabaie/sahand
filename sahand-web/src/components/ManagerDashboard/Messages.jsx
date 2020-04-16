import React, {Component} from 'react';
import {
    Grid,
    TextField,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    Typography,
    Button
} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from "prop-types";
import jMoment from 'moment-jalaali';
import persian from 'persian'

import ArrowBack from '@material-ui/icons/ArrowBack';
import configs from "../../configs";
const styles = theme => ({
    container: {
        direction: 'rtl',
        textAlign: 'right'
    },
    content: {
        padding: 0,
        overflow: "hidden",
        width: "500px"
    },
    list: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        maxHeight: "300px",
        overflowY: "scroll",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        margin: "0",
        padding: "0px"
    },
    send: {
        backgroundColor: "#eff5ff",
        textAlign: "right",
        maxWidth: '300px',
        margin: "5px 20px",
        listStyle: "none",
        alignSelf: "flex-start",
        padding: "8px",
        position: "relative",
        borderRadius: "0.4em",
        '&::after': {
            content: "''",
            position: "absolute",
            left: " 0",
            top: "50%",
            width: " 0",
            height: " 0",
            border: "20px solid transparent",
            borderRightColor: "#eff5ff",
            borderLeft: " 0",
            borderBottom: " 0",
            marginTop: "-10px",
            marginLeft: "-15px"
        }
    },
    receive: {
        backgroundColor: "#ededed",
        textAlign: "right",
        maxWidth: '300px',
        margin: "5px 20px",
        listStyle: "none",
        alignSelf: "flex-end",
        padding: "8px",
        position: "relative",
        borderRadius: "0.4em",
        '&::after': {

            content: "''",
            position: "absolute",
            right: " 0",
            top: "50%",
            width: " 0",
            height: " 0",
            border: "20px solid transparent",
            borderLeftColor: "#ededed",
            borderRight: " 0",
            borderBottom: " 0",
            marginTop: "-10px",
            marginRight: "-15px"
        }
    },
    newMsg: {
        padding: "20px",
        boxSizing: "border-box"
    },
    typeMessages: {
        padding: 0
    },
    more: {
        textAlign: "center"
    }
});

class Messages extends Component {

    constructor(props) {
        super(props);

        this.state = {
            typing: false,
            open: false,
            text: "",
            currentLength: 0,
            record: [],
            contactID: "",
            chatID: "",
            limit: 5,
            show: false,
            numOfMsg: 5
        }
        this.scrollToBottom = this
            .scrollToBottom
            .bind(this)
        this.handleType = this
            .handleType
            .bind(this)
        this.handleClickSend = this
            .handleClickSend
            .bind(this)
        this.moreMsg = this
            .moreMsg
            .bind(this)
    }

    handleClickSend() {
var l=this.state.limit
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
                    `/chat-send-message`,
                    (this.state.chatID === "")
                        ? {
                            reciver: this.state.contactID,
                            message: this.state.text,
                            limit: this.state.limit +1
                        }
                        : {
                            chat_id: this.props.chatID,
                            reciver: this.state.contactID,
                            message: this.state.text,
                            limit: this.state.limit +1
                        }
                )
                .then((response) => {
                    
                    this.setState({
                        currentLength: response.data.messages.length,
                        limit:l +1,
                        chatID:response.data.chat_id,
                        record: response.data.messages,
                        waiting: false,
                        text: "",
                        typing: false,
                        show: (response.data.messages.length >l)
                    });
                    this.scrollToBottom();
                })
                .catch(err => {
                    console.log(err)
                });
        })

    }

    handleType(e) {
        if (e.target.value === "") {
            this.setState({typing: false, text: e.target.value})
        } else {
            this.setState({typing: true, text: e.target.value})
        }
    }

    scrollToBottom() {
        this.messagesEnd.scrollTop = this.messagesEnd.scrollHeight
    }

    moreMsg() {
        var l = this.state.limit
        var h = this.messagesEnd.scrollHeight
        var leng
        
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
                    .post(`/chat-view/${this.state.chatID}`, {
                        skip: 0,
                        limit: l + this.state.numOfMsg
                    })
                    .then((response) => {
                        leng = response
                            .data
                            .chat_list
                            .length
                            this
                            .setState({
                                currentLength: response.data.chat_list.length,
                                record: response.data.chat_list,
                                waiting: false,
                                limit: l + this.state.numOfMsg,
                                contactID: response.data.contact_id,
                                chatID: this.state.chatID
                            });

                        this.messagesEnd.scrollTop = this.messagesEnd.scrollHeight - h

                        req
                            .post(`/chat-view/${this.state.chatID}`, {
                                skip: 0,
                                limit: l + this.state.numOfMsg * 2
                            })
                            .then((response) => {
                                if (response.data.chat_list.length !== leng) {
                                    this.setState({show: true});
                                } else {
                                    this.setState({show: false});
                                }
                            })
                            .catch(err => {
                                console.log(err)
                            });

                    })
                    .catch(err => {
                        console.log(err)
                    });
            })

        
    }

    componentWillReceiveProps(newProps) {
        
        var leng
        if (newProps.contactID !== this.props.contactID || newProps.chatID !== this.props.chatID) 
            if (newProps.chatID !== "") {
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
                        .post(`/chat-view/${newProps.chatID}`, {
                            skip: 0,
                            limit: this.state.numOfMsg
                        })
                        .then((response) => {
                            leng = response
                                .data
                                .chat_list
                                .length
                                this
                                .setState(
                                    {currentLength: response.data.chat_list.length, record: response.data.chat_list, waiting: false, contactID: response.data.contact_id, chatID: newProps.chatID}
                                );
                            this.scrollToBottom();
                            req
                                .post(`/chat-view/${newProps.chatID}`, {
                                    skip: 0,
                                    limit: this.state.numOfMsg * 2
                                })
                                .then((response) => {
                                    if (response.data.chat_list.length !== leng) {
                                        this.setState({show: true});
                                    } else {
                                        this.setState({show: false});
                                    }
                                })
                                .catch(err => {
                                    alert("خطای سرور");
                                });
                        })
                        .catch(err => {
                            alert("خطای سرور");
                        });

                })

            }
        else {
            this.setState(
                {contactID: newProps.contactID, chatID: newProps.chatID,
                    record: [],limit:this.state.numOfMsg, currentLength: 0, show: false}
            )

        }
        // if(this.state.currentLength < this.props.record.length){
        // this.scrollToBottom();          this.setState({currentLength:
        // this.props.record.length});          console.log('innnn')      }   if
        // (prevState.open == false && this.state.open == true) {
        // this.scrollToBottom();   }
    }

    shouldComponentUpdate() {
        return true
    }
    render() {
        const {classes, contactName} = this.props;
        return (

            <React.Fragment>
                <DialogTitle >
                    {contactName}
                </DialogTitle>
                <DialogContent className={classes.content}>
                    <ul
                        className={classes.list}
                        ref={(el) => {
                            this.messagesEnd = el;
                        }}>
                        {
                            this.state.show && <li className={classes.more}>
                                    <Button variant="body2" onClick={() => this.moreMsg()}>
                                        بیشتر</Button>
                                </li>
                        }
                        {
                            this
                                .state
                                .record
                                .map((message, i) => (

                                    <li
                                        key={i}
                                        className={(
                                            message.sender_id === this.state.contactID)
                                            ? classes.receive
                                            : classes.send}>
                                        <Typography variant="body2" align="right">
                                            {message.text}</Typography>
                                        <Typography variant="caption" align="right">{persian.toPersian(jMoment(message.date).format('HH:mm jYYYY/jM/jD'))}
                                        </Typography>
                                    </li>

                                ))
                        }

                    </ul>

                    <Grid item="item" xs={12} className={classes.typeMessages}>
                        <TextField
                            id="outlined-full-width"
                            autoComplete="off"
                            autoFocus={false}
                            variant='filled'
                            placeholder="پیام جدید"
                            fullWidth="fullWidth"
                            value={this.state.text}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    this.handleClickSend()
                                }
                            }}
                            onChange={(e) => this.handleType(e)}
                            margin="10px 0 0 0"
                            className={classes.newMsg}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="Toggle password visibility"
                                            onClick={this.handleClickSend}
                                            color="primary">
                                            {
                                                this.state.typing
                                                    ? <ArrowBack/>
                                                    : ''
                                            }
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}/>
                    </Grid>
                </DialogContent>

            </React.Fragment>

        );
    }
}

Messages.propTypes = {
    classes: PropTypes.object.isRequired,
    contactName: PropTypes.string.isRequired,
    chatID: PropTypes.string.isRequired,
    contactID: PropTypes.string.isRequired
};
export default withStyles(styles)(Messages);
