const axios = require('axios');

const getStravaAthlete = async (accessToken) => {
  const response = await axios.get('https://www.strava.com/api/v3/athlete', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};

module.exports = {
  getStravaAthlete,
};
