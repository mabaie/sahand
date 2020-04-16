import React, {Component} from 'react';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import CircularProgress from "@material-ui/core/CircularProgress";
import green from "@material-ui/core/colors/green";
import 'babel-polyfill';
import configs from "../../../configs";
import Pagination from './Pagination.js'
import {
    Grid,
    AppBar,
    Toolbar,
    Button,
    Paper,
    ListSubheader,
    List,
    ListItem,
    ListItemText,
    Collapse,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Input,
    InputLabel,
    FormControl,
    NativeSelect,
    Icon,
    IconButton,
    GridListTile,
    GridListTileBar,
    GridList,
    Avatar,
    Checkbox,
    Typography
} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import axios from "axios";
import PropTypes from "prop-types";

const styles = theme => ({
    appbar: {
        backgroundColor: '#000',
        color: '#fff',
        boxShadow: 'none',
        padding: '7px 0px'
    },
    content: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        padding: '1em'
    },
    newimg: {
        left: '10px',
        position: 'absolute',
        top: '10px',
        fontSize: '10px',
        width: '30px',
        height: '30px',
        backgroundColor: '#f50057'
    },
    imgcheckbox: {
        position: 'absolute',
        top: '0px',
        right: '0px',
        padding: '0',
        color: '#aaa'
    },
    orderselect: {
        position: 'absolute',
        right: '24px'
    },
    orderselectbox: {
        backgroundColor: '#fff',
        minWidth: '200px'
    },
    orderselectlabel: {
        color: '#fff'
    },
    filtertext: {
        textAlign: 'left'
    },
    filterHeaderText: {
        textAlign: 'center'
    },
    filter: {
        borderLeft: '1px solid black'
    },
    gridlist: {
        height: 'auto'
    },

    gridlisttop: {
        backgroundColor: 'rgba(0,0,0,0)'
    },
    gridlistbottom: {
        paddingRight: '20px'
    },
    addphoto: {
        margin: '2em auto 1em',
        display: 'block',
        fontSize: '1.2rem'
    },
    editicon: {
        color: 'rgb(50, 135, 220,1)'
    },
    imgs: {
        cursor: "pointer",
        width: "100%",
        height: "100%"
    },
    uplodedimages: {
        width: '50px',
        height: '50px'
    },
    openedimg: {
        width: '300px',
        height: '250px'
    },
    fileInput: {
        marginTop: '20px',
        marginBottom: '20px'
    },
    buttonProgress: {
        color: green[500],
        position: "absolute",
        top: "50%",
        left: "50%",
        marginTop: -12,
        marginLeft: -12
    },
    iconButtonBox: {
        "&:hover": {
            //you want this to be the same as the backgroundColor above
            backgroundColor: "rgb(0, 0, 0,0)"
        }
    },
    messageicon:{
        justifyContent:"center",
        display:"flex"
    }
})

class BossGallery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filter_taglist: false,
            selected_images: [],
            opendialog: false,
            uplodedimages: [],
            files: [],
            AddTag: "",
            AddCaption: "",
            filesurl: [],
            currentdata: [],
            currenttitle: "همه عکس‌ها",
            open_img_diolog: {},
            open_diolog: false,
            dialog_state: "open",
            edited_caption: "",
            edited_tag: "",
            tags: [],
            waiting: false,
            message: "اطلاعات با موفقیت ثبت شد",
            messageOpen: false,
            messageType: "success",
            page: 1,
            imgsPerPage: 20,
            filtername: '',
            endPage: 1
        }

        this.clickItem = this
            .clickItem
            .bind(this);
        this.selectImage = this
            .selectImage
            .bind(this);
        this._handleImageChange = this
            ._handleImageChange
            .bind(this)
        this.removeImage = this
            .removeImage
            .bind(this)
        this.clickTag = this
            .clickTag
            .bind(this)
        this.handleClose = this
            .handleClose
            .bind(this)
        this.handleChangeorder = this
            .handleChangeorder
            .bind(this)
        this.findchecked = this
            .findchecked
            .bind(this)
        this.rejectGroupOfImages = this
            .rejectGroupOfImages
            .bind(this)
        this.rejectImage = this
            .rejectImage
            .bind(this)
        this.openImgDialog = this
            .openImgDialog
            .bind(this)
        this.handleCloseDialog = this
            .handleCloseDialog
            .bind(this)
        this.showall = this
            .showall
            .bind(this)
        this.editImage = this
            .editImage
            .bind(this)
        this.handleWriteEdit = this
            .handleWriteEdit
            .bind(this)
        this.handleAcceptEdit = this
            .handleAcceptEdit
            .bind(this)
        this.handleSendImages = this
            .handleSendImages
            .bind(this)
        this.handleUploadFiles = this
            .handleUploadFiles
            .bind(this)
        this.handelChangTextField = this
            .handelChangTextField
            .bind(this)

        this.handleChangePage = this
            .handleChangePage
            .bind(this)
        this.handleCloseMessage = this
            .handleCloseMessage
            .bind(this)

    }

    handleChangePage(event, page){

        var arr = this.state.currentdata
        if (page === this.state.endPage) {
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
                        "/gallery/gallerymanager",
                        (this.state.filtername === 'tag')
                            ? {
                                skip: page * this.state.imgsPerPage,
                                limit: this.state.imgsPerPage,

                                filter: {
                                    tag: this.state.currenttitle
                                }

                            }
                            : {
                                skip: page * this.state.imgsPerPage,
                                limit: this.state.imgsPerPage
                            }
                    )
                    .then((response) => {
                        let data = response.data;
                        data
                            .sort(function (a, b) {
                                return (a.posted_at < b.posted_at)
                                    ? -1
                                    : (
                                        (a.posted_at > b.posted_at)
                                            ? 1
                                            : 0
                                    );
                            })
                            .reverse()
                        this.setState({
                            page: page,
                            currentdata: arr.concat(data),
                            endPage: (data.length === 0)
                                ? this.state.endPage
                                : this.state.endPage + 1,
                            waiting: false
                        })
                    })
                    .catch(err => {
                        this.setState({message: "خطای سرور", messageOpen: true, messageType: "error"});
                    });
            });
        } else {
            this.setState({page})
        }

    }
    // handleChangeImgsPerPage = event => {     this.setState({ imgsPerPage:
    // event.target.value });   }
    handleSendImages() {
        //////////////////////need api for send images
        let sendArray = [];
        for (let i = 0; i < this.state.files.length; i++) {
            sendArray.push({
                tag: this.state.AddTag,
                caption: this.state.AddCaption,
                url: this
                    .state
                    .files[i]
                    .url
            })
        }
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
                .post("/gallery/addgallery", sendArray)
                .then(() => {
                    this.showall();
                    this.setState({
                        message: "اطلاعات با موفقیت ثبت شد",
                        messageOpen: true,
                        messageType: "success",
                        opendialog: false,
                        files: [],
                        AddTag: "",
                        AddCaption: ""
                    });
                })
                .catch(err => {
                    switch (err.response.data.errorNumber) {
                        case "088":
                            this.setState({message: "خطای سرور", messageOpen: true, messageType: "error"});
                            break;
                        case "090":
                            this.setState(
                                {message: "عنوان نا معتبر است", messageOpen: true, messageType: "error"}
                            );
                            break;
                        case "091":
                            this.setState(
                                {message: "فایل‌های ارسالی نامعتبر است یا به درستی بارگذاری نشده است.", messageOpen: true, messageType: "error"}
                            );
                            break;
                    }
                    this.setState({waiting: false})
                });
        });

        const req2 = axios.create({
            baseURL: configs.apiUrl,
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("access-token")
            }
        });
        this.setState({
            waiting: true
        }, () => {
            req2
                .get("/gallery/gallerymanagertags")
                .then((response) => {
                    this.setState({tags: response.data})
                })
                .catch(err => {
                    this.setState({message: "خطای سرور", messageOpen: true, messageType: "error"});
                });
        });

    }

    async handleUploadFiles() {
        for (let i = 0; i < this.state.files.length; i++) {
            let formdata = new FormData();
            formdata.append("Attachment", this.state.files[i])
            const req = axios.create({
                baseURL: configs.apiUrl,
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: localStorage.getItem("access-token")
                }
            });
            try {
                let res = await req.post("/school/upload/gallery", formdata)
                this
                    .state
                    .files[i]["url"] = res.data.uri;
            } catch (error) {
                console.log(error)
                this.setState(
                    {message: "سند بارگذاری نشده است", messageOpen: true, messageType: "error"}
                );
                return;
            }
        }
        this.setState({waiting: false});
    }
    just_persian(str){
        var p = /^[\u0600-\u06FF\s]+$/;
    
        if (!p.test(str)) {
            return true
        }else{
            return false
        }
    }
    handelChangTextField(name) {
        return event => {
            if(this.just_persian(event.target.value)){
                this.setState({[name]: ""});
            }else{
            const newVal = event.target.value;
            this.setState({[name]: newVal});
        }
        };
    }

    handleAcceptEdit() {
        var current = this.state.currentdata;

        var index = current.indexOf(this.state.open_img_diolog)

        current[index].caption = this
            .state
            .edited_caption
            current[index]
            .tag = this
            .state
            .edited_tag
            this
            .setState({currentdata: current, open_diolog: false})
        var edited_tag = this.state.edited_tag
        var found = this.state.tags && this
            .state
            .tags
            .find(function (element) {
                return element === edited_tag
            })

        if (found === undefined) {
            var tags = this
                .state
                .tags
                tags
                .push(this.state.edited_tag)
            this.setState({tags: tags})
        }
        ///////////////////////need api for edit caption and tag
        const req = axios.create({
            baseURL: configs.apiUrl,
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("access-token")
            }
        });
        req
            .put("/gallery/updategallery/" + current[index]._id, {
                Tag: current[index].tag,
                Caption: current[index].caption
            })
            .then(() => {

                this.setState(
                    {message: "اطلاعات با موفقیت ثبت شد", messageOpen: true, messageType: "success", opendialog: false}
                );
            })
            .catch(err => {
                switch (err.response.data.errorNumber) {
                    case "088":
                        this.setState({message: "خطای سرور", messageOpen: true, messageType: "error"});
                        break;
                    case "090":
                        this.setState(
                            {message: "عنوان نا معتبر است", messageOpen: true, messageType: "error"}
                        );
                        break;
                }
            });

        const req2 = axios.create({
            baseURL: configs.apiUrl,
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("access-token")
            }
        });
        this.setState({
            waiting: true
        }, () => {
            req2
                .get("/gallery/gallerymanagertags")
                .then((response) => {
                    this.setState({tags: response.data})
                })
                .catch(err => {
                    this.setState({message: "خطای سرور", messageOpen: true, messageType: "error"});
                });
        });
    }

    handleWriteEdit(event, name) {
        if (name === 'caption') {
            this.setState({edited_caption: event.target.value})
        }
        if (name === 'tag') {
            this.setState({edited_tag: event.target.value})
        }
    }
    editImage(item) {
        this.setState(
            {open_img_diolog: item, open_diolog: true, dialog_state: "edit", edited_caption: item.caption, edited_tag: item.tag}
        )

    }
    showall() {

        const req1 = axios.create({
            baseURL: configs.apiUrl,
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("access-token")
            }
        });
        this.setState({
            waiting: true
        }, () => {
            req1
                .post("/gallery/gallerymanager", {
                    skip: "0",
                    limit: 2 *this.state.imgsPerPage
                })
                .then((response) => {
                    let data = response.data;
                    data
                        .sort(function (a, b) {
                            return (a.posted_at < b.posted_at)
                                ? -1
                                : (
                                    (a.posted_at > b.posted_at)
                                        ? 1
                                        : 0
                                );
                        })
                        .reverse()
                    this.setState({
                        currentdata: data,
                        currenttitle: "همه‌ی عکس‌ها",
                        endPage: (data.length > this.state.imgsPerPage)
                            ? 2
                            : 1,
                        filtername: '',
                        page: 1,
                        waiting: false
                    })
                })
                .catch(err => {
                    this.setState({message: "خطای سرور", messageOpen: true, messageType: "error"});
                });
        });

    }

    handleCloseDialog() {
        this.setState({open_diolog: false})

    }

    openImgDialog(item) {
        this.setState({open_img_diolog: item, open_diolog: true, dialog_state: "open"})

    }
    findchecked(item) {
        var selected_images = this.state.selected_images;
        var found = selected_images.find(function (element) {
            return element === item;
        });
        if (found) {
            return true
        } else {
            return false
        }

    }
    clickItem(active) {

        this.setState({
            filter_taglist: !active
        })
    }
    clickTag(name) {

        const req1 = axios.create({
            baseURL: configs.apiUrl,
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("access-token")
            }
        });
        this.setState({
            waiting: true
        }, () => {
            req1
                .post("/gallery/gallerymanager", {
                    skip: "0",
                    limit: 2 *this.state.imgsPerPage,
                    filter: {
                        tag: name
                    }
                })
                .then((response) => {
                    let data = response.data;
                    data
                        .sort(function (a, b) {
                            return (a.posted_at < b.posted_at)
                                ? -1
                                : (
                                    (a.posted_at > b.posted_at)
                                        ? 1
                                        : 0
                                );
                        })
                        .reverse()
                    this.setState({
                        currentdata: data,
                        endPage: (data.length > this.state.imgsPerPage)
                            ? 2
                            : 1,
                        currenttitle: name,
                        filtername: 'tag',
                        page: 1,
                        waiting: false
                    })
                })
                .catch(err => {
                    this.setState({message: "خطای سرور", messageOpen: true, messageType: "error"});
                });
        });

    }

    selectImage(e, item) {
        var selected_images = this.state.selected_images
        let index
        if (e.target.checked) {
            selected_images.push(item)
        } else {
            index = selected_images.indexOf(item)
            selected_images.splice(index, 1)
        }
        this.setState({selected_images: selected_images})
    }

    async _handleImageChange(event) {
        let res = await Object
            .keys(event.target.files)
            .map(function (k) {

                return event
                    .target
                    .files[k];
            });
        this.setState({
            files: this
                .state
                .files
                .concat(res),
            waiting: true
        })
        console.log(this
            .state
            .files
            .concat(res))
        this.handleUploadFiles();
    }

    removeImage(index) {
        let files = this
            .state
            .files
            files
            .splice(index, 1)
        this.setState({files: files})
    }

    rejectImage(item) {

        let current = this.state.currentdata;

        let index = current.indexOf(item)

        ///////////////////////need api for reject/delete image
        const req = axios.create({
            baseURL: configs.apiUrl,
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("access-token")
            }
        });
        req
            .delete("/gallery/delgallery", {
                data: {
                    ids: [current[index]._id]
                }
            })
            .then(() => {

                this.setState(
                    {message: "اطلاعات با موفقیت ثبت شد", messageOpen: true, messageType: "success", opendialog: false}
                );
            })
            .catch(err => {
                switch (err.response.data.errorNumber) {
                    case "088":
                        this.setState({message: "خطای سرور", messageOpen: true, messageType: "error"});
                        break;
                    case "090":
                        this.setState(
                            {message: "عنوان نا معتبر است", messageOpen: true, messageType: "error"}
                        );
                        break;
                }
            });
        current.splice(index, 1)
        this.setState({
            currentdata: current,
            open_diolog: false,

            page: (this.state.page === this.state.endPage) && (
                current.length < ((this.state.endPage - 1) * this.state.imgsPerPage + 1)
            )
                ? this.state.page - 1
                : this.state.page,
            endPage: current.length < (
                (this.state.endPage - 1) * this.state.imgsPerPage + 1
            )
                ? this.state.endPage - 1
                : this.state.endPage
        })
        const req2 = axios.create({
            baseURL: configs.apiUrl,
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("access-token")
            }
        });
        this.setState({
            waiting: true
        }, () => {
            req2
                .get("/gallery/gallerymanagertags")
                .then((response) => {
                    this.setState({tags: response.data})
                })
                .catch(err => {
                    this.setState({message: "خطای سرور", messageOpen: true, messageType: "error"});
                });
        });
    }

    rejectGroupOfImages() {
        let selected_images = this.state.selected_images;
        let ids = selected_images.map(img => {
            return img._id;
        });
        let currentdata = this.state.currentdata;
        currentdata = currentdata.filter(function (el) {
            return selected_images.indexOf(el) < 0;
        });
        ///////////////////////need api for reject/delete group of images
        const req = axios.create({
            baseURL: configs.apiUrl,
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("access-token")
            }
        });
        req
            .delete("/gallery/delgallery", {
                data: {
                    ids: ids
                }
            })
            .then(() => {

                this.setState(
                    {message: "اطلاعات با موفقیت ثبت شد", messageOpen: true, messageType: "success", opendialog: false}
                );
            })
            .catch(err => {
                switch (err.response.data.errorNumber) {
                    case "088":
                        this.setState({message: "خطای سرور", messageOpen: true, messageType: "error"});
                        break;
                    case "090":
                        this.setState(
                            {message: "عنوان نا معتبر است", messageOpen: true, messageType: "error"}
                        );
                        break;
                }
            });
        this.setState({
            currentdata: currentdata,
            selected_images: [],
            page: (this.state.page === this.state.endPage) && (
                currentdata.length < ((this.state.endPage - 1) * this.state.imgsPerPage + 1)
            )
                ? this.state.page - 1
                : this.state.page,
            endPage: currentdata.length < (
                (this.state.endPage - 1) * this.state.imgsPerPage + 1
            )
                ? this.state.endPage - 1
                : this.state.endPage
        })
        const req2 = axios.create({
            baseURL: configs.apiUrl,
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("access-token")
            }
        });
        this.setState({
            waiting: true
        }, () => {
            req2
                .get("/gallery/gallerymanagertags")
                .then((response) => {
                    this.setState({tags: response.data})
                })
                .catch(err => {
                    this.setState({message: "خطای سرور", messageOpen: true, messageType: "error"});
                });
        });
    }

    handleClose() {
        this.setState({opendialog: false});
    }

    handleChangeorder(order) {

        let myArray = this
            .state
            .currentdata
            this
            .setState({order: order})

        if (order === "0") {
            myArray.sort(function (a, b) {
                return (a.posted_at < b.posted_at)
                    ? -1
                    : (
                        (a.posted_at > b.posted_at)
                            ? 1
                            : 0
                    );
            })
            this.setState({currentdata: myArray.reverse()})

        }

        if (order === "1") {
            myArray.sort(function (a, b) {
                return (a.posted_at < b.posted_at)
                    ? -1
                    : (
                        (a.posted_at > b.posted_at)
                            ? 1
                            : 0
                    );
            })
            this.setState({currentdata: myArray})

        }

        if (order === "2") {
            myArray.sort(
                (a, b) => (a.caption > b.caption)
                    ? 1
                    : (
                        (b.caption > a.caption)
                            ? -1
                            : 0
                    )
            );

            this.setState({currentdata: myArray})

        }

        if (order === "3") {
            myArray.sort(
                (a, b) => (a.caption > b.caption)
                    ? 1
                    : (
                        (b.caption > a.caption)
                            ? -1
                            : 0
                    )
            );

            this.setState({currentdata: myArray.reverse()})

        }
    }

    componentDidMount() {

        const req1 = axios.create({
            baseURL: configs.apiUrl,
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("access-token")
            }
        });
        this.setState({
            waiting: true
        }, () => {
            req1
                .post("/gallery/gallerymanager", {
                    skip: "0",
                    limit: 2 *this.state.imgsPerPage
                })
                .then((response) => {
                    let data = response.data;
                    data
                        .sort(function (a, b) {
                            return (a.posted_at < b.posted_at)
                                ? -1
                                : (
                                    (a.posted_at > b.posted_at)
                                        ? 1
                                        : 0
                                );
                        })
                        .reverse()  
                    this.setState({
                        currentdata: data,
                        endPage: (data.length > this.state.imgsPerPage)
                            ? 2
                            : 1,
                        waiting: false
                    })
                })
                .catch(err => {
                    this.setState({message: "خطای سرور", messageOpen: true, messageType: "error"});
                });
        });

        // const req3 = axios.create({     baseURL: configs.apiUrl,     headers: {
        // "Content-Type": "application/json",       Authorization: localStorage.getItem("access-token")     }
        // }); this.setState({ waiting: true }, () => { req3
        // .post("/gallery/gallerymanager", {         skip: "0",         limit: "200",
        // })     .then((response) => {         let data=response.data;
        // data.sort(function (a, b) {             return (a.posted_at < b.posted_at)
        // ? -1                 : (                     (a.posted_at > b.posted_at)
        // ? 1                         : 0                 );         })
        // .reverse()         console.log(data)     })     .catch(err => {
        // this.setState({             message: "خطای سرور",             messageOpen:
        // true,             messageType: "error"         });     }); });

        const req2 = axios.create({
            baseURL: configs.apiUrl,
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("access-token")
            }
        });
        this.setState({
            waiting: true
        }, () => {
            req2
                .get("/gallery/gallerymanagertags")
                .then((response) => {
                    this.setState({tags: response.data, waiting: false})
                })
                .catch(err => {
                    this.setState({message: "خطای سرور", messageOpen: true, messageType: "error"});
                });
        });
        
    }
handleCloseMessage(){
    this.setState({messageOpen:false})
}
    render() {
        const {classes} = this.props;
        return (
            <Paper style={{
                    flexGrow: 1
                }}>
                <Grid container="container" spacing={0} className={classes.container}>
                    <Grid item="item" xs={12}>

                        <AppBar position="static" className={classes.appbar}>
                            <Toolbar>{
                                    (this.state.selected_images.length > 0)
                                        ? <Button
                                                className={classes.appbarbuttons}
                                                variant="contained"
                                                onClick={() => this.rejectGroupOfImages()}
                                                color='secondary'>حذف موارد انتخاب شده</Button>
                                        : null
                                }
                                <FormControl className={classes.orderselect}>
                                    <InputLabel
                                        className={classes.orderselectlabel}
                                        shrink="shrink"
                                        htmlFor="age-native-label-placeholder">
                                        مرتب سازی براساس:
                                    </InputLabel>
                                    <NativeSelect
                                        className={classes.orderselectbox}
                                        value={this.state.order}
                                        onChange={(e) => this.handleChangeorder(e.target.value)}
                                        input={<Input className = {
                                            classes.orderselectinput
                                        }
                                        name = "" id = "age-native-label-placeholder" />}>
                                        <option value={0}>تاریخ نزولی</option>
                                        <option value={1}>تاریخ صعودی</option>
                                        <option value={2}>عنوان صعودی</option>
                                        <option value={3}>عنوان نزولی</option>
                                    </NativeSelect>

                                </FormControl>

                            </Toolbar>
                        </AppBar>
                    </Grid>
                    <Grid item="item" xs={3} className={classes.filter}>
                        <List
                            component="nav"
                            subheader={<ListSubheader className = {
                                classes.filterHeaderText
                            }
                            component = "div" > دسته بندی‌ها</ListSubheader>}>
                            <ListItem onClick={() => this.showall()} button="button">
                                <ListItemText className={classes.filtertext} primary="همه عکس‌ها"/>
                            </ListItem>
                            <ListItem
                                className={classes.filtertext}
                                button="button"
                                onClick={() => this.clickItem(this.state.filter_taglist)}>

                                <ListItemText inset="inset" primary="عنوان"/> {
                                    this.state.filter_taglist
                                        ? <ExpandLess/>
                                        : <ExpandMore/>
                                }
                            </ListItem>
                            <Collapse
                                in={this.state.filter_taglist}
                                timeout="auto"
                                unmountOnExit="unmountOnExit">
                                <List component="div" disablePadding="disablePadding">
                                    {
                                        this
                                            .state
                                            .tags
                                            .map(
                                                (tagitem, i) => <ListItem
                                                    key={i}
                                                    onClick={() => this.clickTag(tagitem)}
                                                    button="button"
                                                    className={classes.filtertext}>
                                                    <ListItemText inset="inset" primary={tagitem}/>
                                                </ListItem>
                                            )
                                    }
                                </List>
                            </Collapse>
                        </List>
                    </Grid>
                    <Grid item="item" xs={9} className={classes.content}>
                        <Grid item="item" xs={12}>
                            <Button
                                variant="contained"
                                className={classes.addphoto}
                                onClick={() => this.setState({opendialog: true})}
                                color='secondary'>بارگذاری عکس</Button>
                        </Grid>
                        <Grid item="item" xs={12}>
                            <GridList cols={4} className={classes.gridlist}>
                                <GridListTile
                                    key="Subheader"
                                    cols={4}
                                    style={{
                                        height: 'auto'
                                    }}>
                                    <ListSubheader className={classes.filtertext} component="div">{this.state.currenttitle}</ListSubheader>
                                </GridListTile>
                                {
                                    this
                                        .state
                                        .currentdata
                                        .slice(
                                            (this.state.page - 1) * this.state.imgsPerPage,
                                            (this.state.page - 1) * this.state.imgsPerPage + this.state.imgsPerPage
                                        )
                                        .map(
                                            (item, j) => <GridListTile key={j}>
                                            {/(?:\.([^.]+))?$/.exec(item.url)[1]==="mp4" ?
                                            <video height="100%" onClick={() => this.openImgDialog(item)}>
                                            <source src={configs.publicUrl + item.url} type="video/mp4"/>
                                        </video> 
                                        :
                                                <img
                                                    className={classes.imgs}
                                                    src={configs.publicUrl + item.url}
                                                    alt={item.caption}
                                                    onClick={() => this.openImgDialog(item)}/>
                                                   
                                            }
                                                <GridListTileBar
                                                    className={classes.gridlistbottom}
                                                    title={<span style = {{position:'absolute',right:"5px",top:"5px"}}>{item.caption.substr(0,20)+"..."}</span>}
                                                    actionIcon={<IconButton className = {
                                                        classes.iconButtonBox
                                                    } > <IconButton color='secondary' onClick={() => this.editImage(item)}>
                                                        <Icon>edit_icon</Icon>
                                                    </IconButton>

                                                    <IconButton color='secondary' onClick={() => this.rejectImage(item)}>
                                                        <Icon>delete_icon</Icon>
                                                    </IconButton>
                                                </IconButton>
                                                    }
                                                />

                                                <GridListTileBar
                                                    className={classes.gridlisttop}
                                                    titlePosition="top"
                                                    title={item.newimg
                                                        ? <Avatar className={classes.newimg}>جدید</Avatar>
                                                        : null}
                                                    actionIcon={<Checkbox
                                                    checked = {
                                                        this.findchecked(item)
                                                    }
                                                    onChange = {
                                                        (e) => this.selectImage(e, item)
                                                    }
                                                    className = {
                                                        classes.imgcheckbox
                                                    }
                                                    color = 'secondary'
                                                    />
                                                    }
                                                />
                                            </GridListTile>

                                        )
                                }
                            </GridList>
                            
                            <Pagination
                                colSpan={3}
                                endPage={this.state.endPage}
                                itemsPerPage={this.state.imgsPerPage}
                                page={this.state.page}
                                SelectProps={{
                                    native: true
                                }}
                                onChangePage={this.handleChangePage}/> 
                        </Grid>
                        {
                            <Dialog open={this.state.open_diolog} onClose={this.handleCloseDialog}>

                                    <DialogContent>
                                        {
                                             /(?:\.([^.]+))?$/.exec(this.state.open_img_diolog.url)[1]==="mp4" ? 
                                            <video className={classes.openedimg} controls>
                                            <source src={configs.publicUrl + this.state.open_img_diolog.url} type="video/mp4"/>
                                        </video> 
                                            :
                                        <img
                                            className={classes.openedimg}
                                            src={configs.publicUrl + this.state.open_img_diolog.url}
                                            alt={this.state.open_img_diolog.caption}/>
                                        }   
                                             {
                                            (this.state.dialog_state === "open")
                                                ? <DialogContentText id="alert-dialog-description">
                                                        {this.state.open_img_diolog.caption}
                                                    </DialogContentText>
                                                : <div>
                                                        <TextField
                                                            label="توضیح"
                                                            multiline="multiline"
                                                            value={this.state.edited_caption}
                                                            onChange={(e) => this.handleWriteEdit(e, 'caption')}
                                                            margin="normal"
                                                            fullWidth="fullWidth"/>
                                                        <TextField
                                                            label="عنوان"
                                                            multiline="multiline"
                                                            value={this.state.edited_tag}
                                                            onChange={(e) => this.handleWriteEdit(e, 'tag')}
                                                            margin="normal"
                                                            fullWidth="fullWidth"/>
                                                    </div>
                                        }
                                    </DialogContent>
                                    {
                                        (this.state.dialog_state === "open")
                                            ? <DialogActions>
                                                    <IconButton
                                                        color='secondary'
                                                        onClick={() => this.editImage(this.state.open_img_diolog)}>
                                                        <Icon >edit_icon</Icon>
                                                    </IconButton>
                                                    <IconButton
                                                        color='secondary'
                                                        onClick={() => this.rejectImage(this.state.open_img_diolog)}>
                                                        <Icon>delete_icon</Icon>
                                                    </IconButton>
                                                </DialogActions>
                                            : <DialogActions>
                                                    <IconButton color='secondary' onClick={this.handleAcceptEdit}>
                                                        <Icon >check_icon</Icon>
                                                    </IconButton>
                                                    <IconButton color='secondary' onClick={this.handleCloseDialog}>
                                                        <Icon >close_icon</Icon>
                                                    </IconButton>

                                                </DialogActions>
                                    }

                                </Dialog>

                        }
                    </Grid>
                    <Dialog
                        open={this.state.opendialog}
                        onClose={this.handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description">
                        <DialogTitle id="alert-dialog-title">{"بارگذاری عکس"}</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus="autoFocus"
                                margin="dense"
                                id="tag"
                                label="عنوان"
                                type="text"
                                value={this.state.AddTag}
                                onChange={this.handelChangTextField('AddTag')}
                                fullWidth="fullWidth"/>
                            <TextField
                                autoFocus="autoFocus"
                                margin="dense"
                                id="caption"
                                label="توضیح"
                                type="text"
                                value={this.state.AddCaption}
                                onChange={this.handelChangTextField('AddCaption')}
                                fullWidth="fullWidth"/>
                            <input
                                className={classes.fileInput}
                                accept="image/jpeg|video/mp4"
                                type="file"
                                onChange={(e) => this._handleImageChange(e)}
                                multiple="multiple"/> {
                                this
                                    .state
                                    .files
                                    .map(
                                        (img, j) => <div key={j}>
                                            {
                                                (img.type==="image/jpeg") ? <img className={classes.uplodedimages} alt="" src={URL.createObjectURL(img)}/> : 
                                                <video width="50" >
                                                <source src={URL.createObjectURL(img)} type="video/mp4"/>
                                                
                                              </video>
                                            }
                                            
                                            {
                                                (img.hasOwnProperty("url"))?<Icon color='primary'>done_icon</Icon>:<CircularProgress color='primary' size={24}/>
                                            }
                                            <Typography>
                                            <span>{img.name}</span>
                                            <Button color='primary' onClick={() => this.removeImage(j)}>حذف</Button>
                                            </Typography>
                                        </div>
                                    )

                            }
                        </DialogContent>
                        <DialogActions>

                            <Button
                                onClick={this.handleSendImages}
                                variant="contained"
                                color="primary"
                                disabled={this.state.waiting || this.state.files.length == 0}
                                autoFocus="autoFocus">
                                {
                                    this.state.waiting && (
                                        <CircularProgress className={classes.buttonProgress} size={24}/>
                                    )
                                }
                                ارسال
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog
          open={this.state.messageOpen}
          onClose={this.handleCloseMessage}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle className={classes.messageicon} id="alert-dialog-title" >
                                                        {this.state.messageType==="error" ? <Icon fontSize="large" >cancel_icon</Icon> : <Icon fontSize="large" >check_circle</Icon>}
                                                    </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
             {
                 this.state.message
             }
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseMessage} color="primary">
              باشه
            </Button>
          </DialogActions>
        </Dialog>
                </Grid>
            </Paper>
        );
    }
}
BossGallery.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(BossGallery);