module.exports = {
  main: function (event, context) {
    event.extensions.response.status(200).send({
      "context": context,
      "request": event.extentions.request,
      "response": event.extentions.response
    });
  }
}