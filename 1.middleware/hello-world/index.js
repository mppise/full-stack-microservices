module.exports = {
   main: function(event, context) {
     return JSON.stringify({
      "event": event,
      "context": context
     });
   }
 }