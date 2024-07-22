const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
const port = 3000;
const apiKey = 'e9c467921ca83c3b3d73915731dd2b56';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('website'));
app.use(cors());

async function connectApi(zipCode) {
  const url = `http://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&appid=${apiKey}&units=metric`;
  console.log(`Fetching URL: ${url}`);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname });
});

app.post('/data', async (req, res) => {
  if (req.body && req.body.zip) {
    const zipCode = req.body.zip;
    console.log(`The zip code is ${zipCode}`);

    try {
      const data = await connectApi(zipCode);
      if (data.main) {
        console.log(`The date is ${new Date().toLocaleDateString()}`);
        console.log(`The temp is ${data.main.temp}`);
        res.json(data);
      } else {
        res.status(500).json({ error: 'Error fetching weather data: No main data found' });
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      res.status(500).json({ error: 'Error fetching weather data: ' + error.message });
    }
  } else {
    res.status(400).json({ error: 'No zip code provided' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
