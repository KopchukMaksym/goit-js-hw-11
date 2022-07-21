'use strict';
import axios from 'axios';
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '28740529-a5c8b6a6d9e9b336b906aaf7a';

export const fetchPhotosByQuery = (query, page) => {
  return axios.get(`${BASE_URL}`, {
    params: {
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: page,
      per_page: 40,
    },
  });
};
