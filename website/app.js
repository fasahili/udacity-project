document.getElementById('zipForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const zipCode = document.getElementById('zip').value;
  const feelings = document.getElementById('feelings').value;
  console.log(`The zip code is ${zipCode}`);
  console.log(`Feelings: ${feelings}`);

  fetch('/data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ zip: zipCode })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error fetching weather data');
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
    const parent = document.getElementById('parent');
    parent.innerHTML = `
      <p>Date: ${new Date().toLocaleDateString()}</p>
      <p>Temperature: ${data.main.temp}°C</p>
      <p>Feelings: ${feelings}</p>
    `;
  })
  .catch(error => {
    console.error('Error:', error);
    const parent = document.getElementById('parent');
    parent.innerHTML = `<p>Error: ${error.message}</p>`;
  });
});