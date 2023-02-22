module.exports = {
  main: function (event, context) {
    const res = event.extensions.response;
    const credstore = require('./credstore');
    res.status(200).send({
      "date": new Date(),
      "credstore": {
        "username": process.env['CREDSTORE_USERNAME'],
        "password": process.env['CREDSTORE_PASSWORD'],
        "url": process.env['CREDSTORE_URL'],
        "encryption": JSON.parse(process.env['CREDSTORE_ENCRYPTION'])
      }
    });
  }
}