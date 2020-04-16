import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import compose from 'recompose/compose';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import  Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Home from '@material-ui/icons/Home';
import {Link, withRouter } from "react-router-dom";

import ManagerMenu from './ManagerMenu.jsx';
import ManagerMainRouter from '../routers/ManagerMainRouter';
import ManagerTitleRouter from '../routers/ManagerTitleRouter';

import AdminMenu from '../AdminDashboard/AdminMenu';
import AdminMainRouter from '../routers/AdminMainRouter';
import AdminTitleRouter from '../routers/AdminTitleRouter';

import ParentMenu from '../ParentDashboard/ParentMenu';
import ParentMainRouter from '../routers/ParentMainRouter';
import ParentTitleRouter from '../routers/ParentTitleRouter';

import TeacherMenu from '../TeacherDashboard/TeacherMenu';
import TeacherMainRouter from '../routers/TeacherMainRouter';
import TeacherTitleRouter from '../routers/TeacherTitleRouter';

import CssBaseline from '@material-ui/core/CssBaseline';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandLess from '@material-ui/icons/ExpandLess'

const drawerWidth = 240;

// const styles = theme => ({
//   root: {
//     flexGrow: 1,
//     height: "fit-content",
//     zIndex: 1,
//     position: "relative",
//     display: "flex"
//   },
//   appBar: {
//     zIndex: theme.zIndex.drawer + 1,
//     transition: theme.transitions.create(["width", "margin"], {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.leavingScreen
//     }),
//     float: "left"
//   },
//   appBarShift: {
//     width: `calc(100% - ${drawerWidth}px)`,
//     transition: theme.transitions.create(["width", "margin"], {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.enteringScreen
//     }),
//     marginLeft: drawerWidth
//   },
//   menuButton: {
//     marginLeft: 12,
//     marginRight: 36
//   },
//   hide: {
//     display: "none"
//   },
//   drawerPaper: {
//     position: "relative",
//     whiteSpace: "nowrap",
//     width: drawerWidth,
//     transition: theme.transitions.create("width", {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.enteringScreen
//     })
//   },
//   drawerPaperClose: {
//     overflowX: "hidden",
//     transition: theme.transitions.create("width", {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.leavingScreen
//     }),
//     width: theme.spacing.unit * 7,
//     [theme.breakpoints.up("sm")]: {
//       width: theme.spacing.unit * 9
//     }
//   },
//   toolbar: {
//     alignItems: "center",
//     justifyContent: "flex-end",
//     padding: "0 8px",
//     ...theme.mixins.toolbar
//   },
//   content: {
//     flexGrow: 1,
//     backgroundColor: theme.palette.background.default,
//   }
// });

const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    //width: `calc(100% - ${drawerWidth}px)`,
    //marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    //marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
});

// class MiniDrawer extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       open: false,
//     };
//   }

//   handleDrawerOpen() {  
//     this.setState({ open: true });
//   }

//   handleDrawerClose() {
//     this.setState({ open: false });
//   }

//   render() {
//     const { classes, match } = this.props;
//     let menu;
//     if(match.path.slice(0,25)=='/sahand/manager/dashboard') {
//       menu = <ManagerMenu />
//     }
//     else if(match.path.slice(0,23)=='/sahand/admin/dashboard') {
//       menu = <AdminMenu />
//     }
    
//     else if(match.path.slice(0,24)=='/sahand/parent/dashboard') {
//       menu = <ParentMenu />
//     }

//     else if(match.path.slice(0,25)=='/sahand/teacher/dashboard') {
//       menu = <TeacherMenu />
//     }

//     let mainPage;
//     if(match.path.slice(0,25)=='/sahand/manager/dashboard') {
//       mainPage = <ManagerMainRouter />
//     }
//     else if(match.path.slice(0,23)=='/sahand/admin/dashboard') {
//       mainPage = <AdminMainRouter />
//     }
    
//     else if(match.path.slice(0,24)=='/sahand/parent/dashboard') {
//       mainPage = <ParentMainRouter />
//     }
//     else if(match.path.slice(0,25)=='/sahand/teacher/dashboard') {
//       mainPage = <TeacherMainRouter />
//     }


//     let title;
//     if(match.path.slice(0,25)=='/sahand/manager/dashboard') {
//       title = <ManagerTitleRouter />
//     }
//     else if(match.path.slice(0,23)=='/sahand/admin/dashboard') {
//       title = <AdminTitleRouter />
//     }
    
//     else if(match.path.slice(0,24)=='/sahand/parent/dashboard') {
//       title = <ParentTitleRouter />
//     }
//     else if(match.path.slice(0,25)=='/sahand/teacher/dashboard') {
//       title = <TeacherTitleRouter />
//     }
                
                
//     return (
//       <div className={classes.root}>
//         <AppBar
//           position="absolute"
//           className={classNames(
//             classes.appBar,
//             this.state.open && classes.appBarShift
//           )}
//         >
//           <Toolbar disableGutters={!this.state.open}>
//             <IconButton
//               color="inherit"
//               aria-label="Open drawer"
//               onClick={this.handleDrawerOpen.bind(this)}
//               className={classNames(
//                 classes.menuButton,
//                 this.state.open && classes.hide
//               )}
//             >
//               <Menu />
//             </IconButton>
//             {title}
           
//           </Toolbar>
//         </AppBar>
//         <Drawer
//           variant="permanent"
//           anchor="right"
//           classes={{
//             paper: classNames(
//               classes.drawerPaper,
//               !this.state.open && classes.drawerPaperClose
//             )
//           }}
//           open={this.state.open}
//         >
//           <div className={classes.toolbar}>
//             <IconButton onClick={this.handleDrawerClose.bind(this)}>
//               <ChevronRight />
//             </IconButton>
//           </div>
//           <Divider />
//           {menu}
//         </Drawer>
//         <main className={classes.content}>
//           <div className={classes.toolbar} />
//            {mainPage}
//         </main>
//       </div>
//     );
//   }
// }

// MiniDrawer.propTypes = {
//   classes: PropTypes.object.isRequired,
//   history: PropTypes.object.isRequired,
//   match: PropTypes.object.isRequired
// };

// export default withRouter(withStyles(styles)(MiniDrawer));
class PersistentDrawerLeft extends React.Component {
  state = {
    open: false,
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, theme, match } = this.props;
    const { open } = this.state;

    let menu;
    let mainPage;
    let title;
    let home;
    if(match.path.slice(0,25)=='/sahand/manager/dashboard') {
      menu = <ManagerMenu path={this.props.location.pathname}/>
      mainPage = <ManagerMainRouter />
      title = <ManagerTitleRouter />
      home='/sahand/manager/dashboard'
    }
    else if(match.path.slice(0,23)=='/sahand/admin/dashboard') {
      menu = <AdminMenu />
      mainPage = <AdminMainRouter />
      title = <AdminTitleRouter />
      home='/sahand/admin/dashboard'
    }
    
    else if(match.path.slice(0,24)=='/sahand/parent/dashboard') {
      menu = <ParentMenu path={this.props.location.pathname}/>
      mainPage = <ParentMainRouter />
      title = <ParentTitleRouter />
      home='/sahand/parent/dashboard'
    }

    else if(match.path.slice(0,25)=='/sahand/teacher/dashboard') {
      menu = <TeacherMenu />
      mainPage = <TeacherMainRouter />
      title = <TeacherTitleRouter />
      home='/sahand/teacher/dashboard'
    }
    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={classNames(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar disableGutters={!open}>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <IconButton
              color="inherit"
              component={Link}
              to={home}
              className={classes.menuButton}
            >
              <Home />
            </IconButton>
            {title}
          </Toolbar>
        </AppBar>
        {!isWidthDown('xs', this.props.width) && open &&
          <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={open}
            classes={{
              paper: classes.drawerPaper,
            }}
          >
              <IconButton onClick={this.handleDrawerClose}>
                {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </IconButton>
            <Divider />
            {menu}
          </Drawer>
        }
        <Grid 
          className={classes.content}
          style={{paddingTop:60}}
          container="container" 
          direction="column">
            {isWidthDown('xs', this.props.width) && open && 
              <Grid item>
                <Button fullWidth onClick={this.handleDrawerClose}>
                  <ExpandLess />
                </Button>
                <Divider />
                {menu}
              </Grid>
            }
          <Grid item>
            <main
              className={classNames(classes.content, {
                [classes.contentShift]: open,
              })}
            >
              {mainPage}
            </main>
          </Grid>
        </Grid>
      </div>
    );
  }
}

PersistentDrawerLeft.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};
export default withRouter(compose(withWidth(),withStyles(styles, { withTheme: true }))
    (PersistentDrawerLeft));