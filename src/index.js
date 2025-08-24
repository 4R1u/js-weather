import "./styles.css";

const weatherFetcher = (function () {
    const mainUrl = function (location, unitGroup = "metric", dates = "", elements = "", include = "") {
        return `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}${dates}?key=GYDSKL9BJ6CVEFMJ7E4YR7SRL&unitGroup=${unitGroup}&include=${include}&elements=${elements}&iconsSet=icons2`;
    };

    const today = function (location) {
        return fetch(mainUrl(location, "metric", "/next24hours", "datetime%2Ctempmax%2Ctempmin%2Ctemp%2Cfeelslike%2Cdew%2Chumidity%2Cprecipprob%2Cwindspeed%2Cwinddir%2Cpressure%2Ccloudcover%2Cvisibility%2Cuvindex%2Csunrise%2Csunset%2Cmoonphase%2Cconditions%2Cdescription%2Cicon", "hours"), { mode: "cors" })
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
        for (let i = 0; i < 24; ++i) {
            const thisHour = currentHour + i + currentOffset + result["tzoffset"];
            hours.push(result["days"][thisHour < 24 ? 0 : 1]["hours"][thisHour < 24 ? thisHour : thisHour - 24]);
        }
        doc.querySelector(".body").innerHTML = `
        <div class="card today-header">
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

        <div class="card today-body">
          <div class="feelslike-and-sunrise-and-sunset">
            <div class="feelslike">
              <div>Feels Like</div>
              <div>${result["days"][0]["feelslike"]}°</div>
            </div>
            <div class="sunrise-and-sunset">
              <div class="sunrise">
                  <span>Sunrise</span>
                  <span>${result["days"][0]["sunrise"]}</span>
              </div>
              <div class="sunset">
                  <span>Sunset</span>
                  <span>${result["days"][0]["sunset"]}</span>
              </div>
            </div>
          </div>
          <div class="today-body-grid">
            <div class="today-grid-item today-body-high-and-low">
              <span>High/Low</span>
              <span>${result["days"][0]["tempmax"]}°/${result["days"][0]["tempmin"]}°</span>
            </div>
            <div class="today-grid-item wind">
                <span>Wind</span>
                <span>${result["days"][0]["windspeed"]} at ${result["days"][0]["winddir"]}</span>
            </div>
            <div class="today-grid-item humiditiy">
                <span>Humidity</span>
                <span>${result["days"][0]["humidity"]}%</span>
            </div>
            <div class="today-grid-item dew-point">
                <span>Dew point</span>
                <span>${result["days"][0]["dew"]}°</span>
            </div>
            <div class="today-grid-item pressure">
                <span>Pressure</span>
                <span>${result["days"][0]["pressure"]}</span>
            </div>
            <div class="today-grid-item uv-index">
                <span>UV Index</span>
                <span>${result["days"][0]["uvindex"]}</span>
            </div>
            <div class="today-grid-item visibility">
                <span>Visibility</span>
                <span>${result["days"][0]["visibility"]}</span>
            </div>
            <div class="today-grid-item moonphase">
                <span>Moon Phase</span>
                <span>${result["days"][0]["moonphase"]}</span>
            </div>
          </div>
        </div>
        
        <div class="card hourly-forecasts">
          <div class="hourly-forecast">${hours[0]["temp"]}°</div>
          <div class="hourly-forecast">${hours[1]["temp"]}°</div>
          <div class="hourly-forecast">${hours[2]["temp"]}°</div>
          <div class="hourly-forecast">${hours[3]["temp"]}°</div>
          <div class="hourly-forecast">${hours[4]["temp"]}°</div>
          <div class="hourly-forecast">${hours[5]["temp"]}°</div>
          <div class="hourly-forecast">${hours[6]["temp"]}°</div>
          <div class="hourly-forecast">${hours[7]["temp"]}°</div>
          <div class="hourly-forecast">${hours[8]["temp"]}°</div>
          <div class="hourly-forecast">${hours[9]["temp"]}°</div>
          <div class="hourly-forecast">${hours[10]["temp"]}°</div>
          <div class="hourly-forecast">${hours[11]["temp"]}°</div>
          <div class="hourly-forecast">${hours[12]["temp"]}°</div>
          <div class="hourly-forecast">${hours[13]["temp"]}°</div>
          <div class="hourly-forecast">${hours[14]["temp"]}°</div>
          <div class="hourly-forecast">${hours[15]["temp"]}°</div>
          <div class="hourly-forecast">${hours[16]["temp"]}°</div>
          <div class="hourly-forecast">${hours[17]["temp"]}°</div>
          <div class="hourly-forecast">${hours[18]["temp"]}°</div>
          <div class="hourly-forecast">${hours[19]["temp"]}°</div>
          <div class="hourly-forecast">${hours[20]["temp"]}°</div>
          <div class="hourly-forecast">${hours[21]["temp"]}°</div>
          <div class="hourly-forecast">${hours[22]["temp"]}°</div>
          <div class="hourly-forecast">${hours[23]["temp"]}°</div>
        </div>`;
        import(`./icons/${result["days"][0]["icon"]}.png`)
            .then((result) => { doc.querySelector(".icon").src = result.default; });
    }

    doc.querySelector("form button").addEventListener("click", loadSearchedLocation);

    return {};
})(document);
