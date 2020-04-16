import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
const theme = createMuiTheme({
  display: "flex",
  direction: "rtl",
  // palette: {
  //   primary: {
  //     // light: will be calculated from palette.primary.main,
  //     main: '#ff4400',
  //     // dark: will be calculated from palette.primary.main,
  //     // contrastText: will be calculated to contrast with palette.primary.main
  //   },
  //   secondary: {
  //     light: '#0066ff',
  //     main: '#0044ff',
  //     // dark: will be calculated from palette.secondary.main,
  //     contrastText: '#ffcc00',
  //   },
  //   // error: will use the default color
  // },
  typography: {
    fontFamily: "IRANSans",
    fontSize: 12,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    body1: {
      fontFamily: "IRANSans",
      //fontSize: "0.875rem",
      lineHeight: "1.46429em",
      color: "rgba(0, 0, 0, 0.87)",
      fontWeight: 400
    },
    title: {
      fontFamily: "IRANSans",
      //fontSize: "1.2rem",
      lineHeight: "1.46429em",
      color: "rgba(0, 0, 0, 0.87)",
      fontWeight: 700
    },
    h1: {
      fontFamily: "IRANSans",
      fontSize: "3rem",
      lineHeight: "1.46429em",
      color: "rgba(0, 0, 0, 0.87)",
      fontWeight: 700
    }
  }
});
theme.typography.title = {
  fontSize: "0.8rem",
  '@media (min-width:600px)': {
    fontSize: "0.8rem",
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '1.2rem',
  },
};
theme.typography.body1 = {
  fontSize: "0.6rem",
  '@media (min-width:600px)': {
    fontSize: "0.6rem",
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '0.875rem',
  },
};
export default theme;