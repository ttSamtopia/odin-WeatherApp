import { loadWeather } from "./api.js";

async function setIcon(imgId, iconName) {
	const img = document.getElementById(imgId);
	const icon = await import(`./icons/${iconName}.svg`);
	img.src = icon.default;
}

function setText(id, text) {
	document.getElementById(id).textContent = text;
}

function getLookClass(icon) {
	if (icon.endsWith("-night")) {
		return "night";
	}
	if (icon.includes("snow")) {
		return "snowy";
	}
	if (icon.includes("rain") || icon.includes("showers")) {
		return "rainy";
	}
	if (icon === "cloudy" || icon === "fog" || icon === "wind") {
		return "cloudy";
	}
	return "sunny";
}

function renderWeather(data, unit) {
	document.querySelector("body").className = getLookClass(data.now.icon);
	document.getElementById("result").classList.add("shown");
	const deg = unit === "us" ? "°F" : "°C";
	const speed = unit === "us" ? "mph" : "km/h";
	setIcon("now-icon", data.now.icon);
	setText("address", data.resolvedAddress);
	setText("now-temp", `${data.now.temp}${deg}`);
	setText("now-conditions", data.now.conditions);
	setText(
		"now-details",
		`Feels like ${data.now.feelslike}${deg}, wind ${data.now.windspeed} ${speed}`,
	);
	for (const name of ["today", "tomorrow"]) {
		const day = data[name];
		setIcon(`${name}-icon`, day.icon);
		setText(
			`${name}-range`,
			`${day.tempmin}${deg} to ${day.tempmax}${deg}`,
		);
		setText(`${name}-conditions`, day.conditions);
		setText(`${name}-rain`, `${day.precipprob}% chance of rain`);
	}
}

export function initForm() {
	const form = document.getElementById("location-form");
	const input = document.getElementById("location");
	const domError = document.getElementById("error");
	const unitButton = document.getElementById("unit-toggle");
	const loading = document.getElementById("loading");
	const searchButton = document.getElementById("search-button");
	let unit = "us";
	let lastLocation = "";

	async function showWeather(location) {
		domError.textContent = "";
		loading.classList.add("shown");
		searchButton.setAttribute("disabled", "");
		unitButton.setAttribute("disabled", "");
		try {
			const data = await loadWeather(location, unit);
			renderWeather(data, unit);
			lastLocation = location;
		} catch (error) {
			console.log(error.message);
			domError.textContent = "There was an error, please try again.";
		} finally {
			loading.classList.remove("shown");
			searchButton.removeAttribute("disabled");
			unitButton.removeAttribute("disabled");
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
