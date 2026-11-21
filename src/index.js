import { getWeather, processWeather } from "./api.js";

console.log("Weather App loaded");

async function loadWeather(location) {
	if (!location) {
		throw new Error("Not a valid location");
	}

	try {
		let weatherData = await getWeather(location);
		weatherData = processWeather(weatherData);
		console.log(weatherData);
	} catch (error) {
		throw new Error(`Caller caught: ${error.message}`, {
			cause: error,
		});
	}
}

loadWeather("Malmo").catch((error) => {
	console.log(error.message);
});
