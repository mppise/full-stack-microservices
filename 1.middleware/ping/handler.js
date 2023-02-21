module.exports = {
  main: function (event, context) {
    event.extensions.response.status(200).send({
      "date": new Date(),
      "data": event || {},
      "context": context || {}
    });
  }
}