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
	// document.getElementById('auth').style.display = 'block';

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

	// Assuming you have the patient's routine data stored in a variable named "patient"

	// Get a reference to the HTML table element
	var table = document.createElement('table');

	// Create a table header row
	var headerRow = document.createElement('tr');

	// Add ID and Name columns to the header row
	var idHeader = document.createElement('th');
	idHeader.innerHTML = 'ID';
	headerRow.appendChild(idHeader);

	var nameHeader = document.createElement('th');
	nameHeader.innerHTML = 'Name';
	headerRow.appendChild(nameHeader);

	// Add Exercises and Prescriptions columns to the header row
	var exercisesHeader = document.createElement('th');
	exercisesHeader.innerHTML = 'Exercises';
	headerRow.appendChild(exercisesHeader);

	var prescriptionsHeader = document.createElement('th');
	prescriptionsHeader.innerHTML = 'Prescriptions';
	headerRow.appendChild(prescriptionsHeader);

	// Add the header row to the table
	table.appendChild(headerRow);

	// Create a row for the patient data
	var patientRow = document.createElement('tr');

	// Add ID and Name cells to the patient row
	var idCell = document.createElement('td');
	idCell.innerHTML = patient.id;
	patientRow.appendChild(idCell);

	var nameCell = document.createElement('td');
	nameCell.innerHTML = patient.name;
	patientRow.appendChild(nameCell);

	// Create a cell for the exercises
	var exercisesCell = document.createElement('td');
	var exercisesList = document.createElement('ul');

	// Loop through each exercise and add it to the list
	for (var i = 0; i < patient.excercises.length; i++) {
		var exerciseItem = document.createElement('li');
		exerciseItem.innerHTML = patient.excercises[i].description + ': ' + patient.excercises[i].schedule.join(' ');
		exercisesList.appendChild(exerciseItem);
	}

	exercisesCell.appendChild(exercisesList);
	patientRow.appendChild(exercisesCell);

	// Create a cell for the prescriptions
	var prescriptionsCell = document.createElement('td');
	var prescriptionsList = document.createElement('ul');

	// Loop through each prescription and add it to the list
	for (var j = 0; j < patient.prescriptions.length; j++) {
		var prescriptionItem = document.createElement('li');
		prescriptionItem.innerHTML =
			patient.prescriptions[j].medication +
			' ' +
			patient.prescriptions[j].dosage +
			': ' +
			patient.prescriptions[j].schedule.join(' ') +
			' (Start Date: ' +
			patient.prescriptions[j].start_date +
			', End Date: ' +
			patient.prescriptions[j].end_date +
			')<br>' +
			'Notes: ' +
			patient.prescriptions[j].notes;
		prescriptionsList.appendChild(prescriptionItem);
	}

	prescriptionsCell.appendChild(prescriptionsList);
	patientRow.appendChild(prescriptionsCell);

	// Add the patient row to the table
	table.appendChild(patientRow);

	// Add the table to the HTML document
	document.body.appendChild(table);
})();
