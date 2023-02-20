module.exports = {
  main: function (event, context) {
    event.extensions.response.status(200).send({
      "context": context,
      "event": event.extensions.request || {}
    });
  }
}