import "./styles.css";

const unitHelper = (function () {
  let currentUnitSystem = "metric";
  const allUnits = {
    "us": {
      "temp": "°F",
      "speed": "mph",
      "distance": "mi",
      "pressure": "mb"
    },
    "metric": {
      "temp": "°C",
      "speed": "km/h",
      "distance": "km",
      "pressure": "mb"
    },
    "uk": {
      "temp": "°C",
      "speed": "mph",
      "distance": "mi",
      "pressure": "mb"
    },
    "base": {
      "temp": "K",
      "speed": "m/s",
      "distance": "km",
      "pressure": "mb"
    },
  };

  const changeUnits = function (target) {
    if (["us", "metric", "uk", "base"].includes(target))
      currentUnitSystem = target;
  };

  const units = function (quantity) {
    return allUnits[currentUnitSystem][quantity];
  };

  const currentUnits = function () { return currentUnitSystem; };

  const moonphase = function (moonphase) {
    if (moonphase == 0)
      return "🌑 New moon";
    else if (moonphase < 0.25)
      return "🌒︎ Waxing crescent";
    else if (moonphase == 0.25)
      return "🌓︎ First quarter";
    else if (moonphase < 0.5)
      return "🌔︎ Waxing gibbous";
    else if (moonphase == 0.5)
      return "🌕︎ Full moon";
    else if (moonphase < 0.75)
      return "🌖︎ Waning gibbous";
    else if (moonphase == 0.75)
      return "🌗︎ Last quarter";
    else if (moonphase <= 1)
      return "🌘︎ Waning crescent";
    else
      return "Unknown";
  };

  return { changeUnits, units, currentUnits, moonphase };
})();

const weatherFetcher = (function () {
  const mainUrl = function (location, unitGroup = "metric", dates = "", elements = "", include = "") {
    return `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}${dates}?key=GYDSKL9BJ6CVEFMJ7E4YR7SRL&unitGroup=${unitGroup}&include=${include}&elements=${elements}&iconsSet=icons2`;
  };

  const today = function (location) {
    return fetch(mainUrl(location, unitHelper.currentUnits(), "", "datetime%2Ctempmax%2Ctempmin%2Ctemp%2Cfeelslike%2Cdew%2Chumidity%2Cprecipprob%2Cwindspeed%2Cwinddir%2Cpressure%2Ccloudcover%2Cvisibility%2Cuvindex%2Csunrise%2Csunset%2Cmoonphase%2Cconditions%2Cdescription%2Cicon", "hours"), { mode: "cors" })
      .then(function (response) { return response.json(); })
      .then(function (response) { return response; });
  };

  return { today };
})();

const displayController = (function (doc) {
  const loadSearchedLocation = async function (event) {
    event.preventDefault();
    const result = await weatherFetcher.today(doc.querySelector("#location").value);
    console.log(result);
    const hours = [];
    const date = new Date;
    const currentHour = date.getHours();
    const currentOffset = date.getTimezoneOffset() / 60;
    for (let i = 1; i <= 24; ++i) {
      // ^--- next 24 hours, starting with the next one instead of the current one
      // v--- converts to the current hour in the timezone of requested location instead of yours
      let thisHour = currentHour + i + currentOffset + result["tzoffset"];
      if (thisHour < 0) thisHour += 24;
      hours.push(result["days"][thisHour < 24 ? 0 : 1]["hours"][thisHour < 24 ? thisHour : thisHour - 24]);
    }
    const days = result["days"];
    let thisHour = [currentHour + currentOffset + result["tzoffset"]];
    if (thisHour < 0) thisHour += 24;
    const now = days[0]["hours"][thisHour];

    doc.querySelector(".address").textContent = result["resolvedAddress"];
    doc.querySelector(".temp").textContent = `${now["temp"]} ${unitHelper.units("temp")}`;
    doc.querySelector(".conditions").textContent = now["conditions"];
    doc.querySelector(".high").textContent = `${days[0]["tempmax"]} ${unitHelper.units("temp")}`;
    doc.querySelector(".low").textContent = `${days[0]["tempmin"]} ${unitHelper.units("temp")}`;

    doc.querySelector(".feelslike div:last-child").textContent = `${now["feelslike"]} ${unitHelper.units("temp")}`;
    doc.querySelector(".sunrise span:last-child").textContent = `${days[0]["sunrise"]}`;
    doc.querySelector(".sunset span:last-child").textContent = `${days[0]["sunset"]}`;
    doc.querySelector(".today-body-high-and-low span:last-child").textContent = `${days[0]["tempmax"]} ${unitHelper.units("temp")}/${days[0]["tempmax"]} ${unitHelper.units("temp")}`;
    doc.querySelector(".windspeed").textContent = `${now["windspeed"]} ${unitHelper.units("speed")}`;
    doc.querySelector(".winddir").style = `display: inline-block; transform: rotate(${(180 + now["winddir"]) % 360}deg);`;
    doc.querySelector(".humidity span:last-child").textContent = `${now["humidity"]}%`;
    doc.querySelector(".dew-point span:last-child").textContent = `${now["dew"]} ${unitHelper.units("temp")}`;
    doc.querySelector(".pressure span:last-child").textContent = `${now["pressure"]} ${unitHelper.units("pressure")}`;
    doc.querySelector(".uv-index span:last-child").textContent = `${now["uvindex"]}`;
    doc.querySelector(".visibility span:last-child").textContent = `${now["visibility"]} ${unitHelper.units("distance")}`;
    doc.querySelector(".moonphase span:last-child").textContent = unitHelper.moonphase(days[0]["moonphase"]);

    import(`./icons/${now["icon"]}.png`)
      .then((result) => { doc.querySelector(".icon").src = result.default; });

    for (let i = 0; i < 24; ++i) {
      doc.querySelector(`.hourly-forecast:nth-child(${i + 1}) .hourly-hour`).textContent = hours[i]["datetime"].slice(0, 5);
      doc.querySelector(`.hourly-forecast:nth-child(${i + 1}) .hourly-temp`).textContent = `${Math.round(hours[i]["temp"])} ${unitHelper.units("temp")}`;
      doc.querySelector(`.hourly-forecast:nth-child(${i + 1}) .hourly-humidity`).textContent = `${Math.round(hours[i]["humidity"])}%`;
      import(`./icons/${hours[i]["icon"]}.png`)
        .then((result) => { doc.querySelector(`.hourly-forecast:nth-child(${i + 1}) .hourly-icon`).src = result.default; });
    }

    for (let i = 1; i <= 14; ++i) {
      doc.querySelector(`.daily-forecast:nth-child(${i}) span:first-child`).textContent = days[i]["datetime"].slice(5);
      doc.querySelector(`.daily-forecast:nth-child(${i}) span:last-child span:nth-child(2)`).textContent = `${Math.round(days[i]["humidity"])}%`;
      doc.querySelector(`.daily-forecast:nth-child(${i}) span:last-child span:last-child span:first-child`).textContent = `${Math.round(days[i]["tempmax"])} ${unitHelper.units("temp")}`;
      doc.querySelector(`.daily-forecast:nth-child(${i}) span:last-child span:last-child span:last-child`).textContent = `${Math.round(days[i]["tempmin"])} ${unitHelper.units("temp")}`;
      import(`./icons/${days[i]["icon"]}.png`)
        .then((result) => { doc.querySelector(`.daily-forecast:nth-child(${i}) img`).src = result.default; });
    }

    doc.querySelector(".body").classList.remove("hidden");
  };

  doc.querySelectorAll(".unit-button").forEach(
    (i) => {
      i.addEventListener("click", () => {
        unitHelper.changeUnits(i.textContent.toLowerCase());
        doc.querySelector(".current-units-button").classList.remove("current-units-button");
        i.classList.add("current-units-button");
      });
    }
  );

  doc.querySelector("form button").addEventListener("click", loadSearchedLocation);

  return {};
})(document);
