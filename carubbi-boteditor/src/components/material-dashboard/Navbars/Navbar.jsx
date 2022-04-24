import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
// @material-ui/icons
import Menu from '@material-ui/icons/Menu';
// core components
import AdminNavbarLinks from './AdminNavbarLinks.jsx';
import Button from '../CustomButtons/Button';

import headerStyle from '../../../assets/material-dashboard/jss/material-dashboard-react/components/headerStyle.jsx';
function Header({ ...props }) {
	function makeBrand() {
		var name;
		props.routes.map(prop => {
			if (window.location.href.indexOf(prop.layout + prop.path) !== -1) {
				name = prop.name;
			}
			return null;
		});
		return name || 'Dashboard';
	}
	const { builderRoute, classes, color, bgcolor } = props;
	const appBarClasses = classNames({
		[' ' + classes[color]]: color,
	});
	const containerRtlClasses = classNames({
		[' ' + classes.containerRtl]: builderRoute,
	});
	return (
		<AppBar className={classes.appBar + appBarClasses}>
			<Toolbar className={classes.container + containerRtlClasses}>
				<div className={classes.flex}>
					{/* Here we create navbar brand, based on route name */}
					<Button
						color='transparent'
						href='#'
						className={classes.title}
					>
						{makeBrand()}
					</Button>
				</div>
				{builderRoute ? (
					<IconButton
						color='inherit'
						aria-label='open drawer'
						onClick={props.handleDrawerToggle}
					>
						<Menu />
					</IconButton>
				) : (
					<>
						<Hidden smDown implementation='css'>
							<AdminNavbarLinks
								bgcolor={bgcolor}
								builderRoute={builderRoute}
							/>
						</Hidden>
						<Hidden mdUp implementation='css'>
							<IconButton
								color='inherit'
								aria-label='open drawer'
								onClick={props.handleDrawerToggle}
							>
								<Menu />
							</IconButton>
						</Hidden>
					</>
				)}
			</Toolbar>
		</AppBar>
	);
}

Header.propTypes = {
	classes: PropTypes.object.isRequired,
	color: PropTypes.oneOf(['primary', 'info', 'success', 'warning', 'danger']),
	bgColor: PropTypes.oneOf(['purple', 'blue', 'green', 'orange', 'red']),
	rtlActive: PropTypes.bool,
	handleDrawerToggle: PropTypes.func,
	routes: PropTypes.arrayOf(PropTypes.object),
};

export default withStyles(headerStyle)(Header);
