// utils/jibbleApi.js
import fetch from 'node-fetch';

const JIBBLE_API_KEY_ID = process.env.JIBBLE_API_KEY_ID;
const JIBBLE_API_KEY_SECRET = process.env.JIBBLE_API_KEY_SECRET;
const TOKEN_URL = 'https://auth.jibble.io/oauth/token';

let accessToken = null;

export const getJibbleAccessToken = async () => {
  try {
    const response = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: JIBBLE_API_KEY_ID,
        client_secret: JIBBLE_API_KEY_SECRET,
      }),
    });
    const data = await response.json();
    
    if (data.access_token) {
      accessToken = data.access_token;
      console.log('Jibble setup successfully!');
      return accessToken;
    } else {
      throw new Error('Failed to get Jibble access token');
    }
  } catch (error) {
    console.error('Error fetching Jibble access token:', error);
    return null;
  }
};
