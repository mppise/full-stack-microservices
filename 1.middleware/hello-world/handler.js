module.exports = {
   main: function(event, context) {
    console.log(event);
    console.log(context);
    event.extensions.response.status(200).send({
      "context" : context,
      "event" : {
        "body" : event.body,
        "data" : event.data,
        "query" : event.query,
        "params" : event.params,
      }
    });
   }
 }