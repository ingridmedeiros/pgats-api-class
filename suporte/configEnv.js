require ('dotenv').config();

module.exports = {
    URLS: {
        BASE_URL: process.env.URL,
        ENDPOINT_USERS: '/users'
    },
    HEADERS: {
        CONTENT_TYPE: {'accept': 'application/json'}
    }
}