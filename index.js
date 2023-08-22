const http = require("http");
const fs = require("fs");
const requests = require("requests");

let port = 5000;

let htmlfile = fs.readFileSync("index.html", "UTF-8");
let replaceValue = (htmlfile, val) => {
  let tempreature = htmlfile.replace("{%main%}", val.weather[0].main);
  tempreature = tempreature.replace(
    "{%description%}",
    val.weather[0].description
  );
  tempreature = tempreature.replace("{%temp%}", val.main.temp - 273);
  tempreature = tempreature.replace("{%feellike%}", val.main.feels_like - 273);
  tempreature = tempreature.replace("{%city%}", val.name);
  tempreature = tempreature.replace("{%country%}", val.sys.country);
  return tempreature;
};
let server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      "https://api.openweathermap.org/data/2.5/weather?lat=33.6844&lon=73.0479&appid=21acc1636beb018158e7de37165c2f80"
    )
      .on("data", function (chunk) {
        let obj = JSON.parse(chunk);
        let arr = [obj];

        let realarr = arr
          .map((val) => {
            return replaceValue(htmlfile, val);
          })
          .join("");
        console.log(realarr);
        res.write(realarr);
        res.end();
      })
      .on("end", function (err) {
        if (err) return console.log("connection closed due to errors", err);
      });
  }
});
server.listen(port, () => {
  console.log("server runnin on " + port);
});
