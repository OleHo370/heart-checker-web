// Parse the URL to extract the id_token parameter
(async () => {
	const log = console.log;

	let user;
	let idToken = localStorage.getItem('idToken');

	if (idToken && idToken != 'null') user = jwt_decode(idToken);
	else idToken = null;

	if (!idToken || user.exp < Date.now() / 1000) {
		// get the AWS Cognito id_token from the URL
		let params = location.search;
		if (!params) params = '?' + location.hash.slice(1);
		const urlParams = new URLSearchParams(params);
		idToken = urlParams.get('id_token');
		localStorage.setItem('idToken', idToken);
		if (!idToken) return;
		user = jwt_decode(idToken);

		// hide the token from the URL
		window.history.pushState(null, '', location.href.split(/[?#]/)[0]);
	}

	// DELETE LATER
	window.idToken = idToken; // for debugging

	log(user);

	document.getElementById('unauth').style.display = 'none';
	document.getElementById('auth').style.display = 'block';

	document.getElementById('username') = user.email;
})();
