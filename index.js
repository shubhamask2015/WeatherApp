const express = require('express')
const path = require('path')
const requests = require('requests')
const bodyParser = require('body-parser')
const app = express()


const weatherApiKey = 'db9329c6a7b34854de9265bfe31d64bc';
const userLocationApiKey = 'ed4e8539aad36e';

var city, weatherData;

app.set('view engine', 'hbs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    city = 'New Delhi, In'
    requests(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${weatherApiKey}`)
        .on("data", (chunk) => {
            weatherData = JSON.parse(chunk)
        })
        .on('end', (error) => {
            res.render('home', {
                city: weatherData.name,
                country: weatherData.sys.country,
                temp: weatherData.main.temp,
                desc: weatherData.weather[0].main,
                feel: weatherData.main.feels_like
        })
    })
})

app.post('/', (req, res) => {
    city = req.body.key
    requests(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${weatherApiKey}`)
        .on("data", (chunk) => {
            weatherData = JSON.parse(chunk)
        })
        .on('end', (error) => {
            if(weatherData.cod != '200') res.render('home',{
                error: "Enter correct 'city name' (or 'city name', 'country code')",
                temp: '-:-',
                desc: '-:-',
                feel: '-:-'
            });
            else{
                res.render('home', {
                    city: weatherData.name+',',  
                    country: weatherData.sys.country, 
                    temp: weatherData.main.temp,
                    desc: weatherData.weather[0].main,
                    feel: weatherData.main.feels_like
                })
            }
        })
})

app.get('*',(req, res)=>{
    res.send("File not found, error 404 !")
})

app.listen(3000, () => {
    console.log('app is listening !!!')
})