const http = require("http"); 
const fs = require("fs");
const path= require("path");
const  express = require ("express");
const app = express();
var requests = require("requests");
app.use(express.static(path.join(__dirname,"public")));
const homeFile = fs.readFileSync("home.html", "utf-8");
const replaceVal = (tempVal,orgVal) => {
    let temperature = tempVal.replace("{%tempval%}",orgVal.main.temp);
     temperature = temperature.replace("{%tempmin%}",orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}",orgVal.main.temp_max);
     temperature = temperature.replace("{%location%}",orgVal.name);
     temperature = temperature.replace("{%country%}",orgVal.sys.country);
     temperature = temperature.replace("{%tempstatus%}",orgVal.weather[0].main);
     temperature = temperature.replace("{%humidity%}",orgVal.main.humidity);
     temperature = temperature.replace("{%windspeed%}",orgVal.wind.speed);
     return temperature;
    
}
const server = http.createServer((req, res) => {

    if (req.url == "/") { requests(
    
    "https://api.openweathermap.org/data/2.5/weather?q=delhi&units=metric&appid=cadc766da2dd53d54873ee2a5f24f795")
    
    .on("data", (chunk) => { 
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
        //console.log(arrData[0].main.temp); 
        const realTimeData = arrData.map((val )=> 
            replaceVal(homeFile, val))
            .join("");
           res.write(realTimeData);
           //console.log(realTimeData);

    })
    
    .on("end", (err) => { if (err) return console.log("connection closed due to errors", err); console.log("end");
    res.end();
    });
}
});

    
    server.listen(3000, "127.0.0.1");
   