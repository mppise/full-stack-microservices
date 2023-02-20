module.exports = {
  main: function (event, context) {
    event.extensions.response.status(200).send({
      "date": new Date(),
      "event": event || {},
      "context": context || {}
    });
  }
}