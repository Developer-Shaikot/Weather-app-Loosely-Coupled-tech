const apiKey = "ee8f3171ae1144c690564022242309";
const defaultCity = "Dhaka";
const fetchWeatherButton = document.getElementById("fetchWeather");
const locationInput = document.getElementById("locationInput");
const weatherDetails = document.getElementById("weatherDetails");
const infoPanel = document.getElementById("infoPanel");
const todayWeather = document.getElementById("todayWeather");
const tomorrowWeather = document.getElementById("tomorrowWeather");
const forecastTableBody = document.querySelector("#forecastTable tbody");

window.onload = () => {
    getWeatherData(defaultCity);
};

fetchWeatherButton.addEventListener("click", () => {
    const location = locationInput.value;
    if (location) {
        getWeatherData(location);
    } else {
        alert("Please enter a valid city.");
    }
});

async function getWeatherData(location) {
    try {
        const response = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=10`
        );

        if (!response.ok)
            throw new Error("Unable to fetch data. Please check the location and try again.");

        const data = await response.json();

        displayWeather(data);
    } catch (error) {
        weatherDetails.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

function displayWeather(data) {
    const { location, current, forecast } = data;

    let conditionIcon = `https:${current.condition.icon}`;

    weatherDetails.innerHTML = `
        <h2>Weather in ${location.name}, ${location.country}</h2>
        <img src="${conditionIcon}" alt="${current.condition.text}" />
        <p>Condition: ${current.condition.text}</p>
        <p>Temperature: ${current.temp_c}°C</p>
        <p>Wind: ${current.wind_kph} kph</p>
        <p>Humidity: ${current.humidity}%</p>
        <p>Feels Like: ${current.feelslike_c}°C</p>
    `;

    infoPanel.innerHTML = `
        <p>Country: ${location.country}</p>
        <p>Region: ${location.region}</p>
        <p>Latitude/Longitude: ${location.lat}, ${location.lon}</p>
        <p>Local Time: ${location.localtime}</p>
        <p>Sunrise: ${forecast.forecastday[0].astro.sunrise}</p>
        <p>Sunset: ${forecast.forecastday[0].astro.sunset}</p>
    `;

    todayWeather.innerHTML = generateWeatherCard(forecast.forecastday[0], "Today");
    tomorrowWeather.innerHTML = generateWeatherCard(forecast.forecastday[1], "Tomorrow");

    forecastTableBody.innerHTML = forecast.forecastday
        .map(
            (day) => `
        <tr>
            <td>${day.date}</td>
            <td>${day.day.maxtemp_c}°C</td>
            <td>${day.day.mintemp_c}°C</td>
            <td>${day.day.maxwind_kph} kph</td>
            <td>${day.day.totalprecip_mm} mm</td>
            <td>${day.day.avghumidity}%</td>
            <td>${day.astro.sunrise}</td>
            <td>${day.astro.sunset}</td>
        </tr>
    `
        )
        .join("");
}

document.querySelectorAll("th.sortable").forEach((header) => {
    header.addEventListener("click", () => {
        const table = header.parentElement.parentElement.parentElement;
        const index = Array.from(header.parentElement.children).indexOf(header);
        const rows = Array.from(table.querySelectorAll("tbody tr"));

        const sortedRows = rows.sort((a, b) => {
            const aText = a.querySelector(`td:nth-child(${index + 1})`).innerText;
            const bText = b.querySelector(`td:nth-child(${index + 1})`).innerText;
            return aText.localeCompare(bText);
        });

        rows.forEach((row) => row.parentElement.removeChild(row));
        sortedRows.forEach((row) => table.querySelector("tbody").appendChild(row));
    });
});

function generateWeatherCard(day, title) {
    return `
        <h3>${title}'s Weather</h3>
        <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}">
        <p>${day.day.condition.text}</p>
        <p>Max Temp: ${day.day.maxtemp_c}°C</p>
        <p>Min Temp: ${day.day.mintemp_c}°C</p>
        <p>Wind: ${day.day.maxwind_kph} kph</p>
        <p>Precipitation: ${day.day.totalprecip_mm} mm</p>
        <p>Humidity: ${day.day.avghumidity}%</p>
    `;
}
