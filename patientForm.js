const log = console.log;

let daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

let exercises = document.getElementById('exercises');
let exerciseCount = 0;

let addExerciseBtn = document.getElementById('add-exercise-btn');
addExerciseBtn.addEventListener('click', addExercise);

let removeExerciseBtn = document.getElementById('remove-exercise-btn');
removeExerciseBtn.addEventListener('click', removeExercise);

let form = document.getElementById('patientForm');
form.addEventListener('submit', submit);

let idToken = localStorage.getItem('idToken');

let params = location.search;
if (!params) params = '?' + location.hash.slice(1);
const urlParams = new URLSearchParams(params);

document.getElementById('name').value = urlParams.get('name');
document.getElementById('email').value = urlParams.get('email');
const patientID = urlParams.get('id');

let isNewPatient = false;

if (patientID) {
	fillForm();
} else {
	isNewPatient = true;
}

async function fillForm() {
	// get patient data to fill in form with any pre-exisitng data
	// so the doctor can edit it

	let url = 'https://cikq6fmf4e.execute-api.us-east-2.amazonaws.com/main/patient';
	let data = await fetch(url, {
		method: 'POST',
		headers: {
			Authorization: idToken,
			'Content-Type': 'application/json'
		},
		body: `{"id":"${patientID}", "action":"getPatientData"}`
	});
	let patientData = await data.json();

	log(patientData);

	let exercises = patientData.exercises;
	for (let i = 0; i < exercises.length; i++) {
		if (i != 0) addExercise();
		let ex = exercises[i];
		document.getElementById(`ex${i}-description`).value = ex.description;
		for (let j = 0; j < 7; j++) {
			document.getElementById(`ex${i}-${j}-hour`).value = ex.schedule[j].hour;
		}
	}
	let prescriptions = patientData.prescriptions;
	for (let i = 0; i < prescriptions.length; i++) {
		if (i != 0) addPrescription();
		let pre = prescriptions[i];
		document.getElementById(`pre${i}-medication`).value = pre.medication;
		document.getElementById(`pre${i}-dosage`).value = pre.dosage;
		document.getElementById(`pre${i}-notes`).value = pre.notes;
		document.getElementById(`pre${i}-startDate`).value = pre.start_date;
		document.getElementById(`pre${i}-endDate`).value = pre.end_date;
		for (let j = 0; j < 7; j++) {
			let medUnits = pre.schedule[j];
			for (let k = 0; k < medUnits.length; k++) {
				if (k != 0) addUnit(i, j, k);
				let medUnit = medUnits[k];
				document.getElementById(`pre${i}-${j}-${k}-hour`).value = medUnit.hour;
				document.getElementById(`pre${i}-${j}-${k}-pills`).value = medUnit.amount;
			}
		}
	}
}

async function submit(event) {
	event.preventDefault();

	let data = {
		account: 'patient'
	};

	if (isNewPatient) data.isNewPatient = true;
	else data.id = patientID;

	data.name = document.getElementById('name').value;
	data.email = document.getElementById('email').value;

	data.exercises = [];
	for (let i = 0; i < exerciseCount; i++) {
		let ex = {};
		ex.description = document.getElementById(`ex${i}-description`).value;
		ex.schedule = [];
		for (let j = 0; j < 7; j++) {
			let exUnit = {};
			exUnit.hour = Number(document.getElementById(`ex${i}-${j}-hour`).value);
			ex.schedule.push(exUnit);
		}
		data.exercises.push(ex);
	}

	data.prescriptions = [];
	for (let i = 0; i < preCount; i++) {
		let pre = {};
		pre.medication = document.getElementById(`pre${i}-medication`).value;
		pre.dosage = document.getElementById(`pre${i}-dosage`).value;
		pre.notes = document.getElementById(`pre${i}-notes`).value;
		pre.start_date = document.getElementById(`pre${i}-startDate`).value;
		pre.end_date = document.getElementById(`pre${i}-endDate`).value;
		pre.schedule = [];
		for (let j = 0; j < 7; j++) {
			let medUnitsArray = [];
			let medUnits = document.getElementById(`pre${i}-${j}-med-units`);
			for (let k = 0; k < medUnits.children.length; k++) {
				let medUnit = {};
				medUnit.hour = Number(document.getElementById(`pre${i}-${j}-${k}-hour`).value);
				medUnit.amount = Number(document.getElementById(`pre${i}-${j}-${k}-pills`).value);
				if (medUnit.amount) medUnitsArray.push(medUnit);
			}
			pre.schedule.push(medUnitsArray);
		}
		data.prescriptions.push(pre);
	}
	console.log(data);

	let url = 'https://cikq6fmf4e.execute-api.us-east-2.amazonaws.com/main/patient';
	let data1 = await fetch(url, {
		method: 'POST',
		headers: {
			Authorization: idToken,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});
	let msg = await data1.text();
	log(msg);
	alert(msg);
}

function removeExercise() {
	if (exerciseCount > 0) {
		exerciseCount--;
		let div = document.getElementById(`ex${exerciseCount}`);
		div.remove();
	}
}

function addExercise() {
	exercises.insertAdjacentHTML(
		'beforeend',
		`
<div id="ex${exerciseCount}" class="exercise mt-4">
	<h5>Exercise ${exerciseCount}</h5>
	<div class="form-row">
		<div class="col">
			<input id="ex${exerciseCount}-description" type="text" class="form-control" placeholder="Description" name="description" required/>
		</div>
	</div>
	
	<h6 class=mt-3>Schedule (hours)</h6>		
	<div id="ex${exerciseCount}-schedule" class="form-row">

	</div>
</div>
`
	);

	let schedule = document.getElementById(`ex${exerciseCount}-schedule`);
	for (let i = 0; i < 7; i++) {
		let day = daysOfWeek[i];
		schedule.innerHTML += `
<div class="col">
	<label>${day}</label>
	<input type="number" class="form-control mb-2" id="ex${exerciseCount}-${i}-hour" value="0" min="0" max="24" />
</div>`;
	}

	exerciseCount++;
}

addExercise();

let prescriptions = document.getElementById('prescriptions');
let preCount = 0;

let addPrescriptionBtn = document.getElementById('add-prescription-btn');
addPrescriptionBtn.addEventListener('click', addPrescription);

let removePrescriptionBtn = document.getElementById('remove-prescription-btn');
removePrescriptionBtn.addEventListener('click', removePrescription);

function removePrescription() {
	if (preCount > 0) {
		preCount--;
		let div = document.getElementById(`pre${preCount}`);
		div.remove();
	}
}

function addPrescription() {
	let curPre = preCount;
	prescriptions.insertAdjacentHTML(
		'beforeend',

		`
<div id="pre${preCount}" class="prescription mt-4">
	<h5>Prescription ${preCount}</h5>

	<div class="form-row">

		<div class="col">
			<input
				id="pre${preCount}-medication"
				type="text"
				class="form-control"
				placeholder="Medication"
				required
			/>
		</div>
		<div class="col">
			<input
				id="pre${preCount}-dosage" 
				type="text" 
				class="form-control" 
				placeholder="Dosage" 
				required
			/>
		</div>
	</div>
	<div class="form-row my-3">
		<div class="col">
			<input 
				id="pre${preCount}-notes" 
				type="text" 
				class="form-control" 
				placeholder="Notes" 
			/>
		</div>
	</div>

	<div class="form-row">
		<label>Enter the hour(s) the patient should take the medication in 24 hour time (1-23)</label>
	</div>

	<div id="pre${preCount}-schedule" class="form-row mb-2"></div>

	<div class="form-row mb-2">
		<div class="col">
			<label for="name">Start Date</label>
			<input
				type="date"
				class="form-control"
				id="pre${preCount}-startDate"
				placeholder="Start Date"
				name="Start Date"
				required
			/>
		</div>
	</div>
	<div class="form-row mb-2">
		<div class="col">
			<label for="name">End Date</label>
			<input
				type="date"
				class="form-control"
				id="pre${preCount}-endDate"
				placeholder="End Date"
				name="End Date"
				required
			/>
		</div>
	</div>
</div>
	`
	);

	let schedule = document.getElementById(`pre${preCount}-schedule`);

	schedule.innerHTML += `
<div id="pre${preCount}-firstCol" class="col pre-sched-labels"></div>`;

	schedule.max = -1;
	schedule.firstCol = document.getElementById(`pre${preCount}-firstCol`);

	for (let i = 0; i < 7; i++) {
		let unitNum = 0;
		let day = daysOfWeek[i];
		schedule.insertAdjacentHTML(
			'beforeend',
			`
<div class="col">
	<label>${day}</label>
	<div id="pre${preCount}-${i}-med-units"></div>
	<div class="input-group-append mt-2">
		<button id="pre${preCount}-${i}-pill-add-btn" class="btn btn-primary btn-block" type="button">+</button>
	</div>
</div>`
		);

		let medUnits = document.getElementById(`pre${preCount}-${i}-med-units`);

		let addUnitBtn = document.getElementById(`pre${preCount}-${i}-pill-add-btn`);
		addUnitBtn.addEventListener('click', () => addUnit(curPre, i, unitNum));

		addUnit(curPre, i, unitNum);
	}

	preCount++;
}
function addUnit(preNum, day, unitNum) {
	let schedule = document.getElementById(`pre${preNum}-schedule`);

	let medUnits = document.getElementById(`pre${preNum}-${day}-med-units`);

	if (medUnits.children.length > schedule.max) {
		schedule.max = medUnits.children.length;
		console.log('new max: ' + schedule.max);
		schedule.firstCol.insertAdjacentHTML(
			'beforeend',
			`
					<div class="Hr">
						<p>Hour</p>
						<p># of pills</p>
					</div>`
		);
	}

	medUnits.insertAdjacentHTML(
		'beforeend',
		`
		<div class="med-unit mb-2">
			<input class="form-control mb-2" id="pre${preNum}-${day}-${unitNum}-hour" value="0" min="0" max="24" />
			<input class="form-control" id="pre${preNum}-${day}-${unitNum}-pills" value="0" min="0" />
		</div>`
	);
	unitNum++;
}
addPrescription();
