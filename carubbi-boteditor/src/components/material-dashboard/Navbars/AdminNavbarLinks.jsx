import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import { withRouter } from "react-router";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Hidden from "@material-ui/core/Hidden";
import Poppers from "@material-ui/core/Popper";
import Divider from "@material-ui/core/Divider";
// @material-ui/icons
import Person from "@material-ui/icons/Person";
// import Notifications from "@material-ui/icons/Notifications";
import Dashboard from "@material-ui/icons/Dashboard";
// import Search from "@material-ui/icons/Search";
// core components
// import CustomInput from "../CustomInput/CustomInput";
import Button from "../CustomButtons/Button";

import headerLinksStyle from "../../../assets/material-dashboard/jss/material-dashboard-react/components/headerLinksStyle.jsx";
import { logout } from "../../../services/auth";

class AdminNavbarLinks extends React.Component {
  state = {
    openNotifcation: false,
    openProfile: false
  };
  handleRedirectToDashboard = () => {
    this.props.history.push("/admin/dashboard");
  };
  handleToggleNotification = () => {
    this.setState(state => ({ openNotifcation: !state.openNotifcation }));
  };
  handleCloseNotification = event => {
    if (this.anchorNotification.contains(event.target)) {
      return;
    }
    this.setState({ openNotifcation: false });
  };
  handleToggleProfile = () => {
    this.setState(state => ({ openProfile: !state.openProfile }));
  };
  handleCloseProfile = event => {
    if (this.anchorProfile.contains(event.target)) {
      return;
    }
    this.setState({ openProfile: false });
  };
  handleLogout = event => {
    if (this.anchorProfile.contains(event.target)) {
      return;
    }
    logout();
    this.setState({ openProfile: false });
    this.props.history.push("/login");
  };
  render() {
    const { classes, bgcolor, builderRoute } = this.props;
    const selectedMenuItemClass = classNames({
      [" " + classes[bgcolor]]: true
    });

    const { openNotifcation, openProfile } = this.state;
    return (
      <div>
        <Button
          color={
            window.innerWidth > 959 && !builderRoute ? "transparent" : "white"
          }
          justIcon={window.innerWidth > 959 && !builderRoute}
          simple={!(window.innerWidth > 959 && !builderRoute)}
          aria-label="Dashboard"
          className={classes.buttonLink}
          onClick={this.handleRedirectToDashboard}
        >
          <Dashboard className={classes.icons} />
          {builderRoute ? (
            <p className={classes.linkText}>Dashboard</p>
          ) : (
            <Hidden mdUp implementation="css">
              <p className={classes.linkText}>Dashboard</p>
            </Hidden>
          )}
        </Button>
        <div className={classes.manager}>
          <Button
            ref={node => {
              this.anchorProfile = node;
            }}
            color={
              window.innerWidth > 959 && !builderRoute ? "transparent" : "white"
            }
            justIcon={window.innerWidth > 959 && !builderRoute}
            simple={!(window.innerWidth > 959 && !builderRoute)}
            aria-owns={openNotifcation ? "profile-menu-list-grow" : null}
            aria-haspopup="true"
            onClick={this.handleToggleProfile}
            className={classes.buttonLink}
          >
            <Person className={classes.icons} />
            {builderRoute ? (
              <p className={classes.linkText}>Profile</p>
            ) : (
              <Hidden mdUp implementation="css">
                <p className={classes.linkText}>Profile</p>
              </Hidden>
            )}
          </Button>
          <Poppers
            open={openProfile}
            anchorEl={this.anchorProfile}
            transition
            disablePortal
            className={
              classNames({
                [classes.popperClose]: !openProfile
              }) +
              " " +
              classes.popperNav +
              " " +
              classNames({
                [classes.popperNavBuilder]: builderRoute
              })
            }
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="profile-menu-list-grow"
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom"
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={this.handleCloseProfile}>
                    <MenuList role="menu">
                      <MenuItem
                        onClick={this.handleCloseProfile}
                        className={classes.dropdownItem + selectedMenuItemClass}
                      >
                        Conta
                      </MenuItem>
                      <MenuItem
                        onClick={this.handleCloseProfile}
                        className={classes.dropdownItem + selectedMenuItemClass}
                      >
                        Configurações
                      </MenuItem>
                      <Divider light />
                      <MenuItem
                        onClick={this.handleLogout}
                        className={classes.dropdownItem + selectedMenuItemClass}
                      >
                        Sair
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Poppers>
        </div>
      </div>
    );
  }
}

AdminNavbarLinks.propTypes = {
  builderRoute: PropTypes.bool.isRequired,
  classes: PropTypes.object,
  bgColor: PropTypes.oneOf(["purple", "blue", "green", "orange", "red"])
};

export default withRouter(withStyles(headerLinksStyle)(AdminNavbarLinks));
