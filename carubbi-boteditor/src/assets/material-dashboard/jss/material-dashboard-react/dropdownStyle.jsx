/*!

=========================================================
* Material Dashboard React - v1.7.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import {
  primaryColor,
  infoColor,
  successColor,
  warningColor,
  dangerColor,
  whiteColor,
  primaryBoxShadow,
  defaultFont,
  blackColor,
  grayColor,
  hexToRgb
} from "../material-dashboard-react.jsx";

const dropdownStyle = theme => ({
  buttonLink: {
    [theme.breakpoints.down("md")]: {
      display: "flex",
      marginLeft: "30px",
      width: "auto"
    }
  },
  links: {
    width: "20px",
    height: "20px",
    zIndex: "4",
    [theme.breakpoints.down("md")]: {
      display: "block",
      width: "30px",
      height: "30px",
      color: grayColor[9],
      marginRight: "15px"
    }
  },
  linkText: {
    zIndex: "4",
    ...defaultFont,
    fontSize: "14px"
  },
  popperClose: {
    pointerEvents: "none"
  },
  pooperResponsive: {
    [theme.breakpoints.down("md")]: {
      zIndex: "1640",
      position: "static",
      float: "none",
      width: "auto",
      marginTop: "0",
      backgroundColor: "transparent",
      border: "0",
      WebkitBoxShadow: "none",
      boxShadow: "none",
      color: "black"
    }
  },
  popperNavBuilder: {
    position: "static !important",
    left: "unset !important",
    top: "unset !important",
    transform: "none !important",
    willChange: "unset !important",
    "& > div": {
      boxShadow: "none !important",
      marginLeft: "0rem",
      marginRight: "0rem",
      transition: "none !important",
      marginTop: "0px !important",
      marginBottom: "0px !important",
      padding: "0px !important",
      backgroundColor: "transparent !important",
      "& ul li": {
        color: whiteColor + " !important",
        margin: "10px 15px 0!important",
        padding: "10px 15px !important",
        "&:hover": {
          backgroundColor: "hsla(0,0%,78%,.2)",
          boxShadow: "none"
        }
      }
    }
  },
  popperNav: {
    [theme.breakpoints.down("sm")]: {
      position: "static !important",
      left: "unset !important",
      top: "unset !important",
      transform: "none !important",
      willChange: "unset !important",
      "& > div": {
        boxShadow: "none !important",
        marginLeft: "0rem",
        marginRight: "0rem",
        transition: "none !important",
        marginTop: "0px !important",
        marginBottom: "0px !important",
        padding: "0px !important",
        backgroundColor: "transparent !important",
        "& ul li": {
          color: whiteColor + " !important",
          margin: "10px 15px 0!important",
          padding: "10px 15px !important",
          "&:hover": {
            backgroundColor: "hsla(0,0%,78%,.2)",
            boxShadow: "none"
          }
        }
      }
    }
  },
  dropdown: {
    borderRadius: "3px",
    border: "0",
    boxShadow: "0 2px 5px 0 rgba(" + hexToRgb(blackColor) + ", 0.26)",
    top: "100%",
    zIndex: "1000",
    minWidth: "160px",
    padding: "5px 0",
    margin: "2px 0 0",
    fontSize: "14px",
    textAlign: "left",
    listStyle: "none",
    backgroundColor: whiteColor,
    WebkitBackgroundClip: "padding-box",
    backgroundClip: "padding-box"
  },
  dropdownItem: {
    ...defaultFont,
    fontSize: "13px",
    padding: "10px 20px",
    margin: "0 5px",
    borderRadius: "2px",
    WebkitTransition: "all 150ms linear",
    MozTransition: "all 150ms linear",
    OTransition: "all 150ms linear",
    MsTransition: "all 150ms linear",
    transition: "all 150ms linear",
    display: "block",
    clear: "both",
    fontWeight: "400",
    lineHeight: "1.42857143",
    color: grayColor[8],
    whiteSpace: "nowrap",
    height: "unset",
    minHeight: "unset",
    "&:hover": {
      color: whiteColor
    }
  },
  purple: {
    "&:hover,&:focus": {
      backgroundColor: primaryColor[0],
      ...primaryBoxShadow
    }
  },
  blue: {
    "&:hover,&:focus": {
      backgroundColor: infoColor[0],
      boxShadow:
        "0 12px 20px -10px rgba(" +
        hexToRgb(infoColor[0]) +
        ",.28), 0 4px 20px 0 rgba(" +
        hexToRgb(blackColor) +
        ",.12), 0 7px 8px -5px rgba(" +
        hexToRgb(infoColor[0]) +
        ",.2)"
    }
  },
  green: {
    "&:hover,&:focus": {
      backgroundColor: successColor[0],
      boxShadow:
        "0 12px 20px -10px rgba(" +
        hexToRgb(successColor[0]) +
        ",.28), 0 4px 20px 0 rgba(" +
        hexToRgb(blackColor) +
        ",.12), 0 7px 8px -5px rgba(" +
        hexToRgb(successColor[0]) +
        ",.2)"
    }
  },
  orange: {
    "&:hover,&:focus": {
      backgroundColor: warningColor[0],
      boxShadow:
        "0 12px 20px -10px rgba(" +
        hexToRgb(warningColor[0]) +
        ",.28), 0 4px 20px 0 rgba(" +
        hexToRgb(blackColor) +
        ",.12), 0 7px 8px -5px rgba(" +
        hexToRgb(warningColor[0]) +
        ",.2)"
    }
  },
  red: {
    "&:hover,&:focus": {
      backgroundColor: dangerColor[0],
      boxShadow:
        "0 12px 20px -10px rgba(" +
        hexToRgb(dangerColor[0]) +
        ",.28), 0 4px 20px 0 rgba(" +
        hexToRgb(blackColor) +
        ",.12), 0 7px 8px -5px rgba(" +
        hexToRgb(dangerColor[0]) +
        ",.2)"
    }
  }
});

export default dropdownStyle;
