const express = require('express');
const cors = require('cors');
const axios = require('axios');
const sha1 = require('js-sha1');
const libxmljs = require("libxmljs")


const app = express();

app.use(cors());
app.use(express.json());

let stopData = [];
let stopDataMap = new Map();

const getStopById = (id) => {
    let result = {};

    if (stopDataMap.has(id)) {
        result = stopDataMap.get(id);
    }
    
    return result;
    
}

const getStopsCoord = () => {
    let stops = [];

    stopData["busStopsValue"].forEach(stop => {
        let obj = { "KS_ID": stop["KS_ID"],
                    "title": stop["title"],
                    "direction": stop["direction"],
                    "latitude": stop["latitude"],
                    "longitude": stop["longitude"] };
        stops.push(obj);
    })

    return {stops};
}

const getStopData = async () => {
    axios.get('https://tosamara.ru/api/v2/classifiers/stopsFullDB.xml', 
    {"Content-Type": "application/xml; charset=utf-8"}).
        then(res => {
            const dataFromXml = libxmljs.parseXml(res.data);
            
            let busStopsValue = []
            dataFromXml.childNodes().forEach(stop => {
                var obj = {};
                stop.childNodes().forEach(tag => {obj[tag.name()] = tag.text()});
                busStopsValue.push(obj);
                stopDataMap.set(obj.KS_ID, obj);
            });

            stopData = {busStopsValue};
        })
}

const getFirstArrivalToStop = async (ks_id) => {
    let authkey = sha1(ks_id + "just_f0r_tests");
    let url = `https://tosamara.ru/api/v2/json?method=getFirstArrivalToStop&KS_ID=${ks_id}&os=android&clientid=test&authkey=${authkey}`;
    const data = await axios.get(url).then(response => response.data.arrival);

    let result = []
    data.forEach(arrival => {
        let obj = {"type": arrival["type"], 
                    "number": arrival["number"],
                    "time": arrival["time"],
                    "hullNo": arrival["hullNo"]
                    };
        result.push(obj);
    });

    return {result};
}

const getTransportPosition = async (hullno) => {
    let authkey = sha1(hullno + "just_f0r_tests");
    let url = `https://tosamara.ru/api/v2/json?method=getTransportPosition&HULLNO=${hullno}&os=android&clientid=test&authkey=${authkey}`;
    const data = await axios.get(url).then(response => response.data);

    let nextStops = []
    if (data["nextStops"]) {
        data["nextStops"].forEach(arrival => {
            let obj = {};
            let stop = stopDataMap.get(arrival["KS_ID"])
            obj["KS_ID"] = arrival["KS_ID"]
            obj["time"] = arrival["time"]
            obj["title"] = stop["title"]
            obj["adjacentStreet"] = stop["adjacentStreet"]
            obj["direction"] = stop["direction"]
            nextStops.push(obj);
        })
    }
    
    return {nextStops};
}

getStopData();

app.get('/getStopData', (req, res) => {
    res.send(stopData);
});

app.get('/getStopsCoord', (req, res) => {
    res.send(getStopsCoord());
});

app.get('/getFirstArrivalToStop', (req, res) => {
    const ks_id = req.query.KS_ID;
    getFirstArrivalToStop(ks_id).then(result => res.send(result));
})

app.get('/getTransportPosition', (req, res) => {
    const hullno = req.query.hullNo;
    getTransportPosition(hullno).then(result => res.send(result));
})

app.get('/getStopById', (req, res) => {
    const ks_id = req.query.KS_ID;
    res.send(getStopById(ks_id));
})


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
 console.log(`Server is running on port ${PORT}`);
});
