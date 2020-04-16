import React, {Component} from 'react';
import Pagination from '../common/gallery/Pagination.js';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import 'babel-polyfill';
import configs from "../../configs";
import {
    Grid,
    AppBar,
    Toolbar,
    Button,
    Paper,
    Select,
    ListSubheader,
    List,
    ListItem,
    ListItemText,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    DialogContentText,
    Input,
    InputLabel,
    FormControl,
    NativeSelect,
    Avatar,
    TextField,
    GridListTile,
    GridListTileBar,
    GridList,
    Typography,
    Icon
} from '@material-ui/core';
import CircularProgress from "@material-ui/core/CircularProgress";
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
    },
    uplodedimages: {
        width: '50px',
        height: '50px'
    }
    ,select:{
        marginTop:20,
        marginBottom:20
    },
    addphoto: {
        margin: '2em auto 1em',
        display: 'block',
        fontSize: '1.2rem'
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
            files: [],
            selected_images: [],
            currenttitle: "همه‌ی عکس‌ها",
            open_img_diolog: {},
            open_diolog: false,
            opendialog:false,
            tags: [],
            coursenames: [],
            selectedCourseId:"",
            imgsPerPage: 20,
            page: 1,
            endPage: 1,
            filtername: '',
            
            currentcourseID: 0
        }
        
        this.handleSelectCourse = this
            .handleSelectCourse
            .bind(this);
        
        this.clickItem = this
            .clickItem
            .bind(this);
        
        this.clickCourse = this
            .clickCourse
            .bind(this);
            this.handleSendImages = this
            .handleSendImages
            .bind(this)
            
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
        this._handleImageChange=this._handleImageChange.bind(this)
        this.handleUploadFiles=this.handleUploadFiles.bind(this)
        this.removeImage= this.removeImage.bind(this)
        this.handleClose = this.handleClose.bind(this)
            
        this.handleChangePage = this
            .handleChangePage
            .bind(this)
    }
    handleSelectCourse (event) {
        this.setState({ selectedCourseId: event.target.value });
      };
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
                  .url,
               schoolID:localStorage.getItem("school-id"),
               courseID:this.state.selectedCourseId   
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
              .post("/app/teacher/add-gallery", sendArray)
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
              .get(`/app/teacher/gallery-tag/${localStorage.getItem("school-id")}`)
              .then((response) => {
                  this.setState({tags: response.data})
              })
              .catch(err => {
                  this.setState({message: "خطای سرور", messageOpen: true, messageType: "error"});
              });
      });

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
                if(this.state.filtername === 'tag'){
                req
                    .post(
                        `/app/teacher/gallery/${localStorage.getItem("school-id")}`,
                        
                            {
                                skip: page * this.state.imgsPerPage,
                                limit: this.state.imgsPerPage,

                                filter: {
                                    tag: this.state.currenttitle
                                }

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
                    })
                }
                    else if(this.state.filtername === 'course'){
                        req
                        .post(
                            `/app/teacher/gallery/${localStorage.getItem("school-id")}/${this.state.currentcourseID}`,
                            
                                {
                                    skip: page * this.state.imgsPerPage,
                                    limit: this.state.imgsPerPage,
    
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
                        })
                    }

            });
        } else {
            this.setState({page})
           
        }
       

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

    handleCloseDialog() {
        this.setState({open_diolog: false})
    }
    handleClose() {
        
        this.setState({opendialog: false})
  }
    openImgDialog(item) {
        this.setState({open_img_diolog: item, open_diolog: true})

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
                .post(`/app/teacher/gallery/${localStorage.getItem("school-id")}`, {
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
            this.setState({
                filter_taglist: !active
            })
        }
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
                .post(`/app/teacher/gallery/${localStorage.getItem("school-id")}/${name.ID}`, {
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
                        filtername: 'course',
                        page: 1,
                        currenttitle: "درس " + name.name,
                        currentcourseID: name.ID,
                        waiting: false
                    })
                })
                .catch(err => {
                    this.setState({message: "خطای سرور", messageOpen: true, messageType: "error"});
                });
        });

    }
    removeImage(index) {
      let files = this
          .state
          .files
          files
          .splice(index, 1)
      this.setState({files: files})
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
                .post(`/app/teacher/gallery/${localStorage.getItem("school-id")}`, {
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
            waiting: true,selectedCourseId:localStorage.getItem("course-id")
        }, () => {
            req
                .post(`/app/teacher/gallery/${localStorage.getItem("school-id")}`, {
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

                req
                .get(`/app/teacher/gallery-tag/${localStorage.getItem("school-id")}`)
                .then((response) => {
                    this.setState({tags: response.data, waiting: false})
                })
                .catch(err => {
                    this.setState({message: "خطای سرور", messageOpen: true, messageType: "error"});
                });

                req
                .get("/app/teacher/course-list")
                .then((response) => {
                    response.data.forEach(element => {
                        if(element.ID===localStorage.getItem("school-id")){
                            this.setState({coursenames: element.courseList, waiting: false})
                        }
                    });
                   
                })
                .catch(err => {
                    this.setState({message: "خطای سرور", messageOpen: true, messageType: "error"});
                });

        });

       
       

        

    }
    render() {
        const {classes} = this.props;
        return (
          <div style={{ padding: 32 }}>
            <Paper style={{
                    flexGrow: 1
                }}>
                <Grid container="container" spacing={0} className={classes.container}>
                    <Grid item="item" xs={12}>
                        <AppBar position="static" className={classes.appbar}>
                            <Toolbar>
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
                                                    <ListItemText inset="inset" primary={courseitem.name}/>
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
                    <Grid item="item"  xs={12}>
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
                                                    
                                                    
                                                />

                                                <GridListTileBar
                                                    className={classes.gridlisttop}
                                                    titlePosition="top"
                                                    actionIcon={<div > {
                                                        item.newimg
                                                            ? <Avatar color='secondary' className={classes.newimg}>جدید</Avatar>
                                                            : null
                                                    }
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
                                    
                                </Dialog>
                                <Dialog
                                open={this.state.opendialog}
                                onClose={this.handleClose}
                                >
                                <DialogTitle id="alert-dialog-title">{"بارگذاری عکس"}</DialogTitle>
                                <DialogContent>
                                <InputLabel htmlFor="course-native-simple">درس</InputLabel>
                                <br />
                                <Select
                                            native="native"
                                            value={this.state.selectedCourseId}
                                            onChange={this.handleSelectCourse}
                                            className={classes.select}
                                            inputProps={{
                                                name: 'selectedCourseId',
                                                id: 'course-native-simple'
                                            }}>
                                            
                                            {
                                                this.state.coursenames.map((course,i)=>
                                                <option key={i} value={course.ID}>{course.name }</option>    
                                                )
                                            
                                            }
                                    </Select>  
                                    <br /> 
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
                                         className={classes.select}
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
                                    <Button
                                        onClick={this.handleClose}
                                        variant="contained"
                                        autoFocus="autoFocus">
                                        انصراف
                                        
                                    </Button>
                                </DialogActions>
                            </Dialog>

                        
                    </Grid>

                </Grid>
            </Paper>
            </div>
        );
    }
}
TeacherGallery.propTypes = {
    classes: PropTypes.object.isRequired
};
export default withStyles(styles)(TeacherGallery);