module.exports = {
   main: function(event, context) {
    console.log(event.body);
    console.log(event.data);
    console.log(event.query);
    console.log(event.params);
    console.log(event.extensions);
    event.extensions.response.status(200).send({
      "context" : context
      // "event" : {
      //   "body" : event.body,
      //   "data" : event.data,
      //   "query" : event.query,
      //   "params" : event.params,
      //   "extensions" : event.extensions
      // }
    });
   }
 }