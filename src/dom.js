import { loadWeather } from "./api.js";

async function setIcon(imgId, iconName) {
	const img = document.getElementById(imgId);
	const icon = await import(`./icons/${iconName}.svg`);
	img.src = icon.default;
}

function renderWeather(data, unit) {
	setIcon("now-icon", data.now.icon);
	setIcon("today-icon", data.today.icon);
	setIcon("tomorrow-icon", data.tomorrow.icon);
	const deg = unit === "us" ? "°F" : "°C";
	const speed = unit === "us" ? "mph" : "km/h";
	document.getElementById("address").textContent = data.resolvedAddress;
	document.getElementById("now").textContent =
		`Now: ${data.now.temp}${deg} (feels like ${data.now.feelslike}${deg}), ${data.now.conditions}, wind ${data.now.windspeed} ${speed}`;
	document.getElementById("today").textContent =
		`Today: ${data.today.tempmin}${deg} to ${data.today.tempmax}${deg}, ${data.today.conditions}, ${data.today.precipprob}% chance of rain`;
	document.getElementById("tomorrow").textContent =
		`Tomorrow: ${data.tomorrow.tempmin}${deg} to ${data.tomorrow.tempmax}${deg}, ${data.tomorrow.conditions}, ${data.tomorrow.precipprob}% chance of rain`;
}

export function initForm() {
	const form = document.getElementById("location-form");
	const input = document.getElementById("location");
	const domError = document.getElementById("error");
	const unitButton = document.getElementById("unit-toggle");
	let unit = "us";
	let lastLocation = "";

	async function showWeather(location) {
		domError.textContent = "";
		try {
			const data = await loadWeather(location, unit);
			renderWeather(data, unit);
			lastLocation = location;
		} catch (error) {
			console.log(error.message);
			domError.textContent = "There was an error, please try again.";
		}
	}

	unitButton.addEventListener("click", () => {
		unit = unit === "us" ? "metric" : "us";
		unitButton.textContent = unit === "us" ? "Show °C" : "Show °F";
		if (lastLocation !== "") {
			showWeather(lastLocation);
		}
	});

	form.addEventListener("submit", async (event) => {
		event.preventDefault();
		domError.textContent = "";

		if (input.value.trim() === "") {
			input.setCustomValidity("Not a valid place name");
			input.reportValidity();
			return;
		}

		await showWeather(input.value.trim());
	});

	input.addEventListener("input", () => {
		input.setCustomValidity("");
	});
}
