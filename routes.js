
const { lead_generator } = require('./controller/lead-generator');
const { schema } = require('./middleware/validatSchema');
const checkSchemaValidation = require('./middleware/validation');

const routes = require('express').Router()

routes.get('/', (req, res) => {
    res.send('Hello World!');
  });


  routes.post('/test', checkSchemaValidation(schema), lead_generator);

module.exports = routes