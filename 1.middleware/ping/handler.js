module.exports = {
  main: function (event, context) {
    const res = event.extensions.response;
    res.status(200).send({
      "date": new Date(),
      "env": JSON.stringify(process.env)
    });
  }
}