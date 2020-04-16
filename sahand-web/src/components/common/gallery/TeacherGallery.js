import React, {Component} from 'react';
import Pagination from './Pagination.js';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import 'babel-polyfill';
import configs from "../../../configs";
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
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    Input,
    InputLabel,
    FormControl,
    NativeSelect,
    Avatar,
    IconButton,
    GridListTile,
    GridListTileBar,
    GridList,
    Checkbox
} from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';
import {withStyles} from '@material-ui/core/styles';
import axios from "axios";
import PropTypes from "prop-types";

const styles = theme => ({
    imgs: {
        cursor: "pointer",
        width: "100%",
        height: "100%"
    },
    filterHeaderText: {
        textAlign: 'center'
    },
    filtertext: {
        textAlign: 'left'
    },
    filter: {
        borderLeft: '1px solid black'
    },
    content: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        alignItems: 'flex-start',
        padding: '1em'
    },
    appbar: {
        backgroundColor: '#000',
        color: '#fff',
        boxShadow: 'none',
        padding: '7px 0px'
    },
    appbarbuttons: {
        margin: 'auto 12px'
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
        backgroundColor: '#ffffff',
        minWidth: '200px'
    },
    orderselectlabel: {
        color: '#fff'
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
    accepted: {
        color: '#3AC93A'
    },
    openedimg: {
        width: '300px',
        height: '250px'
    },
    iconButtonBox: {
        "&:hover": {
            //you want this to be the same as the backgroundColor above
            backgroundColor: "rgb(0, 0, 0,0)"
        }
    }
});

class TeacherGallery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alldata: [],
            currentdata: [],
            filter_classlist: false,
            filter_taglist: false,
            filter_teacherlist: false,
            selected_images: [],
            currenttitle: "همه‌ی عکس‌ها",
            open_img_diolog: {},
            open_diolog: false,
            tags: [],
            coursenames: [],
            teachernames: [],
            imgsPerPage: 20,
            page: 1,
            endPage: 1,
            filtername: '',
            currentteacherID: 0,
            currentcourseID: 0
        }
        this.clickItem = this
            .clickItem
            .bind(this);
        this.selectImage = this
            .selectImage
            .bind(this);
        this.rejectImage = this
            .rejectImage
            .bind(this);
        this.clickCourse = this
            .clickCourse
            .bind(this);
        this.clickTeacherName = this
            .clickTeacherName
            .bind(this);
        this.clickTag = this
            .clickTag
            .bind(this);
        this.handleChangeorder = this
            .handleChangeorder
            .bind(this)
        this.findchecked = this
            .findchecked
            .bind(this)
        this.showall = this
            .showall
            .bind(this)
        this.openImgDialog = this
            .openImgDialog
            .bind(this)
        this.handleCloseDialog = this
            .handleCloseDialog
            .bind(this)
        this.acceptImage = this
            .acceptImage
            .bind(this)
        this.acceptGroupOfImages = this
            .acceptGroupOfImages
            .bind(this)
        this.handleChangePage = this
            .handleChangePage
            .bind(this)
    }

    handleChangePage (event, page) {

        var arr = this.state.currentdata
        if (page === this.state.endPage) {
            console.log('page', page)
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
                        "/gallery/galleryteacher",
                        (this.state.filtername === 'tag')
                            ? {
                                skip: page * this.state.imgsPerPage,
                                limit: this.state.imgsPerPage,

                                filter: {
                                    tag: this.state.currenttitle
                                }

                            }
                            : (
                                (this.state.filtername === 'course')
                                    ? {
                                        skip: page * this.state.imgsPerPage,
                                        limit: this.state.imgsPerPage,

                                        filter: {
                                            courseID: this.state.currentcourseID
                                        }

                                    }
                                    : (
                                        (this.state.filtername === 'teacher')
                                            ? {
                                                skip: page * this.state.imgsPerPage,
                                                limit: this.state.imgsPerPage,

                                                filter: {
                                                    teacherID: this.state.currentteacherID
                                                }

                                            }
                                            : {
                                                skip: page * this.state.imgsPerPage,
                                                limit: this.state.imgsPerPage
                                            }
                                    )
                            )

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
                        console.log('1', data)
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
            console.log('hi')
        }
        console.log('2', this.state.currentdata)

    }
    acceptImage(item) {
        // ////////////////need api for accept image ///////////////////need api for
        // edit caption and tag
        var current = this.state.currentdata;
        var index = current.indexOf(item);

        const req = axios.create({
            baseURL: configs.apiUrl,
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("access-token")
            }
        });
        req
            .put("/gallery/updategallery/" + item._id, {accepted: true})
            .then(() => {
                // this.loadImage();
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
        current[index].accepted = true
        this.setState({open_diolog: false, currentdata: current})
    }

    acceptGroupOfImages() {
        let current = this.state.currentdata;
        let selected_images = this.state.selected_images;

        this
            .state
            .currentdata
            .forEach((img, j) => {
                if (selected_images.includes(img)) {
                    current[j].accepted = true

                    const req = axios.create({
                        baseURL: configs.apiUrl,
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: localStorage.getItem("access-token")
                        }
                    });
                    req
                        .put("/gallery/updategallery/" + img._id, {accepted: true})
                        .then(() => {
                            this.setState(
                                {message: "اطلاعات با موفقیت ثبت شد", messageOpen: true, messageType: "success"}
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

                }

            })

        this.setState({currentdata: current})

    }

    handleCloseDialog() {
        this.setState({open_diolog: false})
    }

    openImgDialog(item) {
        this.setState({open_img_diolog: item, open_diolog: true})

    }

    showall() {

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
                .post("/gallery/galleryteacher", {
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
    clickItem(item, active) {
        if (item === "classes") {
            this.setState({
                filter_classlist: !active
            })
        } else {
            if (item === "teachers") {
                this.setState({
                    filter_teacherlist: !active
                })
            } else {
                this.setState({
                    filter_taglist: !active
                })
            }
        }
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

    rejectImage(item) {

        var current = this.state.currentdata

        var index = current.indexOf(item)
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
                .get("/gallery/galleryteachertags")
                .then((response) => {
                    this.setState({tags: response.data, waiting: false})
                })
                .catch(err => {
                    this.setState({message: "خطای سرور", messageOpen: true, messageType: "error"});
                });
        });

        const req3 = axios.create({
            baseURL: configs.apiUrl,
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("access-token")
            }
        });
        this.setState({
            waiting: true
        }, () => {
            req3
                .get("/gallery/galleryteacher-course")
                .then((response) => {
                    this.setState({coursenames: response.data, waiting: false})
                })
                .catch(err => {
                    this.setState({message: "خطای سرور", messageOpen: true, messageType: "error"});
                });
        });

        const req4 = axios.create({
            baseURL: configs.apiUrl,
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("access-token")
            }
        });
        this.setState({
            waiting: true
        }, () => {
            req4
                .get("/gallery/galleryteacher-list")
                .then((response) => {
                    this.setState({teachernames: response.data, waiting: false})

                })
                .catch(err => {
                    this.setState({message: "خطای سرور", messageOpen: true, messageType: "error"});
                });
        });

    }

    rejectGroupOfImages() {
        ///////////////////////need api for reject/delete group of images
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
                .get("/gallery/galleryteachertags")
                .then((response) => {
                    this.setState({tags: response.data, waiting: false})
                })
                .catch(err => {
                    this.setState({message: "خطای سرور", messageOpen: true, messageType: "error"});
                });
        });

        const req3 = axios.create({
            baseURL: configs.apiUrl,
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("access-token")
            }
        });
        this.setState({
            waiting: true
        }, () => {
            req3
                .get("/gallery/galleryteacher-course")
                .then((response) => {
                    this.setState({coursenames: response.data, waiting: false})
                })
                .catch(err => {
                    this.setState({message: "خطای سرور", messageOpen: true, messageType: "error"});
                });
        });

        const req4 = axios.create({
            baseURL: configs.apiUrl,
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("access-token")
            }
        });
        this.setState({
            waiting: true
        }, () => {
            req4
                .get("/gallery/galleryteacher-list")
                .then((response) => {
                    this.setState({teachernames: response.data, waiting: false})

                })
                .catch(err => {
                    this.setState({message: "خطای سرور", messageOpen: true, messageType: "error"});
                });
        });

    }

    clickCourse(name) {

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
                .post("/gallery/galleryteacher", {
                    skip: "0",
                    limit: 2 *this.state.imgsPerPage,
                    filter: {
                        courseID: name._id
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
                        filtername: 'course',
                        page: 1,
                        currenttitle: "درس " + name.coname,
                        currentcourseID: name._id,
                        waiting: false
                    })
                })
                .catch(err => {
                    this.setState({message: "خطای سرور", messageOpen: true, messageType: "error"});
                });
        });

    }

    clickTeacherName(name) {

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
                .post("/gallery/galleryteacher", {
                    skip: "0",
                    limit: 2 *this.state.imgsPerPage,
                    filter: {
                        teacherID: name._id
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
                        filtername: 'teacher',
                        page: 1,
                        currenttitle: name.teacherName,
                        currentteacherID: name._id,
                        waiting: false
                    })
                })
                .catch(err => {
                    this.setState({message: "خطای سرور", messageOpen: true, messageType: "error"});
                });
        });

    }

    clickTag(name) {

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
                .post("/gallery/galleryteacher", {
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

    handleChangeorder(order) {
        var myArray = this.state.currentdata

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
                .post("/gallery/galleryteacher", {
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
                .get("/gallery/galleryteachertags")
                .then((response) => {
                    this.setState({tags: response.data, waiting: false})
                })
                .catch(err => {
                    this.setState({message: "خطای سرور", messageOpen: true, messageType: "error"});
                });
        });

        const req3 = axios.create({
            baseURL: configs.apiUrl,
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("access-token")
            }
        });
        this.setState({
            waiting: true
        }, () => {
            req3
                .get("/gallery/galleryteacher-course")
                .then((response) => {
                    this.setState({coursenames: response.data, waiting: false})
                })
                .catch(err => {
                    this.setState({message: "خطای سرور", messageOpen: true, messageType: "error"});
                });
        });

        const req4 = axios.create({
            baseURL: configs.apiUrl,
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("access-token")
            }
        });
        this.setState({
            waiting: true
        }, () => {
            req4
                .get("/gallery/galleryteacher-list")
                .then((response) => {
                    this.setState({teachernames: response.data, waiting: false})

                })
                .catch(err => {
                    this.setState({message: "خطای سرور", messageOpen: true, messageType: "error"});
                });
        });

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
                                        ? <div>
                                                <Button
                                                    className={classes.appbarbuttons}
                                                    variant="contained"
                                                    onClick={() => this.acceptGroupOfImages()}
                                                    color='secondary'>تایید موارد انتخاب شده</Button>
                                                <Button
                                                    className={classes.appbarbuttons}
                                                    variant="contained"
                                                    onClick={() => this.rejectGroupOfImages()}
                                                    color='secondary'>رد موارد انتخاب شده</Button>
                                            </div>
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
                            <ListItem
                                className={classes.filtertext}
                                onClick={() => this.showall()}
                                button="button">
                                <ListItemText primary="نمایش همه"/>
                            </ListItem>
                            <ListItem
                                className={classes.filtertext}
                                button="button"
                                onClick={() => this.clickItem("classes", this.state.filter_classlist)}>

                                <ListItemText inset="inset" primary="درس"/> {
                                    this.state.filter_classlist
                                        ? <ExpandLess/>
                                        : <ExpandMore/>
                                }
                            </ListItem>
                            <Collapse
                                in={this.state.filter_classlist}
                                timeout="auto"
                                unmountOnExit="unmountOnExit">

                                <List component="div" disablePadding="disablePadding">
                                    {
                                        this
                                            .state
                                            .coursenames
                                            .map(
                                                (courseitem, i) => <ListItem
                                                    key={i}
                                                    className={classes.filtertext}
                                                    onClick={() => this.clickCourse(courseitem)}
                                                    button="button">
                                                    <ListItemText inset="inset" primary={courseitem.coname}/>
                                                </ListItem>
                                            )
                                    }
                                </List>

                            </Collapse>

                            <ListItem
                                className={classes.filtertext}
                                button="button"
                                onClick={() => this.clickItem("teachers", this.state.filter_teacherlist)}>

                                <ListItemText inset="inset" primary="معلم"/> {
                                    this.state.filter_teacherlist
                                        ? <ExpandLess/>
                                        : <ExpandMore/>
                                }
                            </ListItem>
                            <Collapse
                                in={this.state.filter_teacherlist}
                                timeout="auto"
                                unmountOnExit="unmountOnExit">
                                <List component="div" disablePadding="disablePadding">
                                    {
                                        this
                                            .state
                                            .teachernames
                                            .map(
                                                (teacheritem, i) => <ListItem
                                                    key={i}
                                                    onClick={() => this.clickTeacherName(teacheritem)}
                                                    button="button"
                                                    className={classes.filtertext}>
                                                    <ListItemText inset="inset" primary={teacheritem.teacherName}/>
                                                </ListItem>

                                            )
                                    }
                                </List>
                            </Collapse>

                            <ListItem
                                className={classes.filtertext}
                                button="button"
                                onClick={() => this.clickItem("tags", this.state.filter_taglist)}>

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
                                                    className={classes.filtertext}
                                                    onClick={() => this.clickTag(tagitem)}
                                                    button="button">
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
                                                    subtitle={<span style = {{color:'#3AC93A',position:'absolute',right:"10px"}} > {
                                                        item.accepted
                                                            ? "قبلا تایید شده"
                                                            : ""
                                                    }</span>}
                                                    actionIcon={<IconButton className = {
                                                        classes.iconButtonBox
                                                    } > <IconButton className={classes.iconButton} onClick={() => this.rejectImage(item)}>
                                                        <Delete fontSize="small" color='secondary'/>
                                                    </IconButton>
                                                    <IconButton onClick={() => this.acceptImage(item)}>
                                                        <CheckIcon fontSize="small" color='secondary'/>
                                                    </IconButton>
                                                </IconButton>
                                                    }
                                                />

                                                <GridListTileBar
                                                    className={classes.gridlisttop}
                                                    titlePosition="top"
                                                    actionIcon={<div > {
                                                        item.newimg
                                                            ? <Avatar color='secondary' className={classes.newimg}>جدید</Avatar>
                                                            : null
                                                    }<Checkbox
                                                        checked={this.findchecked(item)}
                                                        onChange={(e) => this.selectImage(e, item)}
                                                        className={classes.imgcheckbox}/>
                                                </div>
}/>
                                            </GridListTile>

                                        )

                                }

                            </GridList>
                        </Grid>
                        <Grid item="item" xs={12}>
                            <Pagination
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
                                               alt={this.state.open_img_diolog.caption}/>   }
   
                                        <DialogContentText id="alert-dialog-description">
                                            {this.state.open_img_diolog.caption}

                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <IconButton onClick={() => this.rejectImage(this.state.open_img_diolog)}>
                                            <Delete fontSize="small" color='secondary'/>
                                        </IconButton>
                                        <IconButton onClick={() => this.acceptImage(this.state.open_img_diolog)}>
                                            <CheckIcon fontSize="small" color='secondary'/>
                                        </IconButton>
                                    </DialogActions>
                                </Dialog>

                        }
                    </Grid>

                </Grid>
            </Paper>
        );
    }
}
TeacherGallery.propTypes = {
    classes: PropTypes.object.isRequired
};
export default withStyles(styles)(TeacherGallery);