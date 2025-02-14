import express from 'express';
import axios from 'axios';
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index', { location: 'your location', weather: null, temp: null, rain: null, error: null });
});

app.get('/weather', async (req, res) => {
    try {
        const location = req.query.location || 'Toronto';
        const apiKey = process.env.API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;

        const response = await axios.get(url);
        const weatherData = response.data;

        const tomorrow = weatherData.list.find(item => {
            const date = new Date(item.dt * 1000);
            return date.getDate() === (new Date().getDate() + 1);
        });

        res.render('index', {
            location: weatherData.city.name,
            weather: tomorrow.weather[0].description,
            temp: tomorrow.main.temp,
            rain: tomorrow.weather[0].main.toLowerCase().includes('rain'),
            error: null
        });
    } catch (error) {
        console.error(error);
        res.render('index', { location: '', weather: null, temp: null, rain: null, error: 'Could not fetch weather data. Please try again.' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});