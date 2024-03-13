const { sbiCards } = require('./controller/sbiCards');
const { schema } = require('./middleware/validatSchema');
const checkSchemaValidation = require('./middleware/validation');

const routes = require('express').Router()

routes.get('/', (req, res) => {
    res.send('Hello World!');
  });


  routes.post('/test', checkSchemaValidation(schema), sbiCards);

module.exports = routes