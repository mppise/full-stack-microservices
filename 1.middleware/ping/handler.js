module.exports = {
  main: function (event, context) {
    const res = event.extensions.response;
    let credstore = {};
    Object.keys(process.env).forEach((e, i) => {
      if (e.indexOf('CREDSTORE') >= 0)
        credstore[e] = Buffer.from(process.env[e], 'base64').toString('utf-8');
    });
    res.status(200).send({
      "date": new Date(),
      "env": credstore
    });
  }
}