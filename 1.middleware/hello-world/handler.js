module.exports = {
   main: function(event, context) {
     let x = JSON.stringify({
      "event": event,
      "context": context
     });
    console.log(x);
    return x;
   }
 }