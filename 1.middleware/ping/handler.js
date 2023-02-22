module.exports = {
  main: function (event, context) {
    const res = event.extensions.response;
    res.status(200).send({
      "date": new Date(),
      "envCredStore": process.env['CREDSTORE'],
      "envAlertNotification": process.env['ALERT_NOTIFICATION']
    });
  }
}