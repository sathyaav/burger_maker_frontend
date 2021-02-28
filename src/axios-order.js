import axios from 'axios';

const instance= axios.create({
  baseURL: 'https://burger-maker-52700-default-rtdb.firebaseio.com/'
});

export default instance;
