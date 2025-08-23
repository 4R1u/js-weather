import "./styles.css";

const weatherFetcher = (function () {
    const mainUrl = function (location, unitGroup = "metric", dates = "", elements = "", include = "") {
        return `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}${dates}?key=GYDSKL9BJ6CVEFMJ7E4YR7SRL&unitGroup=${unitGroup}&include=${include}&elements=${elements}`;
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
                doc.querySelector(".temp").textContent = result["days"][0]["temp"];
            });
    }

    doc.querySelector("form button").addEventListener("click", loadSearchedLocation);

    doc.querySelector(".header-tab-today").addEventListener("click", () => { mode = weatherFetcher.today });
    doc.querySelector(".header-tab-hourly").addEventListener("click", () => { mode = weatherFetcher.hourly });
    doc.querySelector(".header-tab-tenday").addEventListener("click", () => { mode = weatherFetcher.tenday });
    doc.querySelector(".header-tab-weekend").addEventListener("click", () => { mode = weatherFetcher.weekend });
    doc.querySelector(".header-tab-monthly").addEventListener("click", () => { mode = weatherFetcher.monthly });

    return {};
})(document);
