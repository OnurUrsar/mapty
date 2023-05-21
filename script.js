"use strict";

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

// Lecture: Using the Geolocation API

/*
if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(
		function (position) {
			const { latitude } = position.coords;
			const { longitude } = position.coords;
			console.log(
				`https://www.google.com/maps/@${latitude},${longitude}`
			);
		},
		function () {
			alert("Could not get your position");
		}
	);
}
*/

// Lecture: Displaying a Map Using Leaflet Library

/*
if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(
		function (position) {
			const { latitude } = position.coords;
			const { longitude } = position.coords;
			console.log(
				`https://www.google.com/maps/@${latitude},${longitude}`
			);

			const coords = [latitude, longitude];

			const map = L.map("map").setView(coords, 13);

			L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			}).addTo(map);

			L.marker(coords)
				.addTo(map)
				.bindPopup("A pretty CSS3 popup.<br> Easily customizable.")
				.openPopup();
		},
		function () {
			alert("Could not get your position");
		}
	);
}
*/

// Lecture: Displaying a Map Marker

/*
/////////////////////////////////////////////////
// APPLICATION ARCHITECTURE
class App {
	// Private class fields
	#map;
	#mapEvent;

	constructor() {
		this._getPosition();
		form.addEventListener("submit", this._newWorkout.bind(this));
		inputType.addEventListener("change", this._toggleElevetionField);
	}

	_getPosition() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				this._loadMap.bind(this),
				function () {
					alert("Could not get your position");
				}
			);
		}
	}

	_loadMap(position) {
		const { latitude } = position.coords;
		const { longitude } = position.coords;
		console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

		const coords = [latitude, longitude];

		this.#map = L.map("map").setView(coords, 13);
		L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		}).addTo(this.#map);

		// Handling clicks on map
		this.#map.on("click", this._showForm.bind(this));
	}

	_showForm(mapE) {
		this.#mapEvent = mapE;
		form.classList.remove("hidden");
		inputDistance.focus();
	}

	_toggleElevetionField() {
		inputElevation
			.closest(".form__row")
			.classList.toggle("form__row--hidden");
		inputCadence
			.closest(".form__row")
			.classList.toggle("form__row--hidden");
	}

	_newWorkout(e) {
		e.preventDefault();

		// Clear input fields
		inputDistance.value =
			inputDuration.value =
			inputCadence.value =
			inputElevation.value =
				"";

		// Display marker
		const { lat, lng } = this.#mapEvent.latlng;
		L.marker([lat, lng])
			.addTo(this.#map)
			.bindPopup(
				L.popup({
					maxWidth: 250,
					minWidth: 100,
					autoClose: false,
					closeOnClick: false,
					className: "running-popup",
				})
			)
			.setPopupContent("Workout")
			.openPopup();
	}
}

const app = new App();
*/

// Lecture: Managing Workout Data: Creating Classes

// Workout class
class Workout {
	date = new Date();
	id = (Date.now() + "").slice(-10);
	clicks = 0;

	constructor(coords, distance, duration) {
		// this.date = ...
		// this.id = ...
		this.coords = coords; // [lat, lng]
		this.distance = distance; // km
		this.duration = duration; // min
	}

	_setDescription() {
		const months = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		];

		this.description = `${this.type[0].toUpperCase()}${this.type.slice(
			1
		)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`;
	}

	click() {
		this.clicks++;
	}
}

// Running class
class Running extends Workout {
	type = "running";

	constructor(coords, distance, duration, cadence) {
		super(coords, distance, duration);
		this.cadence = cadence;
		this.calcPace();
		this._setDescription();
	}

	calcPace() {
		// min/km
		this.pace = this.duration / this.distance;
		return this.pace;
	}
}

// Cycling class
class Cycling extends Workout {
	type = "cycling";

	constructor(coords, distance, duration, elevationGain) {
		super(coords, distance, duration);
		this.elevationGain = elevationGain;
		this.calcSpeed();
		this._setDescription();
	}

	calcSpeed() {
		// km/h
		this.speed = this.distance / (this.duration / 60);
		return this.speed;
	}
}

// const run1 = new Running([35, 22], 5.2, 24, 155);
// const cycling1 = new Cycling([35, 21], 27, 78, 564);
// console.log(run1, cycling1);

// Lecture: Creating a New Workout
// Lecture: Rendering Workouts // I forgat to make changes seperately
// Lecture: Move to Marker On Click // Mayba I should continue from here because there is a long code and may be it is unecessary to copy every time.
// Lecture: Working with localStorage
/////////////////////////////////////////////////
// APPLICATION ARCHITECTURE
class App {
	// Private class fields
	#map;
	#mapEvent;
	#workouts = [];
	#mapZoomLevel = 13;

	constructor() {
		// Get user's position
		this._getPosition();

		// Get data from local storage
		this._getLocalStorage();

		// Add event handlers
		form.addEventListener("submit", this._newWorkout.bind(this));
		inputType.addEventListener("change", this._toggleElevetionField);
		containerWorkouts.addEventListener(
			"click",
			this._moveToPopup.bind(this)
		);
	}

	_getPosition() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				this._loadMap.bind(this),
				function () {
					alert("Could not get your position");
				}
			);
		}
	}

	_loadMap(position) {
		const { latitude } = position.coords;
		const { longitude } = position.coords;
		console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

		const coords = [latitude, longitude];

		this.#map = L.map("map").setView(coords, this.#mapZoomLevel);
		L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		}).addTo(this.#map);

		// Handling clicks on map
		this.#map.on("click", this._showForm.bind(this));

		this.#workouts.forEach((work) => {
			this._renderWorkoutMarker(work);
		});
	}

	_showForm(mapE) {
		this.#mapEvent = mapE;
		form.classList.remove("hidden");
		inputDistance.focus();
	}

	_hideForm() {
		// Empty input
		inputDistance.value =
			inputDuration.value =
			inputCadence.value =
			inputElevation.value =
				"";

		form.style.display = "none";
		form.classList.add("hidden");
		setTimeout(() => (form.style.display = "grid"), 1000);
	}

	_toggleElevetionField() {
		inputElevation
			.closest(".form__row")
			.classList.toggle("form__row--hidden");
		inputCadence
			.closest(".form__row")
			.classList.toggle("form__row--hidden");
	}

	_newWorkout(e) {
		const validInputs = (...inputs) =>
			inputs.every((inp) => Number.isFinite(inp));
		const allPositive = (...inputs) => inputs.every((inp) => inp > 0);

		e.preventDefault();

		// Get data from form
		const type = inputType.value;
		const distance = +inputDistance.value;
		const duration = +inputDuration.value;
		const { lat, lng } = this.#mapEvent.latlng;
		let workout;

		// If workout running create running object
		if (type === "running") {
			const cadence = +inputCadence.value;
			// Check if data is valid
			if (
				// !Number.isFinite(distance) ||
				// !Number.isFinite(duration) ||
				// !Number.isFinite(cadence)
				!validInputs(distance, duration, cadence) ||
				!allPositive(distance, duration, cadence)
			)
				return alert("Inputs have to be positive numbers!");

			workout = new Running([lat, lng], distance, duration, cadence);
		}

		// If workout cycling create cycling object
		if (type === "cycling") {
			const elevation = +inputElevation.value;
			if (
				!validInputs(distance, duration, elevation) ||
				!allPositive(distance, duration)
			)
				return alert("Inputs have to be positive numbers!");

			workout = new Cycling([lat, lng], distance, duration, elevation);
		}

		// Add new object to workout array
		this.#workouts.push(workout);

		// Render workout on map as a marker
		this._renderWorkoutMarker(workout);

		// Render workout on list
		this._renderWorkout(workout);

		// Hide form + clear input fields
		this._hideForm();

		// Set local storage to all workouts
		this._setLocalStorage();
	}

	_renderWorkoutMarker(workout) {
		L.marker(workout.coords)
			.addTo(this.#map)
			.bindPopup(
				L.popup({
					maxWidth: 250,
					minWidth: 100,
					autoClose: false,
					closeOnClick: false,
					className: `${workout.type}-popup`,
				})
			)
			.setPopupContent(
				`${workout.type === "running" ? "🏃‍♂️" : "🚴"} ${
					workout.description
				}`
			)
			.openPopup();
	}

	_renderWorkout(workout) {
		let html = `
			<li class="workout workout--${workout.type}" data-id="${workout.id}">
				<h2 class="workout__title">${workout.description}</h2>
				<div class="workout__details">
					<span class="workout__icon">${workout.type === "running" ? "🏃‍♂️" : "🚴"}</span>
					<span class="workout__value">${workout.distance}</span>
					<span class="workout__unit">km</span>
				</div>
				<div class="workout__details">
					<span class="workout__icon">⏱</span>
					<span class="workout__value">${workout.duration}</span>
					<span class="workout__unit">min</span>
				</div>
		`;

		if (workout.type === "running") {
			html += `
				<div class="workout__details">
					<span class="workout__icon">⚡️</span>
					<span class="workout__value">${workout.pace.toFixed(1)}</span>
					<span class="workout__unit">min/km</span>
				</div>
				<div class="workout__details">
					<span class="workout__icon">🦶🏼</span>
					<span class="workout__value">${workout.cadence}</span>
					<span class="workout__unit">spm</span>
				</div>
			</li>`;
		}

		if (workout.type === "cycling") {
			html += `
				<div class="workout__details">
					<span class="workout__icon">⚡️</span>
					<span class="workout__value">${workout.speed.toFixed(1)}</span>
					<span class="workout__unit">km/h</span>
				</div>
				<div class="workout__details">
					<span class="workout__icon">⛰</span>
					<span class="workout__value">${workout.elevationGain}</span>
					<span class="workout__unit">m</span>
				</div>
			</li>`;
		}

		form.insertAdjacentHTML("afterend", html);
	}

	_moveToPopup(e) {
		const workoutEl = e.target.closest(".workout");

		if (!workoutEl) return;

		// Find the id of the clicked element in the workouts array
		const workout = this.#workouts.find(
			(work) => work.id === workoutEl.dataset.id
		);

		// Set the view to the clicked workout
		this.#map.setView(workout.coords, this.#mapZoomLevel, {
			animate: true,
			pan: {
				duration: 1,
			},
		});

		// Using the public interface
		// workout.click();
	}

	// Local storage
	_setLocalStorage() {
		localStorage.setItem("workouts", JSON.stringify(this.#workouts));
	}

	_getLocalStorage() {
		const data = JSON.parse(localStorage.getItem("workouts"));

		if (!data) return;

		this.#workouts = data;

		this.#workouts.forEach((work) => {
			this._renderWorkout(work);
		});
	}

	// Reset
	reset() {
		localStorage.removeItem("workouts");
		location.reload();
	}
}

const app = new App();
