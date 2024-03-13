// import axios from 'axios';
const axios = require('axios')

const headers = {
    'IDENTIFIER_1': "",
    "IDENTIFIER_2": ""
};

const bodyData = {
    "user": "",
    "pass": ""
};

const accessToken = async () => {
    try {
        // Make a POST request with headers and body data
      let responseData =  await axios.post('https://{domain}/api-gateway/resource/oAuth/tokenGenPartner', bodyData, { headers });
      const {status ,statusCode , data , message } = responseData
      const {accessToken , xSbicUserFgp} = data

    } catch (err) {

    }
}




