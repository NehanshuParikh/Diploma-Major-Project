// controllers/jibbleController.js
import fetch from 'node-fetch';

export const testJibbleConnection = async (req, res) => {
  try {
    const response = await fetch('https://workspace.prod.jibble.io/v1/Members', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${req.jibbleToken}`,
        Accept: 'application/json',
      },
    });
    const data = await response.json();
    res.status(200).json({ message: 'Jibble API connected', data });
  } catch (error) {
    console.error('Error connecting to Jibble API:', error);
    res.status(500).json({ message: 'Failed to connect to Jibble API' });
  }
};
