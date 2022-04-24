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
	container,
	defaultFont,
	primaryColor,
	defaultBoxShadow,
	infoColor,
	successColor,
	warningColor,
	dangerColor,
	whiteColor,
	grayColor,
} from '../../material-dashboard-react.jsx';

const headerStyle = () => ({
	appBar: {
		backgroundColor: 'transparent',
		boxShadow: 'none',
		borderBottom: '0',
		marginBottom: '0',
		position: 'absolute',
		width: '100%',
		paddingTop: '10px',
		zIndex: '1029',
		color: grayColor[7],
		border: '0',
		borderRadius: '3px',
		padding: '10px 0',
		transition: 'all 150ms ease 0s',
		minHeight: '50px',
		display: 'block',
	},
	container: {
		...container,
		minHeight: '50px',
	},
	containerRtl: {
		direction: 'rtl',
	},
	flex: {
		flex: 1,
	},
	title: {
		...defaultFont,
		letterSpacing: 'unset',
		lineHeight: '30px',
		fontSize: '18px',
		borderRadius: '3px',
		textTransform: 'none',
		color: 'inherit',
		margin: '0',
		'&:hover,&:focus': {
			background: 'transparent',
		},
	},
	appResponsive: {
		top: '8px',
	},
	primary: {
		backgroundColor: primaryColor[0],
		color: whiteColor,
		...defaultBoxShadow,
	},
	info: {
		backgroundColor: infoColor[0],
		color: whiteColor,
		...defaultBoxShadow,
	},
	success: {
		backgroundColor: successColor[0],
		color: whiteColor,
		...defaultBoxShadow,
	},
	warning: {
		backgroundColor: warningColor[0],
		color: whiteColor,
		...defaultBoxShadow,
	},
	danger: {
		backgroundColor: dangerColor[0],
		color: whiteColor,
		...defaultBoxShadow,
	},
});

export default headerStyle;
