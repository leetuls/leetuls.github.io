import axios from 'axios';

const Api = axios.create({
    // Base url of server side rest apis
    baseURL: 'http://3.26.222.225/api/',
    headers: {
        'Accept': 'application/json'
    }
});

export default Api;