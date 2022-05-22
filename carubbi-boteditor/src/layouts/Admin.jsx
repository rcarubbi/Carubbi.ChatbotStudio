import React from 'react';
import classNames from 'classnames';
import { Route, Switch, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
// creates a beautiful scrollbar
import PerfectScrollbar from 'perfect-scrollbar';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
// @material-ui/core components
import { createTheme, withStyles } from '@material-ui/core/styles';

import { ThemeProvider } from '@material-ui/styles';

// core components
import Navbar from '../components/material-dashboard/Navbars/Navbar.jsx';
import Footer from '../components/material-dashboard/Footer/Footer.jsx';
import Sidebar from '../components/material-dashboard/Sidebar/Sidebar.jsx';

import routes from '../routes.js';
import adminStyle from '../assets/material-dashboard/jss/material-dashboard-react/layouts/adminStyle.jsx';

import image from '../assets/material-dashboard/img/sidebar-2.jpg';
import logo from '../assets/material-dashboard/img/reactlogo.png';
import { activeRoute } from '../services/routeService';

import '../assets/material-dashboard/css/material-dashboard-react.css';

const theme = createTheme({});

const switchRoutes = (
	<Switch>
		{routes.map((prop, key) => {
			if (prop.layout === '/admin') {
				return (
					<Route
						path={prop.layout + prop.path}
						component={prop.component}
						key={key}
					/>
				);
			}
			return null;
		})}
		<Route
			exact
			path='/admin'
			render={() => <Redirect to='/admin/dashboard' />}
		/>
	</Switch>
);

let ps;

class Admin extends React.Component {
	state = {
		image: image,
		hasImage: true,
		mobileOpen: false,
		builderRoute: activeRoute(this.props.history, '/admin/builder'),
	};
	mainPanel = React.createRef();
  
	handleDrawerToggle = () => {
		this.setState({ mobileOpen: !this.state.mobileOpen });
	};
	getRoute() {
		return window.location.pathname !== `${process.env.PUBLIC_URL}/admin/builder`;
	}
	resizeFunction = () => {
		if (window.innerWidth >= 960) {
			this.setState({ mobileOpen: false });
		}
	};
	componentDidMount() {
		const builderRoute = activeRoute(this.props.history, '/admin/builder');
		const preferences =  {
			color: 'purple',
			image,
		};
		 
 
		this.setState(() => {
			return {
				builderRoute,
				...preferences,
				mainPanelSize: classNames({
					[' ' + this.props.classes.mainPanelSize]: !builderRoute,
					[' ' + this.props.classes.builderPanelSize]: builderRoute,
				}),
			};
		});

		if (navigator.platform.indexOf('Win') > -1) {
			ps = new PerfectScrollbar(this.mainPanel.current);
		}
		window.addEventListener('resize', this.resizeFunction);
	}
	componentDidUpdate(e) {
		if (e.history.location.pathname !== e.location.pathname) {
			const builderRoute = activeRoute(
				this.props.history,
				'/admin/builder',
			);
			this.setState({
				mainPanelSize: classNames({
					[' ' + this.props.classes.mainPanelSize]: !builderRoute,
				}),
				builderRoute,
			});
			this.mainPanel.current.scrollTop = 0;
			if (this.state.mobileOpen) {
				this.setState({ mobileOpen: false });
			}
		}
	}
	componentWillUnmount() {
		if (navigator.platform.indexOf('Win') > -1) {
			ps.destroy();
		}
		window.removeEventListener('resize', this.resizeFunction);
	}
	render() {
		const { classes, ...rest } = this.props;
		return (
			<ThemeProvider theme={theme}>
				<div className={classes.wrapper}>
					<Sidebar
						builderRoute={this.state.builderRoute}
						routes={routes}
						logoText={'Bot Editor'}
						logo={logo}
						image={this.state.image}
						handleDrawerToggle={this.handleDrawerToggle}
						open={this.state.mobileOpen}
						color={this.state.color}
						{...rest}
					/>

					<div
						className={classes.mainPanel + this.state.mainPanelSize}
						ref={this.mainPanel}
					>
						<Navbar
							builderRoute={this.state.builderRoute}
							routes={routes}
							handleDrawerToggle={this.handleDrawerToggle}
							bgcolor={this.state.color}
							{...rest}
						/>
						{this.getRoute() ? (
							<div className={classes.content}>
								<div className={classes.container}>
									{switchRoutes}
								</div>
							</div>
						) : (
							<div className={classes.map}>{switchRoutes}</div>
						)}
						{this.getRoute() ? <Footer /> : null}
					 
					</div>
				</div>
			</ThemeProvider>
		);
	}
}

Admin.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(adminStyle)(Admin));
