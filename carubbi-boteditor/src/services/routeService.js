export function activeRoute(history, routeName) {
	if (history.location) {
		return history.location.pathname.indexOf(routeName) > -1 ? true : false;
	}
	return false;
}
