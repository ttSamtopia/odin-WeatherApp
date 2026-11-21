const BASE_URL =
	"https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";

function buildUrl(location, unit) {
	return `${BASE_URL}/${location}?unitGroup=${unit}`;
}

export async function getWeather(location, unit) {
	const url = buildUrl(location, unit);

	try {
		const response = await fetch(url);
		if (String(response.status)[0] !== "2") {
			throw new Error(response.status);
		}
		const object = await response.json();
		return object;
	} catch (error) {
		console.log(`An error occurred: ${error.message}`);
		throw error;
	}
}

export function processWeather(data) {
	if (
		!data ||
		!data.currentConditions ||
		!data.days ||
		data.days.length < 2
	) {
		throw new Error("Invalid weather data");
	}
	const current = data.currentConditions;
	const today = data.days[0];
	const tomorrow = data.days[1];

	return {
		resolvedAddress: data.resolvedAddress,
		now: {
			temp: current.temp,
			feelslike: current.feelslike,
			conditions: current.conditions,
			icon: current.icon,
			windspeed: current.windspeed,
			winddir: current.winddir,
		},
		today: {
			tempmax: today.tempmax,
			tempmin: today.tempmin,
			feelslikemax: today.feelslikemax,
			feelslikemin: today.feelslikemin,
			conditions: today.conditions,
			icon: today.icon,
			precipprob: today.precipprob,
		},
		tomorrow: {
			tempmax: tomorrow.tempmax,
			tempmin: tomorrow.tempmin,
			feelslikemax: tomorrow.feelslikemax,
			feelslikemin: tomorrow.feelslikemin,
			conditions: tomorrow.conditions,
			icon: tomorrow.icon,
			precipprob: tomorrow.precipprob,
		},
	};
}

export async function loadWeather(location, unit) {
	if (!location) {
		throw new Error("Not a valid location");
	}

	try {
		let weatherData = await getWeather(location, unit);
		weatherData = processWeather(weatherData);
		return weatherData;
	} catch (error) {
		throw new Error(`Caller caught: ${error.message}`, {
			cause: error,
		});
	}
}
