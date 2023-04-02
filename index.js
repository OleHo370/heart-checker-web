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
		if (!idToken) return;
		localStorage.setItem('idToken', idToken);
		user = jwt_decode(idToken);

		// hide the token from the URL
		window.history.pushState(null, '', location.href.split(/[?#]/)[0]);
	}

	// // DELETE LATER
	window.idToken = idToken; // for debugging

	log(user);

	document.getElementById('unauth').style.display = 'none';
	document.getElementById('auth').style.display = 'flex';

	document.getElementById('email').innerHTML = user.email;

	let url = 'https://cikq6fmf4e.execute-api.us-east-2.amazonaws.com/main/patient';
	let data = await fetch(url, {
		method: 'GET',
		headers: {
			Authorization: idToken,
			'Content-Type': 'application/json'
		}
	});
	let patient = await data.json();

	log(patient);

	let daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	// Display patient's name and email
	const nameEl = document.getElementById('name');
	const emailEl = document.getElementById('email');
	nameEl.innerText = patient.name;
	// emailEl.innerText = user.email;

	// Display patient's exercises in table
	const exerciseTable = document.getElementById('exercise-table-body');

	for (let excercise of patient.excercises) {
		let row = document.createElement('tr');

		let name = document.createElement('td');
		name.textContent = excercise.description;
		row.appendChild(name);

		let schedule = excercise.schedule;
		for (let j = 0; j < schedule.length; j++) {
			let cell = document.createElement('td');
			cell.textContent = schedule[j] + 'hrs';
			row.appendChild(cell);
		}
		exerciseTable.appendChild(row);
	}

	const prescriptions = patient.prescriptions;

	// Get the element where the cards will be displayed
	const medicationContainer = document.getElementById('medication-container');

	// Loop through the prescriptions and create a card for each one
	for (let pre of prescriptions) {
		// Create a card element
		const card = document.createElement('div');
		card.classList.add('card');

		// Create a card body element
		const cardBody = document.createElement('div');
		cardBody.classList.add('card-body');

		// Add the medication name to the card body
		const medicationName = document.createElement('h4');
		medicationName.classList.add('card-title');
		medicationName.textContent = pre.medication + ' ' + pre.dosage;
		cardBody.appendChild(medicationName);

		// Add the medication dosage and notes to the card body
		const medicationDetails = document.createElement('p');
		medicationDetails.classList.add('card-text');
		medicationDetails.textContent = pre.notes;
		cardBody.appendChild(medicationDetails);

		// Add the medication schedule to the card body
		const table = document.createElement('table');
		const thead = document.createElement('thead');
		thead.innerHTML = `
<tr>
	<th></th>
	<th>Sun</th>
	<th>Mon</th>
	<th>Tue</th>
	<th>Wed</th>
	<th>Thu</th>
	<th>Fri</th>
	<th>Sat</th>
</tr>`;
		table.appendChild(thead);
		const tbody = document.createElement('tbody');

		// Loop through the medication schedule and add the days it's taken to the card
		let schedule = pre.schedule;
		let rows = {};

		// i represents the day of the week
		for (let i = 0; i < schedule.length; i++) {
			for (let s of schedule[i]) {
				let row = rows[s.hour];
				if (!row) {
					row = document.createElement('tr');
					let cell = document.createElement('td');
					cell.textContent = s.hour + ':00';
					row.appendChild(cell);
					tbody.appendChild(row);
					rows[s.hour] = row;
				}
				while (row.children.length < i + 1) {
					let cell = document.createElement('td');
					cell.textContent = 0;
					row.appendChild(cell);
				}
				let cell = document.createElement('td');
				cell.textContent = s.amount;
				row.appendChild(cell);
			}
		}
		for (let hour in rows) {
			let row = rows[hour];
			while (row.children.length < 8) {
				let cell = document.createElement('td');
				cell.textContent = 0;
				row.appendChild(cell);
			}
		}

		table.appendChild(tbody);

		const cardBody2 = document.createElement('div');
		cardBody2.classList.add('card-footer');
		cardBody2.appendChild(table);

		// Add the card body to the card
		card.appendChild(cardBody);
		card.appendChild(cardBody2);

		// Add the card to the container
		medicationContainer.appendChild(card);
	}

	// let prescriptionProps = ['medication', 'dosage', 'notes', 'start_date', 'end_date'];

	// for (let prescription of patient.prescriptions) {
	// 	let row = document.createElement('tr');

	// 	for (let prop of prescriptionProps) {
	// 		let cell = document.createElement('td');
	// 		cell.textContent = prescription[prop];
	// 		row.appendChild(cell);
	// 	}

	// 	let schedule = prescription.schedule;
	// 	for (let j = 0; j < schedule.length; j++) {
	// 		let cell = document.createElement('td');
	// 		cell.textContent = schedule[j] ? '✓' : ' ';
	// 		row.appendChild(cell);
	// 	}
	// 	medicationTable.appendChild(row);
	// }
})();
