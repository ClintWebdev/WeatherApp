const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey = "4b7a7f5573a0ccfa4538ec966f394577";

weatherForm.addEventListener("submit",async event =>{
    event.preventDefault();

    const city = cityInput.value;
    if(city){
        try{
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData)
        }
        catch(error){
            console.error(error);
            displayError(error)
        }
    }
    else{
        displayError("Please Enter a city")
    }
});

async function getWeatherData(city){
    const apiUrl =`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    const response = await fetch(apiUrl);
    console.log(response)

    if(!response.ok){
        throw new Error("Could not fetch weather data")
    }
    return await response.json();
}

function displayWeatherInfo(data){
    const {name:city,
        main:{temp,humidity},
        weather:[{description,id}]} = data;
        
        card.textContent = "";
        card.style.display= "flex";

        const cityDisplay = document.createElement("h1");
        const tempDisplay = document.createElement("p");
        const humidityDisplay = document.createElement("p");
        const desDisplay = document.createElement("p");
        const weatherImoji = document.createElement("p");

        
        cityDisplay.textContent = city;
        tempDisplay.textContent = `Temperature: ${(temp - 273.13).toFixed(1)}°C`;
        humidityDisplay.textContent = `Humidity : ${humidity}%`;
        desDisplay.textContent = `Description : ${description}`;
        weatherImoji.textContent = getWeatherImoji(id);

        cityDisplay.classList.add("cityDisplay");
        tempDisplay.classList.add("tempDisplay");
        desDisplay.classList.add("desDisplay");
        weatherImoji.classList.add("weatherImoji")

        card.appendChild(cityDisplay);
        card.appendChild(tempDisplay);
        card.appendChild(humidityDisplay);
        card.appendChild(desDisplay);
        card.appendChild(weatherImoji);
     
}

function getWeatherImoji(weatherId){

    switch(true){
        case (weatherId >= 200 && weatherId < 300):
            return "⛈️";
        case (weatherId >= 300 && weatherId < 400):
            return "⛈️";
        case (weatherId >= 500 && weatherId < 600):
            return "⛈️";   
        case (weatherId >= 600 && weatherId < 700):
             return "❄️";
        case (weatherId >= 700 && weatherId < 800):
             return "🌫️";
        case (weatherId === 800):
             return "☀️";
        case (weatherId >= 801 && weatherId < 810):
              return "☁️";
        default:
            return "?";
    }
}

function displayError(message){
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");

    card.textContent = ""
    card.style.display = "flex";
    card.appendChild(errorDisplay)

}