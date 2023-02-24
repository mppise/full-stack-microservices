module.exports = {
  main: function (event, context) {
    let res = event.extensions.response;
    const credstore = require('./credstore');
    credstore.writeKey('mpp', 'key1', { "date": new Date() })
      .then((resp) => {
        console.log("write", resp);
        credstore.readKey('mpp', 'key1').then((resp) => {
          console.log("read", resp);
          res.send({
            "date": new Date(),
            "resp": resp
          });
        }).catch((err) => console.log(err));
      }).catch((err) => {
        console.log(err);
        // res.send({
        //   "date": new Date(),
        //   "err": err
        // });
      });
  }
}