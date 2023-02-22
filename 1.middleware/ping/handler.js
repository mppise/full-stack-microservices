module.exports = {
  main: function (event, context) {
    const res = event.extensions.response;
    const credstore = require('./credstore');
    credstore.writeKey('mpp', 'key1', { "date": new Date() })
      .then((resp) => {
        console.log(resp);
        res.status(200).send({
          "date": new Date(),
          "resp": resp,
          "credstore": {
            "username": process.env['CREDSTORE_USERNAME'],
            "password": process.env['CREDSTORE_PASSWORD'],
            "url": process.env['CREDSTORE_URL'],
            "encryption": JSON.parse(process.env['CREDSTORE_ENCRYPTION'])
          }
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(204).send({
          "date": new Date(),
          "err": err,
          "credstore": {
            "username": process.env['CREDSTORE_USERNAME'],
            "password": process.env['CREDSTORE_PASSWORD'],
            "url": process.env['CREDSTORE_URL'],
            "encryption": JSON.parse(process.env['CREDSTORE_ENCRYPTION'])
          }
        });
      });
  }
}