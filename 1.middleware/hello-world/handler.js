module.exports = {
   main: (event, context) =>{
     return JSON.stringify({
      "event": event,
      "context": context
     });
   }
 }