import { Buffer } from 'node:buffer';

module.exports = {
  main: function (event, context) {
    event.extensions.response.status(200).send({
      "date": new Date(),
      "data": Buffer.from(event.data).toJSON(),
      "context": context || {}
    });
  }
}