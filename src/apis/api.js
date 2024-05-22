import axios from 'axios';

const Api = axios.create({
    // Base url of server side rest apis
    baseURL: 'https://do1tcjzuakcw1.cloudfront.net/api/',
    headers: {
        'Accept': 'application/json'
    }
});

export default Api;