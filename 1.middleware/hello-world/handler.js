module.exports = {
   main: function(event, context) {
     return JSON.stringify({
      "event": event ? event : null,
      "context": context ? context : null
     });
   }
 }