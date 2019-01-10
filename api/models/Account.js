/**
 * Accounts.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    publicKey: { type: 'string', required: true, },
    secretKey: { type: 'string', },
    lastSequence: { type: 'number', },
  },

};

