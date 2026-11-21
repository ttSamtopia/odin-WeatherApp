import { loadWeather } from "./api.js";

export function initForm() {
	const form = document.getElementById("location-form");
	const input = document.getElementById("location");

	form.addEventListener("submit", (event) => {
		event.preventDefault();

		if (input.value.trim() === "") {
			input.setCustomValidity("Not a valid place name");
			input.reportValidity();
			return;
		}

		loadWeather(input.value.trim()).catch((error) => {
			console.log(error.message);
		});
	});

	input.addEventListener("input", () => {
		input.setCustomValidity("");
	})
}
