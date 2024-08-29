let Input = document.querySelector("#myInput");
Input.onclick = () => {
  citesshow();
};
let placeInfo = document.querySelector("#placeInfo");
let DataArr = [];
let futureDayName = document.querySelectorAll("#searchCityDayName");
let dayName = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let typingTimer;
var currentSuggetionFocus;
function titleCase(str) {
  str = str.toLowerCase().split(" ");
  for (let y = 0; y < str.length; y++) {
    str[y] = str[y].charAt(0).toUpperCase() + str[y].slice(1);
  }
  return str.join(" ");
}
function autocomplete(input, arr) {
  main();
  function main() {
    let divTag,
      suggestion,
      i,
      inputValue = input.value;
    //   clearing
    closeAllLists();
    currentSuggetionFocus = -1;
    if (!inputValue) {
      return false;
    }
    // Create Main Div of Suggetions
    divTag = document.createElement("DIV");
    divTag.setAttribute("id", input.id + "autocomplete-list");
    divTag.setAttribute("class", "autocomplete-items");
    input.parentNode.appendChild(divTag);
    // Createing Inner suggeetions
    for (i = 0; i < arr.length; i++) {
      // Find mathching String of Input text
      if (
        arr[i].name.substr(0, inputValue.length).toUpperCase() ===
        inputValue.toUpperCase()
      ) {
        suggestion = document.createElement("DIV");
        suggestion.innerHTML = `<strong>${arr[i].name.substr(
          0,
          inputValue.length
        )}</strong>`;
        suggestion.innerHTML += arr[i].name.substr(inputValue.length);
        suggestion.innerHTML += arr[i].state_name
          ? `, ${arr[i].state_name} `
          : "";
        suggestion.innerHTML += arr[i].country_name
          ? ` , ${arr[i].country_name}`
          : "";
        suggestion.innerHTML += `<input type="hidden" value="${
          arr[i].name
        }" countryCode='${
          arr[i].country_code ? arr[i].country_code : ""
        }' stateCode='${arr[i].state_name ? arr[i].state_code : ""}'/>`;
        suggestion.addEventListener("click", (e) => {
          let hiddenInput = e.target.querySelector("input");
          input.value = hiddenInput.value;
          placeInfo.setAttribute(
            "countryCode",
            hiddenInput.getAttribute("countryCode")
          );
          closeAllLists();
          fetchSearchCityWeatherInfo(
            input.value,
            hiddenInput.getAttribute("countryCode")
          );
        });
        divTag.appendChild(suggestion);
      }
    }
  }

  function closeAllLists(elmnt) {
    let Item = document.querySelectorAll(".autocomplete-items");
    for (let i = 0; i < Item.length; i++) {
      if (elmnt != Item[i] && elmnt != input) {
        Item[i].parentNode.removeChild(Item[i]);
      }
    }
  }
}
Input.addEventListener("keydown", function (e) {
  if (e.keyCode >= 65 && e.keyCode <= 90) {
    clearTimeout(typingTimer);
  }

  // clearTimeout(typingTimer);
  let x = document.getElementById(e.target.id + "autocomplete-list");
  // X value changing
  if (x) x = x.getElementsByTagName("div");
  if (e.keyCode == 40) {
    // UP key press
    currentSuggetionFocus += 1;
    addActive(x);
  } else if (e.keyCode == 38) {
    // Down Key Press
    currentSuggetionFocus -= 1;
    addActive(x);
  } else if (e.keyCode == 13) {
    e.preventDefault();
    if (currentSuggetionFocus > -1) {
      if (x) x[currentSuggetionFocus].click();
    }
  }
});
function addActive(x) {
  if (!x) return false;
  removerActive(x);
  // Checking SuggetinFoucus Poin and Add active class
  if (currentSuggetionFocus >= x.length) currentSuggetionFocus = 0;
  if (currentSuggetionFocus < 0) currentSuggetionFocus = x.length - 1;
  x[currentSuggetionFocus].classList.add("autocomplete-active");
}
function removerActive(x) {
  for (var i = 0; i < x.length; i++) {
    x[i].classList.remove("autocomplete-active");
  }
}
Input.addEventListener("input", (e) => {
  typingTimer = setTimeout(() => {
    countryDataFetching(titleCase(e.target.value));
  }, 200);
  async function countryDataFetching(value) {
    const url = "./contryData/countries.json";
    try {
      const response = await fetch(url);
      const result = await response.json();
      DataArr = result.filter((e) => e.name.includes(value));
      if (DataArr.length == 0) {
        StatesDataFetchin(value);
      } else {
        autocomplete(e.target, DataArr);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function StatesDataFetchin(value) {
    const url = "./contryData/States.json";
    try {
      const response = await fetch(url);
      const result = await response.json();
      DataArr = result.filter((e) => e.name.includes(value));
      if (DataArr.length == 0) {
        CitiesDataFetchin(value);
      } else {
        autocomplete(e.target, DataArr);
      }
    } catch (error) {
      console.error(error);
    }
  }
  async function CitiesDataFetchin(value) {
    const url = "./contryData/cities.json";
    try {
      const response = await fetch(url);
      const result = await response.json();
      DataArr = result.filter((e) => e.name.includes(value));
      if (DataArr.length == 0) {
        console.log("Wrong");
      } else {
        autocomplete(e.target, DataArr);
      }
    } catch (error) {
      console.error(error);
    }
  }
});
futureDayName[0] = "Today";
for (let i = DateObj.getDay(); i < 3; i++) {
  futureDayName[i].innerHTML = dayName[i];
}
function fetchSearchCityWeatherInfo(place) {
  let country_code = document.querySelector("#placeInfo");
  localStroingLocation(Input.value, country_code.getAttribute("countryCode"));
  FetchCurrentWeatherData(
    Input.value,
    country_code.getAttribute("countryCode")
  );
  FetchCurrentCityWeatherHourly(
    Input.value,
    country_code.getAttribute("countryCode")
  );
  FetchFutureDayWeatherData(
    Input.value,
    country_code.getAttribute("countryCode")
  );
  async function FetchCurrentWeatherData(
    citeName = "Kheri",
    contrycode = "IN"
  ) {
    console.log(citeName, contrycode);

    // let Url = "./assets/cuurentWeather.json";
    let Url = `https://api.weatherbit.io/v2.0/current?&city=${citeName}&country=${contrycode}&key=a12a488d63434d4296a12bb8acbdb844&include=minutely`;
    const options = {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };

    try {
      const response = await fetch(Url, options);
      const result = await response.text();
      const data = JSON.parse(result);
      CuurentWeatherDataFillFunction(data);
    } catch (error) {
      console.error(error);
    }
  }
  async function FetchCurrentCityWeatherHourly(
    citeName = "Kheri",
    contrycode = "IN"
  ) {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yy = today.getFullYear();
    let Url = ` https://api.weatherbit.io/v2.0/history/hourly?city=${citeName}&country=${contrycode}&start_date=${`${yy}-${mm}-${dd}`}&end_date=${`${yy}-${mm}-${
      Number(dd) + 1
    }`}&key=a12a488d63434d4296a12bb8acbdb844`;
    // let Url = "./assets/horulyWeether.json";
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
  async function FetchFutureDayWeatherData(
    citeName = "Kheri",
    contrycode = "IN"
  ) {
    // let Url = `./assets/forecast.Weather.json`;
    let Url = `https://api.weatherbit.io/v2.0/forecast/daily?&city=${citeName}&country=${contrycode}&key=a12a488d63434d4296a12bb8acbdb844&include=minutely`;
    const options = {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };

    try {
      const response = await fetch(Url, options);
      const result = await response.text();
      const data = JSON.parse(result);
      FutureWeatherDataFillFunciton(data["data"]);
      document.querySelector(".loader-Body").style.display = "none";
      citesBody.classList.remove("displaynone");
    } catch (error) {
      console.error(error);
    }
  }

  function CuurentWeatherDataFillFunction(data) {
    let z = new Date();
    console.log();

    document
      .querySelector("#searchCityWeatherIcon")
      .setAttribute("src", ImageUrl(data.data[0].weather.icon));

    document.querySelector("#searchCityCurrenttemp").innerHTML =
      data.data[0].temp + tempUnit[0];
    data.data.temp;
    document.querySelector("#searchCityCurrentTime").innerHTML =
      (z.getHours() - 12 > 9 ? z.getHours() - 12 : "0" + (z.getHours() - 12)) +
      ":" +
      (z.getMinutes() > 9 ? z.getMinutes() : "0" + z.getMinutes());

    for (let i = 0; i < data.minutely.length; i += 10) {
      const date = new Date(data.minutely[i].timestamp_local);
      let time = document.querySelectorAll("#searchCitytime");
      console.log(document.querySelectorAll("#searchCitytemp"));

      if (i != 20) {
        document.querySelectorAll("#searchCitytemp")[
          i > 0 ? i - 9 : i
        ].innerHTML = data.minutely[i].temp + tempUnit[0];
        time[i > 0 ? i - 9 : i].innerHTML =
          date.getHours() + ":" + date.getMinutes();
      } else {
        time[time.length - 1].innerHTML =
          date.getHours() + ":" + date.getMinutes();
        document.querySelectorAll(".cites-weather-temp > span")[
          time.length - 1
        ].innerHTML = data.minutely[i].temp + tempUnit[0];
      }
      if (i == 20) {
        break;
      }
    }
    let Data = data["data"][0];
    document.querySelectorAll("#searchCityName").forEach((e) => {
      e.innerHTML = Data.city_name;
    });
    document
      .querySelector("#searchCityWeather")
      .setAttribute("src", ImageUrl(Data.weather.icon));
    // Fill rain persent with help to forEach loop
    document.querySelector("#searchCityRainChance").innerHTML =
      Data.precip + "%";
    document.querySelector("#searchCitytemp").innerHTML =
      Data.temp + tempUnit[0];
  }
  function CurrentWeatherHourly(Data) {
    let WeatherHourlyTimeArr = [
      Data.splice(6, 1)[0],
      Data.splice(8, 1)[0],
      Data.splice(10, 1)[0],
      Data.splice(12, 1)[0],
      Data.splice(14, 1)[0],
      Data.splice(16, 1)[0],
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
    document.querySelectorAll("#searchCityTime").forEach((elm, index) => {
      elm.innerHTML = TimeArr[index];
      document
        .querySelectorAll("#searchCityTimeWeatherIcon")
        [index].setAttribute(
          "src",
          ImageUrl(WeatherHourlyTimeArr[index].weather.icon)
        );
      document.querySelectorAll("#searchCityTimeWeatherTemp")[index].innerHTML =
        (WeatherHourlyTimeArr[index].temp || TempIsNull()) + tempUnit[0];
    });
  }
  function FutureWeatherDataFillFunciton(Data) {
    document
      .querySelectorAll("#searchCityDayWeatherIcon")
      .forEach((elm, index) => {
        elm.setAttribute("src", ImageUrl(Data[index].weather.icon));
        document.querySelectorAll("#searchCityDayWeatherTitle")[
          index
        ].innerHTML = Data[index].weather.description;
        document.querySelectorAll("#searchCityDayTemp")[index].innerHTML =
          Data[index].temp + "°F ";
      });
  }
}
// fetchSearchCityWeatherInfo();
FetchCurrentWeatherData();
