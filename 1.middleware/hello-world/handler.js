module.exports = {
   main: function(event, context) {
     event.extensions.response.status(200);
     return JSON.stringify({
      "event": event,
      "context": context
     });
   }
 }