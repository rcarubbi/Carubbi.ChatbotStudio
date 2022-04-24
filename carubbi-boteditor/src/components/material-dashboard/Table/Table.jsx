import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
// core components
import tableStyle from '../../../assets/material-dashboard/jss/material-dashboard-react/components/tableStyle.jsx';
import PerfectScrollbar from 'perfect-scrollbar';

function CustomTable({ ...props }) {
	const tableContainerRef = useRef(null);
	const { classes, tableHead, tableData, tableHeaderColor, height } = props;
	useEffect(() => {
		const ps = new PerfectScrollbar(tableContainerRef.current, {});
		return function cleanUp() {
			ps.destroy();
		};
	}, []);
	return (
		<div
			className={classes.tableResponsive}
			style={{ height: height, position: 'relative' }}
			ref={tableContainerRef}
		>
			<Table className={classes.table}>
				{tableHead !== undefined ? (
					<TableHead
						className={classes[tableHeaderColor + 'TableHeader']}
					>
						<TableRow className={classes.tableHeadRow}>
							{tableHead.map((prop, key) => {
								return (
									<TableCell
										align={prop.align || 'left'}
										className={
											classes.tableCell +
											' ' +
											classes.tableHeadCell
										}
										key={key}
									>
										{prop.text || prop}
									</TableCell>
								);
							})}
						</TableRow>
					</TableHead>
				) : null}
				<TableBody>
					{tableData.map((prop, key) => {
						return (
							<TableRow
								key={key}
								className={classes.tableBodyRow}
							>
								{prop.map((prop, key) => {
									return (
										<TableCell
											align={prop.align || 'left'}
											className={classes.tableCell}
											key={key}
										>
											{prop.text || prop}
										</TableCell>
									);
								})}
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}

CustomTable.defaultProps = {
	tableHeaderColor: 'gray',
};

CustomTable.propTypes = {
	height: PropTypes.string,
	classes: PropTypes.object.isRequired,
	tableHeaderColor: PropTypes.oneOf([
		'warning',
		'primary',
		'danger',
		'success',
		'info',
		'rose',
		'gray',
	]),
	tableHead: PropTypes.arrayOf(PropTypes.any),
	tableData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.any)),
};

export default withStyles(tableStyle)(CustomTable);
