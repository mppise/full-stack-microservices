module.exports = {
  main: function (event, context) {
    const res = event.extensions.response;
    res.status(200).send({
      "date": new Date(),
      "credstore": {
        "username": process.env['CREDSTORE_USERNAME'],
        "url": process.env['CREDSTORE_URL'],
        "encryption": JSON.parse(process.env['CREDSTORE_ENCRYPTION'])
      }
    });
  }
}