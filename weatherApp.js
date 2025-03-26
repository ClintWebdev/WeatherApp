const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey = "4b7a7f5573a0ccfa4538ec966f394577";

weatherForm.addEventListener("submit", async event => {
    event.preventDefault();

    const city = cityInput.value;
    if(city){
        try{
            // Show loading state with animation
            card.style.display = "flex";
            card.innerHTML = '<p class="loading"><i class="fas fa-spinner fa-spin"></i> Loading weather data...</p>';
            
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
        }
        catch(error){
            console.error(error);
            displayError(error);
        }
    }
    else{
        displayError("Please enter a city name");
    }
});

async function getWeatherData(city){
    const apiUrl =`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    const response = await fetch(apiUrl);
    console.log(response);

    if(!response.ok){
        throw new Error("Could not fetch weather data. Please check the city name and try again.");
    }
    return await response.json();
}

function displayWeatherInfo(data){
    const {
        name: city,
        main: { temp, humidity, feels_like, pressure },
        weather: [{ description, id }],
        wind: { speed },
        sys: { country }
    } = data;
        
    card.textContent = "";
    card.style.display = "flex";

    // Set background class based on weather condition
    setWeatherBackground(id);
    
    // Create weather info elements
    const cityDisplay = document.createElement("h2");
    const weatherImoji = document.createElement("div");
    const tempDisplay = document.createElement("p");
    const desDisplay = document.createElement("p");
    
    // Create weather details section
    const weatherDetails = document.createElement("div");
    weatherDetails.className = "weather-details";
    
    // Add content to elements
    cityDisplay.innerHTML = `${city}, <span>${country}</span>`;
    weatherImoji.textContent = getWeatherImoji(id);
    tempDisplay.innerHTML = `${(temp - 273.15).toFixed(1)}<sup>°C</sup>`;
    desDisplay.textContent = description;
    
    // Create weather detail items
    const detailItems = [
        { icon: 'fas fa-thermometer-half', text: `Feels like: ${(feels_like - 273.15).toFixed(1)}°C` },
        { icon: 'fas fa-tint', text: `Humidity: ${humidity}%` },
        { icon: 'fas fa-wind', text: `Wind: ${speed} m/s` },
        { icon: 'fas fa-compress-alt', text: `Pressure: ${pressure} hPa` }
    ];
    
    detailItems.forEach(item => {
        const detailElement = document.createElement("div");
        detailElement.className = "weather-detail";
        detailElement.innerHTML = `<i class="${item.icon}"></i><span>${item.text}</span>`;
        weatherDetails.appendChild(detailElement);
    });
    
    // Add classes to elements
    cityDisplay.classList.add("cityDisplay");
    weatherImoji.classList.add("weatherImoji");
    tempDisplay.classList.add("tempDisplay");
    desDisplay.classList.add("desDisplay");
    
    // Append elements to card
    card.appendChild(cityDisplay);
    card.appendChild(weatherImoji);
    card.appendChild(tempDisplay);
    card.appendChild(desDisplay);
    card.appendChild(weatherDetails);
}

function setWeatherBackground(weatherId) {
    // Remove existing weather classes
    card.classList.remove("sunny", "cloudy", "rainy", "snowy");
    
    // Add appropriate class based on weather condition
    if (weatherId === 800) {
        card.classList.add("sunny");
    } else if (weatherId >= 200 && weatherId < 600) {
        card.classList.add("rainy");
    } else if (weatherId >= 600 && weatherId < 700) {
        card.classList.add("snowy");
    } else {
        card.classList.add("cloudy");
    }
}

function getWeatherImoji(weatherId){
    switch(true){
        case (weatherId >= 200 && weatherId < 300):
            return "⛈️";
        case (weatherId >= 300 && weatherId < 400):
            return "🌧️";
        case (weatherId >= 500 && weatherId < 600):
            return "🌧️";   
        case (weatherId >= 600 && weatherId < 700):
             return "❄️";
        case (weatherId >= 700 && weatherId < 800):
             return "🌫️";
        case (weatherId === 800):
             return "☀️";
        case (weatherId >= 801 && weatherId < 810):
              return "☁️";
        default:
            return "🌡️";
    }
}

function displayError(message){
    const errorDisplay = document.createElement("div");
    errorDisplay.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    errorDisplay.classList.add("errorDisplay");

    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errorDisplay);
}

// Add some interactivity and animations
document.addEventListener('DOMContentLoaded', () => {
    // Focus the input when page loads
    cityInput.focus();
    
    // Animate the form on page load
    setTimeout(() => {
        document.querySelector('.weatherForm').style.opacity = '1';
        document.querySelector('.weatherForm').style.transform = 'translateY(0)';
    }, 200);
});
