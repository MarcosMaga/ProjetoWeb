const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    baseUrl: (path) => {
      return `${process.env.BASE_URL}/${path}`;
    }
};
  