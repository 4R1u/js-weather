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
      <div class="hourly-forecast">
        <div class="hourly-hour">${hours[0]["datetime"].slice(0, 5)}</div>
        <div class="hourly-temp">${Math.round(Number(hours[0]["temp"]))}°</div>
        <img class="hourly-icon" alt="${hours[0]["conditions"]}"></img>
        <div class="hourly-humidity">${Math.round(Number(hours[0]["humidity"]))}%</div>
      </div>
      <div class="hourly-forecast">
        <div class="hourly-hour">${hours[1]["datetime"].slice(0, 5)}</div>
        <div class="hourly-temp">${Math.round(Number(hours[1]["temp"]))}°</div>
        <img class="hourly-icon" alt="${hours[1]["conditions"]}"></img>
        <div class="hourly-humidity">${Math.round(Number(hours[1]["humidity"]))}%</div>
      </div>
      <div class="hourly-forecast">
        <div class="hourly-hour">${hours[2]["datetime"].slice(0, 5)}</div>
        <div class="hourly-temp">${Math.round(Number(hours[2]["temp"]))}°</div>
        <img class="hourly-icon" alt="${hours[2]["conditions"]}"></img>
        <div class="hourly-humidity">${Math.round(Number(hours[2]["humidity"]))}%</div>
      </div>
      <div class="hourly-forecast">
        <div class="hourly-hour">${hours[3]["datetime"].slice(0, 5)}</div>
        <div class="hourly-temp">${Math.round(Number(hours[3]["temp"]))}°</div>
        <img class="hourly-icon" alt="${hours[3]["conditions"]}"></img>
        <div class="hourly-humidity">${Math.round(Number(hours[3]["humidity"]))}%</div>
      </div>
      <div class="hourly-forecast">
        <div class="hourly-hour">${hours[4]["datetime"].slice(0, 5)}</div>
        <div class="hourly-temp">${Math.round(Number(hours[4]["temp"]))}°</div>
        <img class="hourly-icon" alt="${hours[4]["conditions"]}"></img>
        <div class="hourly-humidity">${Math.round(Number(hours[4]["humidity"]))}%</div>
      </div>
      <div class="hourly-forecast">
        <div class="hourly-hour">${hours[5]["datetime"].slice(0, 5)}</div>
        <div class="hourly-temp">${Math.round(Number(hours[5]["temp"]))}°</div>
        <img class="hourly-icon" alt="${hours[5]["conditions"]}"></img>
        <div class="hourly-humidity">${Math.round(Number(hours[5]["humidity"]))}%</div>
      </div>
      <div class="hourly-forecast">
        <div class="hourly-hour">${hours[6]["datetime"].slice(0, 5)}</div>
        <div class="hourly-temp">${Math.round(Number(hours[6]["temp"]))}°</div>
        <img class="hourly-icon" alt="${hours[6]["conditions"]}"></img>
        <div class="hourly-humidity">${Math.round(Number(hours[6]["humidity"]))}%</div>
      </div>
      <div class="hourly-forecast">
        <div class="hourly-hour">${hours[7]["datetime"].slice(0, 5)}</div>
        <div class="hourly-temp">${Math.round(Number(hours[7]["temp"]))}°</div>
        <img class="hourly-icon" alt="${hours[7]["conditions"]}"></img>
        <div class="hourly-humidity">${Math.round(Number(hours[7]["humidity"]))}%</div>
      </div>
      <div class="hourly-forecast">
        <div class="hourly-hour">${hours[8]["datetime"].slice(0, 5)}</div>
        <div class="hourly-temp">${Math.round(Number(hours[8]["temp"]))}°</div>
        <img class="hourly-icon" alt="${hours[8]["conditions"]}"></img>
        <div class="hourly-humidity">${Math.round(Number(hours[8]["humidity"]))}%</div>
      </div>
      <div class="hourly-forecast">
        <div class="hourly-hour">${hours[9]["datetime"].slice(0, 5)}</div>
        <div class="hourly-temp">${Math.round(Number(hours[9]["temp"]))}°</div>
        <img class="hourly-icon" alt="${hours[9]["conditions"]}"></img>
        <div class="hourly-humidity">${Math.round(Number(hours[9]["humidity"]))}%</div>
      </div>
      <div class="hourly-forecast">
        <div class="hourly-hour">${hours[10]["datetime"].slice(0, 5)}</div>
        <div class="hourly-temp">${Math.round(Number(hours[10]["temp"]))}°</div>
        <img class="hourly-icon" alt="${hours[10]["conditions"]}"></img>
        <div class="hourly-humidity">${Math.round(Number(hours[10]["humidity"]))}%</div>
      </div>
      <div class="hourly-forecast">
        <div class="hourly-hour">${hours[11]["datetime"].slice(0, 5)}</div>
        <div class="hourly-temp">${Math.round(Number(hours[11]["temp"]))}°</div>
        <img class="hourly-icon" alt="${hours[11]["conditions"]}"></img>
        <div class="hourly-humidity">${Math.round(Number(hours[11]["humidity"]))}%</div>
      </div>
      <div class="hourly-forecast">
        <div class="hourly-hour">${hours[12]["datetime"].slice(0, 5)}</div>
        <div class="hourly-temp">${Math.round(Number(hours[12]["temp"]))}°</div>
        <img class="hourly-icon" alt="${hours[12]["conditions"]}"></img>
        <div class="hourly-humidity">${Math.round(Number(hours[12]["humidity"]))}%</div>
      </div>
      <div class="hourly-forecast">
        <div class="hourly-hour">${hours[13]["datetime"].slice(0, 5)}</div>
        <div class="hourly-temp">${Math.round(Number(hours[13]["temp"]))}°</div>
        <img class="hourly-icon" alt="${hours[13]["conditions"]}"></img>
        <div class="hourly-humidity">${Math.round(Number(hours[13]["humidity"]))}%</div>
      </div>
      <div class="hourly-forecast">
        <div class="hourly-hour">${hours[14]["datetime"].slice(0, 5)}</div>
        <div class="hourly-temp">${Math.round(Number(hours[14]["temp"]))}°</div>
        <img class="hourly-icon" alt="${hours[14]["conditions"]}"></img>
        <div class="hourly-humidity">${Math.round(Number(hours[14]["humidity"]))}%</div>
      </div>
      <div class="hourly-forecast">
        <div class="hourly-hour">${hours[15]["datetime"].slice(0, 5)}</div>
        <div class="hourly-temp">${Math.round(Number(hours[15]["temp"]))}°</div>
        <img class="hourly-icon" alt="${hours[15]["conditions"]}"></img>
        <div class="hourly-humidity">${Math.round(Number(hours[15]["humidity"]))}%</div>
      </div>
      <div class="hourly-forecast">
        <div class="hourly-hour">${hours[16]["datetime"].slice(0, 5)}</div>
        <div class="hourly-temp">${Math.round(Number(hours[16]["temp"]))}°</div>
        <img class="hourly-icon" alt="${hours[16]["conditions"]}"></img>
        <div class="hourly-humidity">${Math.round(Number(hours[16]["humidity"]))}%</div>
      </div>
      <div class="hourly-forecast">
        <div class="hourly-hour">${hours[17]["datetime"].slice(0, 5)}</div>
        <div class="hourly-temp">${Math.round(Number(hours[17]["temp"]))}°</div>
        <img class="hourly-icon" alt="${hours[17]["conditions"]}"></img>
        <div class="hourly-humidity">${Math.round(Number(hours[17]["humidity"]))}%</div>
      </div>
      <div class="hourly-forecast">
        <div class="hourly-hour">${hours[18]["datetime"].slice(0, 5)}</div>
        <div class="hourly-temp">${Math.round(Number(hours[18]["temp"]))}°</div>
        <img class="hourly-icon" alt="${hours[18]["conditions"]}"></img>
        <div class="hourly-humidity">${Math.round(Number(hours[18]["humidity"]))}%</div>
      </div>
      <div class="hourly-forecast">
        <div class="hourly-hour">${hours[19]["datetime"].slice(0, 5)}</div>
        <div class="hourly-temp">${Math.round(Number(hours[19]["temp"]))}°</div>
        <img class="hourly-icon" alt="${hours[19]["conditions"]}"></img>
        <div class="hourly-humidity">${Math.round(Number(hours[19]["humidity"]))}%</div>
      </div>
      <div class="hourly-forecast">
        <div class="hourly-hour">${hours[20]["datetime"].slice(0, 5)}</div>
        <div class="hourly-temp">${Math.round(Number(hours[20]["temp"]))}°</div>
        <img class="hourly-icon" alt="${hours[20]["conditions"]}"></img>
        <div class="hourly-humidity">${Math.round(Number(hours[20]["humidity"]))}%</div>
      </div>
      <div class="hourly-forecast">
        <div class="hourly-hour">${hours[21]["datetime"].slice(0, 5)}</div>
        <div class="hourly-temp">${Math.round(Number(hours[21]["temp"]))}°</div>
        <img class="hourly-icon" alt="${hours[21]["conditions"]}"></img>
        <div class="hourly-humidity">${Math.round(Number(hours[21]["humidity"]))}%</div>
      </div>
      <div class="hourly-forecast">
        <div class="hourly-hour">${hours[22]["datetime"].slice(0, 5)}</div>
        <div class="hourly-temp">${Math.round(Number(hours[22]["temp"]))}°</div>
        <img class="hourly-icon" alt="${hours[22]["conditions"]}"></img>
        <div class="hourly-humidity">${Math.round(Number(hours[22]["humidity"]))}%</div>
      </div>
      <div class="hourly-forecast">
        <div class="hourly-hour">${hours[23]["datetime"].slice(0, 5)}</div>
        <div class="hourly-temp">${Math.round(Number(hours[23]["temp"]))}°</div>
        <img class="hourly-icon" alt="${hours[23]["conditions"]}"></img>
        <div class="hourly-humidity">${Math.round(Number(hours[23]["humidity"]))}%</div>
      </div>
    </div>
    
    <div class="card daily-forecasts">
      <div class="daily-forecast"><span>${days[1]["datetime"].slice(5)}</span><span><img><span>${Math.round(days[1]["humidity"])}%</span><span><span>${Math.round(Math.round(days[1]["tempmax"]))}°</span><span>${Math.round(days[1]["tempmin"])}°</span></span></span></div>
      <div class="daily-forecast"><span>${days[2]["datetime"].slice(5)}</span><span><img><span>${Math.round(days[2]["humidity"])}%</span><span><span>${Math.round(Math.round(days[2]["tempmax"]))}°</span><span>${Math.round(days[2]["tempmin"])}°</span></span></span></div>
      <div class="daily-forecast"><span>${days[3]["datetime"].slice(5)}</span><span><img><span>${Math.round(days[3]["humidity"])}%</span><span><span>${Math.round(Math.round(days[3]["tempmax"]))}°</span><span>${Math.round(days[3]["tempmin"])}°</span></span></span></div>
      <div class="daily-forecast"><span>${days[4]["datetime"].slice(5)}</span><span><img><span>${Math.round(days[4]["humidity"])}%</span><span><span>${Math.round(Math.round(days[4]["tempmax"]))}°</span><span>${Math.round(days[4]["tempmin"])}°</span></span></span></div>
      <div class="daily-forecast"><span>${days[5]["datetime"].slice(5)}</span><span><img><span>${Math.round(days[5]["humidity"])}%</span><span><span>${Math.round(Math.round(days[5]["tempmax"]))}°</span><span>${Math.round(days[5]["tempmin"])}°</span></span></span></div>
      <div class="daily-forecast"><span>${days[6]["datetime"].slice(5)}</span><span><img><span>${Math.round(days[6]["humidity"])}%</span><span><span>${Math.round(Math.round(days[6]["tempmax"]))}°</span><span>${Math.round(days[6]["tempmin"])}°</span></span></span></div>
      <div class="daily-forecast"><span>${days[7]["datetime"].slice(5)}</span><span><img><span>${Math.round(days[7]["humidity"])}%</span><span><span>${Math.round(Math.round(days[7]["tempmax"]))}°</span><span>${Math.round(days[7]["tempmin"])}°</span></span></span></div>
      <div class="daily-forecast"><span>${days[8]["datetime"].slice(5)}</span><span><img><span>${Math.round(days[8]["humidity"])}%</span><span><span>${Math.round(Math.round(days[8]["tempmax"]))}°</span><span>${Math.round(days[8]["tempmin"])}°</span></span></span></div>
      <div class="daily-forecast"><span>${days[9]["datetime"].slice(5)}</span><span><img><span>${Math.round(days[9]["humidity"])}%</span><span><span>${Math.round(Math.round(days[9]["tempmax"]))}°</span><span>${Math.round(days[9]["tempmin"])}°</span></span></span></div>
      <div class="daily-forecast"><span>${days[10]["datetime"].slice(5)}</span><span><img><span>${Math.round(days[10]["humidity"])}%</span><span><span>${Math.round(Math.round(days[10]["tempmax"]))}°</span><span>${Math.round(days[10]["tempmin"])}°</span></span></span></div>
      <div class="daily-forecast"><span>${days[11]["datetime"].slice(5)}</span><span><img><span>${Math.round(days[11]["humidity"])}%</span><span><span>${Math.round(Math.round(days[11]["tempmax"]))}°</span><span>${Math.round(days[11]["tempmin"])}°</span></span></span></div>
      <div class="daily-forecast"><span>${days[12]["datetime"].slice(5)}</span><span><img><span>${Math.round(days[12]["humidity"])}%</span><span><span>${Math.round(Math.round(days[12]["tempmax"]))}°</span><span>${Math.round(days[12]["tempmin"])}°</span></span></span></div>
      <div class="daily-forecast"><span>${days[13]["datetime"].slice(5)}</span><span><img><span>${Math.round(days[13]["humidity"])}%</span><span><span>${Math.round(Math.round(days[13]["tempmax"]))}°</span><span>${Math.round(days[13]["tempmin"])}°</span></span></span></div>
      <div class="daily-forecast"><span>${days[14]["datetime"].slice(5)}</span><span><img><span>${Math.round(days[14]["humidity"])}%</span><span><span>${Math.round(Math.round(days[14]["tempmax"]))}°</span><span>${Math.round(days[14]["tempmin"])}°</span></span></span></div>
    </div>`;

    import(`./icons/${result["days"][0]["icon"]}.png`)
      .then((result) => { doc.querySelector(".icon").src = result.default; });

    for (let i = 0; i < 24; ++i) {
      import(`./icons/${hours[i]["icon"]}.png`)
        .then((result) => { doc.querySelector(`.hourly-forecast:nth-child(${i + 1}) .hourly-icon`).src = result.default; });
    }

    for (let i = 1; i <= 14; ++i) {
      import(`./icons/${days[i]["icon"]}.png`)
        .then((result) => { doc.querySelector(`.daily-forecast:nth-child(${i}) img`).src = result.default; });
    }  }

  doc.querySelector("form button").addEventListener("click", loadSearchedLocation);

  return {};
})(document);
