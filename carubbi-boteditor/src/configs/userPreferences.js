export const setPreferences = preferences => {
	localStorage.setItem('preferences', JSON.stringify(preferences));
};
export const getPreferences = () => {
	return JSON.parse(localStorage.getItem('preferences'));
};
