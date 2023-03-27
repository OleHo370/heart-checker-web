// Parse the URL to extract the id_token parameter
(async () => {
	const log = console.log;

	// let user;
	// let idToken = localStorage.getItem('idToken');

	// if (idToken && idToken != 'null') user = jwt_decode(idToken);
	// else idToken = null;

	// if (!idToken || user.exp < Date.now() / 1000) {
	// 	// get the AWS Cognito id_token from the URL
	// 	let params = location.search;
	// 	if (!params) params = '?' + location.hash.slice(1);
	// 	const urlParams = new URLSearchParams(params);
	// 	idToken = urlParams.get('id_token');
	// 	if (!idToken) return;
	// 	localStorage.setItem('idToken', idToken);
	// 	user = jwt_decode(idToken);

	// 	// hide the token from the URL
	// 	window.history.pushState(null, '', location.href.split(/[?#]/)[0]);
	// }

	// // DELETE LATER
	// window.idToken = idToken; // for debugging

	// log(user);

	// document.getElementById('unauth').style.display = 'none';
	document.getElementById('auth').style.display = 'block';

	// document.getElementById('username').innerHTML = user.email;

	// let url = 'https://cikq6fmf4e.execute-api.us-east-2.amazonaws.com/main/patient';
	// let data = await fetch(url);
	// let patient = await data.json();

	let patient = {
		id: 'b302bd2f-8fd2-4439-b1d8-859b536a7629',
		name: 'Joe',
		excercises: [
			{
				description: 'Run',
				schedule: [1, 1, 1, 1, 1, 1, 1]
			},
			{
				description: 'Swim',
				schedule: [0, 0, 0, 0, 0, 0, 1]
			}
		],
		prescriptions: [
			{
				medication: 'Atorvastatin',
				dosage: '40mg',
				schedule: [0, 0, 2, 0, 2, 0, 0],
				notes: 'Statins to lower cholesterol levels',
				start_date: '2022-01-01',
				end_date: '2022-06-30'
			},
			{
				medication: 'Metoprolol',
				dosage: '50mg',
				schedule: [0, 0, 2, 0, 2, 0, 0],
				notes: 'Beta blocker to control heart rate and blood pressure',
				start_date: '2022-01-01',
				end_date: '2022-06-30'
			}
		]
	};

	log(patient);

	let daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	// Display patient's name and email
	const nameEl = document.getElementById('name');
	const emailEl = document.getElementById('email');
	nameEl.innerText = patient.name;
	// emailEl.innerText = user.email;

	// Display patient's exercises in table
	const exerciseTable = document.getElementById('exercise-table');
	const medicationTable = document.getElementById('medication-table');

	for (let excercise of patient.excercises) {
		let row = document.createElement('tr');

		let name = document.createElement('td');
		name.textContent = excercise.description;
		row.appendChild(name);

		let schedule = excercise.schedule;
		for (let j = 0; j < schedule.length; j++) {
			let cell = document.createElement('td');
			cell.textContent = schedule[j] ? '✓' : ' ';
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
		const medicationName = document.createElement('h5');
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
		let row = document.createElement('tr');

		// Loop through the medication schedule and add the days it's taken to the card
		let schedule = pre.schedule;
		for (let j = 0; j < schedule.length; j++) {
			let cell = document.createElement('td');
			cell.textContent = schedule[j] ? '✓' : ' ';
			row.appendChild(cell);
		}

		tbody.appendChild(row);
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
