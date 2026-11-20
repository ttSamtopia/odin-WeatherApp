const BASE_URL =
	"https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";

function buildUrl(location) {
	return `${BASE_URL}/${location}`;
}

export async function getWeather(location) {
	const url = buildUrl(location);

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
