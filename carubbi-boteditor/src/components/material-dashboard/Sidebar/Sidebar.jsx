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
/*eslint-disable*/
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';
// core components
import AdminNavbarLinks from '../Navbars/AdminNavbarLinks.jsx';

import sidebarStyle from '../../../assets/material-dashboard/jss/material-dashboard-react/components/sidebarStyle.jsx';
import { activeRoute } from '../../../services/routeService';

const Sidebar = ({ ...props }) => {
	// verifies if routeName is the one active (in browser input)
	const {
		builderRoute,
		classes,
		color,
		logo,
		image,
		logoText,
		routes,
	} = props;
	var links = (
		<List className={classes.list}>
			{routes
				.filter(item => item.path !== '/builder')
				.map((prop, key) => {
					var activePro = ' ';
					var listItemClasses;

					if (prop.path === '/upgrade-to-pro') {
						activePro = classes.activePro + ' ';
						listItemClasses = classNames({
							[' ' + classes[color]]: true,
						});
					} else {
						listItemClasses = classNames({
							[' ' + classes[color]]: activeRoute(
								props.history,
								prop.layout + prop.path,
							),
						});
					}
					const whiteFontClasses = classNames({
						[' ' + classes.whiteFont]: activeRoute(
							prop.layout + prop.path,
						),
					});
					return (
						<NavLink
							to={prop.layout + prop.path}
							className={activePro + classes.item}
							activeClassName='active'
							key={key}
						>
							<ListItem
								button
								className={classes.itemLink + listItemClasses}
							>
								{typeof prop.icon === 'string' ? (
									<Icon
										className={classNames(
											classes.itemIcon,
											whiteFontClasses,
											{
												[classes.itemIconRTL]:
													props.rtlActive,
											},
										)}
									>
										{prop.icon}
									</Icon>
								) : (
									<prop.icon
										className={classNames(
											classes.itemIcon,
											whiteFontClasses,
											{
												[classes.itemIconRTL]:
													props.rtlActive,
											},
										)}
									/>
								)}
								<ListItemText
									primary={
										props.rtlActive
											? prop.rtlName
											: prop.name
									}
									className={classNames(
										classes.itemText,
										whiteFontClasses,
										{
											[classes.itemTextRTL]:
												props.rtlActive,
										},
									)}
									disableTypography={true}
								/>
							</ListItem>
						</NavLink>
					);
				})}
		</List>
	);
	var brand = (
		<div className={classes.logo}>
			<a
				href='/'
				className={classNames(classes.logoLink, {
					[classes.logoLinkRTL]: props.rtlActive,
				})}
			>
				<div className={classes.logoImage}>
					<img src={logo} alt='logo' className={classes.img} />
				</div>
				{logoText}
			</a>
		</div>
	);
	return builderRoute ? (
		<>
			<Drawer
				variant='temporary'
				anchor={'left'}
				open={props.open}
				classes={{
					paper: classNames(classes.drawerPaper, {
						[classes.drawerPaperRTL]: props.rtlActive,
					}),
				}}
				onClose={props.handleDrawerToggle}
				ModalProps={{
					keepMounted: true, // Better open performance on mobile.
				}}
			>
				{brand}
				<div className={classes.sidebarWrapper}>
					<AdminNavbarLinks
						builderRoute={builderRoute}
						bgcolor={color}
					/>
					{links}
				</div>
				{image !== undefined ? (
					<div
						className={classes.background}
						style={{ backgroundImage: 'url(' + image + ')' }}
					/>
				) : null}
			</Drawer>
		</>
	) : (
		<>
			<Hidden mdUp implementation='css'>
				<Drawer
					variant='temporary'
					anchor={props.rtlActive ? 'left' : 'right'}
					open={props.open}
					classes={{
						paper: classNames(classes.drawerPaper, {
							[classes.drawerPaperRTL]: props.rtlActive,
						}),
					}}
					onClose={props.handleDrawerToggle}
					ModalProps={{
						keepMounted: true, // Better open performance on mobile.
					}}
				>
					{brand}
					<div className={classes.sidebarWrapper}>
						<AdminNavbarLinks
							bgcolor={color}
							builderRoute={builderRoute}
						/>
						{links}
					</div>
					{image !== undefined ? (
						<div
							className={classes.background}
							style={{ backgroundImage: 'url(' + image + ')' }}
						/>
					) : null}
				</Drawer>
			</Hidden>
			<Hidden smDown implementation='css'>
				<Drawer
					anchor={props.rtlActive ? 'right' : 'left'}
					variant='permanent'
					open
					classes={{
						paper: classNames(classes.drawerPaper, {
							[classes.drawerPaperRTL]: props.rtlActive,
						}),
					}}
				>
					{brand}
					<div className={classes.sidebarWrapper}>{links}</div>
					{image !== undefined ? (
						<div
							className={classes.background}
							style={{ backgroundImage: 'url(' + image + ')' }}
						/>
					) : null}
				</Drawer>
			</Hidden>
		</>
	);
};

Sidebar.propTypes = {
	builderRoute: PropTypes.bool.isRequired,
	classes: PropTypes.object.isRequired,
	rtlActive: PropTypes.bool,
	handleDrawerToggle: PropTypes.func,
	bgColor: PropTypes.oneOf(['purple', 'blue', 'green', 'orange', 'red']),
	logo: PropTypes.string,
	image: PropTypes.string,
	logoText: PropTypes.string,
	routes: PropTypes.arrayOf(PropTypes.object),
	open: PropTypes.bool,
};

export default withStyles(sidebarStyle)(Sidebar);
