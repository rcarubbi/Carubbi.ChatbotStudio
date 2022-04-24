import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import { isAuthenticated } from './services/auth';

import Signup from './pages/Signup';
import Login from './pages/Login';
import PageNotFound from './pages/PageNotFound';

import Admin from './layouts/Admin';

const PrivateRoute = ({ component: Component, ...rest }) => (
	<Route
		{...rest}
		render={props =>
			isAuthenticated() ? (
				<Component {...props} />
			) : (
				<Redirect
					to={{ pathname: '/login', state: { from: props.location } }}
				/>
			)
		}
	/>
);

const hist = createBrowserHistory({ basename: process.env.PUBLIC_URL});

const App = props => (
	<Router basename={process.env.PUBLIC_URL} history={hist}>
		<Switch>
			<PrivateRoute path='/admin' component={Admin} />
			<Route exact path='/login' component={Login} />
			<Route exact path='/signup' component={Signup} />
			<Route
				exact
				path='/'
				render={() => <Redirect to='/admin/dashboard' />}
			/>
			<Route path='*' component={PageNotFound} />
		</Switch>
	</Router>
);

export default App;
