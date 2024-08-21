let currentCity = document.querySelector("#cuurentCity");
let rainChance = document.querySelectorAll("#rainChance");
let currentTemp = document.querySelector("#cuurentTemp");
let currentWeatherImg = document.querySelector("#currentWeatherImg");
let currentCityTimeArr = document.querySelectorAll("#currentCityTime");
let currentCityTimeImageArr = document.querySelectorAll(
  "#currentCityTimeImage"
);
let currentCityTimeTempArr = document.querySelectorAll("#currentCityTimeTemp");
let feelling = document.querySelector("#feelling");
let windSpeed = document.querySelector("#windSpeed");
let uvIndex = document.querySelector("#uvIndex");
let futureDayNameArr = document.querySelectorAll("#futureDayName");
let futureDayWeatherImageArr = document.querySelectorAll(
  "#futureDayWeatherImage"
);
let futureDayWeatherTitleArr = document.querySelectorAll(
  "#futureDayWeatherTitle"
);
let futureDayWeatherTempArr = document.querySelectorAll(
  "#futureDayWeatherTempArr"
);
let DateObj = new Date();
let DayName = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const ImageUrl = (iconCode) =>
  `https://cdn.weatherbit.io/static/img/icons/${iconCode}.png`;
let cite = prompt("Enter City Name") || "Kheri";
let Contrycode = prompt("Enter Country Code").toUpperCase() || "IN";
async function FetchCurrentWeatherData(citeName, contrycode) {
  const Url = `https://weatherbit-v1-mashape.p.rapidapi.com/current?&city=${citeName}&country=${contrycode}&units=imperial&lang=en`;
  // let Url = "./assets/current.json";
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "214358eb33msh01458e4f1f84c8ep16e9f1jsnb978278dc6a1",
      "x-rapidapi-host": "weatherbit-v1-mashape.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(Url, options);
    const result = await response.text();
    const data = JSON.parse(result);
    CuurentWeatherDataFillFunction(data["data"][0]);
  } catch (error) {
    console.error(error);
  }
}
async function FetchCurrentCityWeatherHourly(citeName, contrycode) {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yy = today.getFullYear();
  console.log(`${dd}/${mm}/${yy}`);
  let Url = ` https://api.weatherbit.io/v2.0/history/hourly?city=${citeName}&country=${contrycode}&start_date=${`${yy}-${mm}-${dd}`}&end_date=${`${yy}-${mm}-${
    Number(dd) + 1
  }`}&key=a12a488d63434d4296a12bb8acbdb844`;
  // let Url = "./assets/secondryhourly.json";
  const options = {
    method: "GET",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };

  try {
    const response = await fetch(Url);
    const result = await response.text();
    const data = JSON.parse(result);

    CurrentWeatherHourly(data["data"]);
  } catch (error) {
    console.error(error);
  }
}
async function FetchFutureDayWeatherData(citeName, contrycode) {
  const Url = `https://weatherbit-v1-mashape.p.rapidapi.com/forecast/daily?&city=${citeName}&country=${contrycode}&units=imperial&lang=en`;
  // let Url = `./assets/dayWise.json`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "214358eb33msh01458e4f1f84c8ep16e9f1jsnb978278dc6a1",
      "x-rapidapi-host": "weatherbit-v1-mashape.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(Url, options);
    const result = await response.text();
    const data = JSON.parse(result);
    FutureWeatherDataFillFunciton(data["data"]);
    console.log("arshnoor");

    document.querySelector(".loader-Body").style.display = "none";
  } catch (error) {
    console.error(error);
  }
}
FetchCurrentWeatherData(cite, Contrycode);
FetchCurrentCityWeatherHourly(cite, Contrycode);
console.log(cite, Contrycode);

FetchFutureDayWeatherData(cite, Contrycode);
futureDayNameArr[0] = "Today";
let count = DateObj.getDay();
futureDayNameArr.forEach((ele, index) => {
  ele.innerHTML = DayName[count];
  count++;
  if (count == futureDayNameArr.length - 1) {
    count = 0;
  }
});
function CuurentWeatherDataFillFunction(Data) {
  currentCity.innerHTML = Data.city_name;
  currentWeatherImg.setAttribute("src", ImageUrl(Data.weather.icon));
  // Fill rain persent with help to forEach loop
  rainChance.forEach((element) => {
    element.innerHTML = Data.precip + "%";
  });
  currentTemp.innerHTML = Data.temp + "°F ";
  feelling.innerHTML = Data.app_temp + "°F";
  windSpeed.innerHTML = Data.wind_spd + "mph ";
  uvIndex.innerHTML = Data.uv;
}
function FutureWeatherDataFillFunciton(Data) {
  futureDayWeatherImageArr.forEach((elm, index) => {
    elm.setAttribute("src", ImageUrl(Data[index].weather.icon));
    futureDayWeatherTitleArr[index].innerHTML = Data[index].weather.description;
    futureDayWeatherTempArr[index].innerHTML = Data[index].temp + "°F ";
  });
}
function CurrentWeatherHourly(data) {
  let WeatherHourlyTimeArr = [
    data.splice(6, 1)[0],
    data.splice(8, 1)[0],
    data.splice(10, 1)[0],
    data.splice(12, 1)[0],
    data.splice(14, 1)[0],
    data.splice(16, 1)[0],
  ];
  let TimeArr = [];
  let timeTemp = [];
  WeatherHourlyTimeArr.forEach((element, index) => {
    let temptime = new Date(element["timestamp_utc"]).getHours();
    let timeStr = "AM";
    if (temptime > 12) {
      temptime -= 12;
      timeStr = "PM";
    }
    TimeArr.push(temptime + timeStr);
    timeTemp.push(element.temp);
  });

  const TempIsNull = () => {
    let temp;
    timeTemp.map((e) => {
      if (e) {
        temp = e;
      }
    });
    return temp;
  };
  currentCityTimeArr.forEach((elm, index) => {
    elm.innerHTML = TimeArr[index];
    currentCityTimeImageArr[index].setAttribute(
      "src",
      ImageUrl(WeatherHourlyTimeArr[index].weather.icon)
    );
    currentCityTimeTempArr[index].innerHTML =
      WeatherHourlyTimeArr[index].temp || TempIsNull();
  });
}
