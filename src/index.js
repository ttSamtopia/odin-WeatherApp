import { getWeather } from "./api.js";

console.log("Weather App loaded");

getWeather("Malmo")
	.then((data) => console.log(data))
	.catch((error) => console.log("caller caught:", error.message));
