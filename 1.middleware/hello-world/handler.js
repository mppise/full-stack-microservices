module.exports = {
   main: function(event, context) {
    console.log('body', JSON.stringify(event.body));
    console.log('data', JSON.stringify(event.data));
    console.log('params', JSON.stringify(event.params));
    console.log('extensions', JSON.stringify(event.extensions));
    event.extensions.response.status(200).send({
      "context" : context,
      "event" : {
        "body" : event.body,
        "data" : event.data,
        "params" : event.params,
        "extensions" : event.extensions
      }
    });
   }
 }