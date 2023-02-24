module.exports = {
  main: function (event, context) {
    let res = event.extensions.response;
    const credstore = require('./credstore');
    credstore.writeKey('mpp', 'key1', { "date": new Date() })
      .then((resp) => {
        console.log("write", resp);
        credstore.readKey('mpp', 'key1').then((resp) => {
          console.log("read", resp);
          res.status(200);
          return {
            "date": new Date(),
            "resp": resp,
            "data": event.data
          };
        }).catch((err) => console.log(err));
      }).catch((err) => console.log(err));
  }
}