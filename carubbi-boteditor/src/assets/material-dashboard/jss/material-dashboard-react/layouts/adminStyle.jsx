import {
	drawerWidth,
	transition,
	container,
} from '../../material-dashboard-react.jsx';

const adminStyle = theme => ({
	wrapper: {
		position: 'relative',
		top: '0',
		height: '100vh',
	},
	mainPanelSize: {
		[theme.breakpoints.up('md')]: {
			width: `calc(100% - ${drawerWidth}px) !important`,
		},
	},
	builderPanelSize: {
		width: '100% !important',
	},
	mainPanel: {
		overflow: 'hidden',
		position: 'relative',
		float: 'right',
		...transition,
		maxHeight: '100%',
		width: '100%',
		overflowScrolling: 'touch',
	},
	content: {
		marginTop: '70px',
		padding: '15px 15px',
		height: 'calc(100vh - 145px)',
	},
	container,
	map: {
		marginTop: '70px',
	},
});

export default adminStyle;
