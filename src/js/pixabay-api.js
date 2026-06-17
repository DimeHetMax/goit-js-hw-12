import axios from 'axios';
axios.defaults.baseURL = 'https://pixabay.com/api/';
const KEY = '36536171-20dffb6feebbd7a17f40a2c96';

const getImagesByQuery = async (query, page) => {
  try {
    const res = await axios.get('', {
      params: {
        key: KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page,
        per_page: 15
      },
    });
    return res.data
  } catch (error) {
    console.log(error);
  }
};

export default getImagesByQuery;
