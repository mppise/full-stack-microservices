module.exports = {
  main: function (event, context) {
    let res = event.extensions.response;
    console.log(event.data);
    const credstore = require('./credstore');
    credstore.writeKey('mpp', 'key1', { "date": new Date(), "data": event.data })
      .then((resp) => {
        // console.log("write", resp);
        credstore.readKey('mpp', 'key1').then((resp) => {
          // console.log("read", resp);
          res.status(200);
          return resp;
        }).catch((err) => console.log(err));
      }).catch((err) => console.log(err));
  }
}