module.exports = {
  main: function (event, context) {
    const credstore = require('./credstore');
    credstore.writeKey('mpp', 'key1', { "date": new Date(), "data": event.data })
      .then((resp) => {
        // console.log("write", resp);
        credstore.readKey('mpp', 'key1').then((resp) => {
          console.log("read", resp);
          return resp;
        }).catch((err) => console.log(err));
      }).catch((err) => console.log(err));
  }
}