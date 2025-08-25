import "./styles.css";

const weatherFetcher = (function () {
  const mainUrl = function (location, unitGroup = "metric", dates = "", elements = "", include = "") {
    return `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}${dates}?key=GYDSKL9BJ6CVEFMJ7E4YR7SRL&unitGroup=${unitGroup}&include=${include}&elements=${elements}&iconsSet=icons2`;
  };

  const today = function (location) {
    return fetch(mainUrl(location, "metric", "", "datetime%2Ctempmax%2Ctempmin%2Ctemp%2Cfeelslike%2Cdew%2Chumidity%2Cprecipprob%2Cwindspeed%2Cwinddir%2Cpressure%2Ccloudcover%2Cvisibility%2Cuvindex%2Csunrise%2Csunset%2Cmoonphase%2Cconditions%2Cdescription%2Cicon", "hours"), { mode: "cors" })
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

    doc.querySelector(".address").textContent = result["resolvedAddress"];
    doc.querySelector(".temp").textContent = `${days[0]["temp"]}°`;
    doc.querySelector(".conditions").textContent = days[0]["conditions"];
    doc.querySelector(".high").textContent = `${days[0]["tempmax"]}°`;
    doc.querySelector(".low").textContent = `${days[0]["tempmin"]}°`;

    doc.querySelector(".feelslike div:last-child").textContent = `${days[0]["feelslike"]}°`;
    doc.querySelector(".sunrise span:last-child").textContent = `${days[0]["sunrise"]}`;
    doc.querySelector(".sunset span:last-child").textContent = `${days[0]["sunset"]}`;
    doc.querySelector(".today-body-high-and-low span:last-child").textContent = `${days[0]["tempmax"]}°/${days[0]["tempmax"]}°`;
    doc.querySelector(".wind span:last-child").textContent = `Dir: ${days[0]["winddir"]}, Vel: ${days[0]["windspeed"]}`;
    doc.querySelector(".humidity span:last-child").textContent = `${days[0]["humidity"]}%`;
    doc.querySelector(".dew-point span:last-child").textContent = `${days[0]["dew"]}°`;
    doc.querySelector(".pressure span:last-child").textContent = `${days[0]["pressure"]}`;
    doc.querySelector(".uv-index span:last-child").textContent = `${days[0]["uvindex"]}`;
    doc.querySelector(".visibility span:last-child").textContent = `${days[0]["visibility"]}`;
    doc.querySelector(".moonphase span:last-child").textContent = `${days[0]["moonphase"]}`;

    import(`./icons/${result["days"][0]["icon"]}.png`)
      .then((result) => { doc.querySelector(".icon").src = result.default; });

    for (let i = 0; i < 24; ++i) {
      doc.querySelector(`.hourly-forecast:nth-child(${i + 1}) .hourly-hour`).textContent = hours[i]["datetime"].slice(0, 5);
      doc.querySelector(`.hourly-forecast:nth-child(${i + 1}) .hourly-temp`).textContent = `${Math.round(hours[i]["temp"])}°`;
      doc.querySelector(`.hourly-forecast:nth-child(${i + 1}) .hourly-humidity`).textContent = `${Math.round(hours[i]["humidity"])}%`;
      import(`./icons/${hours[i]["icon"]}.png`)
        .then((result) => { doc.querySelector(`.hourly-forecast:nth-child(${i + 1}) .hourly-icon`).src = result.default; });
    }

    for (let i = 1; i <= 14; ++i) {
      doc.querySelector(`.daily-forecast:nth-child(${i}) span:first-child`).textContent = days[i]["datetime"].slice(5);
      doc.querySelector(`.daily-forecast:nth-child(${i}) span:last-child span:nth-child(2)`).textContent = `${Math.round(days[i]["humidity"])}%`;
      doc.querySelector(`.daily-forecast:nth-child(${i}) span:last-child span:last-child span:first-child`).textContent = `${Math.round(days[i]["tempmax"])}°`;
      doc.querySelector(`.daily-forecast:nth-child(${i}) span:last-child span:last-child span:last-child`).textContent = `${Math.round(days[i]["tempmin"])}°`;
      import(`./icons/${days[i]["icon"]}.png`)
        .then((result) => { doc.querySelector(`.daily-forecast:nth-child(${i}) img`).src = result.default; });
    }

    doc.querySelector(".body").classList.remove("hidden");
  }

  doc.querySelector("form button").addEventListener("click", loadSearchedLocation);

  return {};
})(document);
