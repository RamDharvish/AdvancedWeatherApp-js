
cityInput=document.querySelector(".city-input")
const searchButton=document.querySelector(".search-btn")
const weatherCardDiv=document.querySelector(".weather-cards")
const currentWeatherDiv=document.querySelector(".current-weather")
const locationButton=document.querySelector(".location-btn")

const API_KEY="7a3548dd70188dabcc0ca6dea038edf6"
const createWeatherCard= (cityName, weatherItem, index)=> {
    if(index===0){
        return ` <div class="details">
        <h2>${cityName     } <span>(${weatherItem.dt_txt.split(" ")[0]})</span></h2>
        <h4>Temp : ${(weatherItem.main.temp -273.15).toFixed(2)}.<sup>0</sup>C</h4>
        <h4>Wind : ${weatherItem.wind.speed} M/S</h4>
        <h4>Humidity : ${weatherItem.main.humidity}%</h4>
    </div>
    <div class="icon">
        <img src="cloudy.png" alt="weather-icon">
        <h4>${weatherItem.weather[0].description}</h4>
    </div>`

    }else {
    return ` <li class="card">
    <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
    <img src="cloudy.png" alt="weather-icon">
    <h4>Temp : ${(weatherItem.main.temp -273.15).toFixed(2)}.<sup>0</sup>C</h4>
    <h4>Wind : ${weatherItem.wind.speed} M/S</h4>
    <h4>Humidity : ${weatherItem.main.humidity}%</h4>
    </li>`
}
}



const getWeatherDetails  = (cityName,lat,lon) => {
    const WEATHER_APP_URL=`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_APP_URL)
    .then(res =>res.json())
    .then(data => {
        console.log(data);

        //filter the forecast to get one forcast per day
        const uniqueForecastDays=[]
       const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate=new Date(forecast.dt_txt).getDate()
            if(!uniqueForecastDays.includes(forecastDate)) {
             return   uniqueForecastDays.push(forecastDate)
            }
        })
        //clearing previous weather data
        cityInput.value=""
        weatherCardDiv.innerHTML=""
        currentWeatherDiv.innerHTML=""

        console.log(fiveDaysForecast);
        fiveDaysForecast.forEach((weatherItem, index) => {
            if(index===0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend",createWeatherCard(cityName, weatherItem, index))

            }else {
            weatherCardDiv.insertAdjacentHTML("beforeend",createWeatherCard(cityName, weatherItem, index))
            }
            
        })
    }).catch(()=> {
        alert("error")
    })
}


const getCityCoordinates=()=> {
    const cityName=cityInput.value.trim()
    if(!cityName) return;
    // console.log(cityName);
    const GEOCODING_API_URL=`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
    
     //below code helps to get the (latitude,longitude and name) of entered city from API
    fetch(GEOCODING_API_URL).then(res => res.json())
    .then(data => {
        // console.log(data);
        if(! data.length) alert(`The place (${cityName}) currently not available`)
        const {name, lat, lon } =data[0]
        getWeatherDetails(name, lat, lon)
    }).catch(()=> {
        alert("error")
    })

}

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            // console.log(position);
            const {latitude, longitude}=position.coords
            const REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`
              
            fetch(REVERSE_GEOCODING_URL).then(res => res.json())
            .then(data => {
                // console.log(data);
                const {name} =data[0]
                getWeatherDetails(name, latitude, longitude)
            }).catch(()=> {
                alert("error")
            })
        },
        error => {
            if(error.code===error.PERMISSION_DENIED) {
                alert("location permission denied")
            }
        }
    )

}
searchButton.addEventListener("click",getCityCoordinates)
locationButton.addEventListener("click",getUserCoordinates)
cityInput.addEventListener("keyup", e=>e.key==="Enter"&& getCityCoordinates())