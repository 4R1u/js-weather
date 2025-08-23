import "./styles.css";

const weatherFetcher = (function () {
    const mainUrl = function (location, unitGroup = "metric", dates = "", elements = "", include = "") {
        return `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}${dates}?key=GYDSKL9BJ6CVEFMJ7E4YR7SRL&unitGroup=${unitGroup}&include=${include}&elements=${elements}&iconsSet=icons2`;
    };

    const today = function (location) {
        return fetch(mainUrl(location, "metric", "/today", "tempmax%2Ctempmin%2Ctemp%2Cfeelslike%2Cdew%2Chumidity%2Cprecipprob%2Cwindspeed%2Cwinddir%2Cpressure%2Ccloudcover%2Cvisibility%2Cuvindex%2Csunrise%2Csunset%2Cmoonphase%2Cconditions%2Cdescription%2Cicon", "days%2Chours"), { mode: "cors" })
            .then(function (response) { return response.json(); })
            .then(function (response) { return response; });
    };

    const hourly = function (location) {
        return fetch(mainUrl(location, "metric", "/next24hours", "datetime%2Ctemp%2Cfeelslike%2Chumidity%2Cprecipprob%2Ccloudcover%2Cuvindex%2Cconditions%2Cdescription%2Cicon", "hours"), { mode: "cors" })
            .then(function (response) { return response.json(); })
            .then(function (response) { return response; });
    };

    const tenday = function (location) {
        return fetch(mainUrl(location, "metric", "/next10days", "datetime%2Ctempmax%Ctempmin%2Ctemp%2Chumidity%2Cprecipprob%2Cwindspeed%2Cwinddir%2Ccloudcover%2Cvisibility%2Cuvindex%2Csunrise%2Csunset%2Cmoonphase%2Cconditions%2Cdescription%2Cicon", "days"), { mode: "cors" })
            .then(function (response) { return response.json(); })
            .then(function (response) { return response; });
    };

    const weekend = function (location) {
        return fetch(mainUrl(location, "metric", "/next14days", "datetime%2Ctempmax%Ctempmin%2Ctemp%2Chumidity%2Cprecipprob%2Cwindspeed%2Cwinddir%2Ccloudcover%2Cvisibility%2Cuvindex%2Csunrise%2Csunset%2Cmoonphase%2Cconditions%2Cdescription%2Cicon", "days"), { mode: "cors" })
            .then(function (response) { return response.json(); })
            .then(function (response) { return response; });
    };

    const monthly = function (location) {
        return fetch(mainUrl(location, "metric", "/last38days/next38days", "datetime%2Ctempmax%2Ctempmin%2Ctemp%2Cprecipprob%2Cwindspeed%2Cwinddir%2Csunrise%2Csunset%2Cmoonphase%2Cconditions%2Cdescription%2Cicon", "days"), { mode: "cors" })
            .then(function (response) { return response.json(); })
            .then(function (response) { return response; });
    };

    return { today, hourly, tenday, weekend, monthly };
})();

const displayController = (function (doc) {
    let mode = weatherFetcher.today;

    const loadSearchedLocation = function (event) {
        event.preventDefault();
        mode(doc.querySelector("#location").value)
            .then(function (result) {
                doc.querySelector(".body").textContent = result["days"][0]["temp"];
            });
    }

    const loadToday = async function (event) {
        event.preventDefault();
        const result = await weatherFetcher.today(doc.querySelector("#location").value);
        console.log(result);
        doc.querySelector(".body").innerHTML = `
        <div class="today-header">
          <div class="address">${result["resolvedAddress"]}</div>
          <div class="today-header-temp-and-icon">
            <span class="temp">${result["days"][0]["temp"]}°</span>
            <img class="icon">
          </div>
          <div class="conditions">${result["days"][0]["conditions"]}</div>
          <div class="today-header-high-and-low">
            <span class="high">High ${result["days"][0]["tempmax"]}°</span>
            <span class="high-low-dot">•</span>
            <span class="low">Low ${result["days"][0]["tempmin"]}°</span>
          </div>
        </div>

        <div class="today-body">
          <div class="today-body-high-and-low">
              <span>High/Low</span>
              <span>${result["days"][0]["tempmax"]}°/${result["days"][0]["tempmin"]}°</span>
          </div>
          <div class="feelslike">
              <span>Feels Like</span>
              <span>${result["days"][0]["feelslike"]}</span>
          </div>
          <div class="sunrise">
              <span>Sunrise</span>
              <span>${result["days"][0]["sunrise"]}</span>
          </div>
          <div class="sunset">
              <span>Sunset</span>
              <span>${result["days"][0]["sunset"]}</span>
          </div>
          <div class="wind">
              <span>Wind</span>
              <span>${result["days"][0]["windspeed"]} at ${result["days"][0]["winddir"]}</span>
          </div>
          <div class="humiditiy">
              <span>Humidity</span>
              <span>${result["days"][0]["humidity"]}%</span>
          </div>
          <div class="dew-point">
              <span>Dew point</span>
              <span>${result["days"][0]["dew"]}</span>
          </div>
          <div class="pressure">
              <span>Pressure</span>
              <span>${result["days"][0]["pressure"]}</span>
          </div>
          <div class="uv-index">
              <span>UV Index</span>
              <span>${result["days"][0]["uvindex"]}</span>
          </div>
          <div class="visibility">
              <span>Visibility</span>
              <span>${result["days"][0]["visibility"]}</span>
          </div>
          <div class="moonphase">
              <span>Moon Phase</span>
              <span>${result["days"][0]["moonphase"]}</span>
          </div>
        </div>`;
        import(`./icons/${result["days"][0]["icon"]}.png`)
            .then((result) => { doc.querySelector(".icon").src = result.default; });
    }

    doc.querySelector("form button").addEventListener("click", loadSearchedLocation);

    doc.querySelector(".header-tab-today").addEventListener("click", loadToday);
    doc.querySelector(".header-tab-hourly").addEventListener("click", () => { mode = weatherFetcher.hourly });
    doc.querySelector(".header-tab-tenday").addEventListener("click", () => { mode = weatherFetcher.tenday });
    doc.querySelector(".header-tab-weekend").addEventListener("click", () => { mode = weatherFetcher.weekend });
    doc.querySelector(".header-tab-monthly").addEventListener("click", () => { mode = weatherFetcher.monthly });

    return {};
})(document);
