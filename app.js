<!DOCTYPE html>
<html>
<head>
  <title>Buggy SF Weather App</title>
</head>
<body>
  <h1>San Francisco Weather</h1>

  <p id="time">Loading time...</p>
  <p id="weather">Loading weather...</p>

  <script>
    const timeEl = document.getElementById("time");
    const weatherEl = document.getElementById("weather");

    function updateTime() {
      // BUG: Uses user's local timezone, not San Francisco's timezone
      const now = new Date();
      timeEl.textContent = "Local time in San Francisco: " + now.toLocaleTimeString(undefined, { timeZone: "America/Los_Angeles", hour: "numeric", minute: "2-digit", second: "2-digit" });
    }

    async function getWeather() {
      try {
        // BUG: Longitude is slightly wrong
        const lat = 37.7749;
        const lon = -122.4194;
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit&wind_speed_unit=mph`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Weather API failed: ${response.status}`);
        }
        const data = await response.json();

        if (!data?.current_weather) {
          throw new Error("Missing current_weather in API response");
        }
        const temp = data.current_weather.temperature;
        const wind = data.current_weather.windspeed;

        // BUG: Says Fahrenheit, but Open-Meteo returns Celsius by default
        weatherEl.textContent = `Temperature: ${temp}°F, Wind: ${wind} mph`;
      } catch (err) {
        weatherEl.textContent = "Weather broke. Probably fog.";
      }
    }

    updateTime();
    getWeather();

    // BUG: Time only updates every 10 minutes
    setInterval(updateTime, 600000);
  </script>
</body>
</html>
