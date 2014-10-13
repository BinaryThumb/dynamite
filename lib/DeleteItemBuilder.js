var common = require('./common')
var DynamoRequest = require('./DynamoRequest')
var Builder = require('./Builder')

/**
 * @param {Object} options
 * @constructor
 * @extends {Builder}
 */
function DeleteItemBuilder(options) {
  Builder.call(this, options)
}
require('util').inherits(DeleteItemBuilder, Builder)

DeleteItemBuilder.prototype.execute = function () {
  var query = new DynamoRequest(this.getOptions())
    .setTable(this._tablePrefix, this._table)
    .returnConsumedCapacity()
    .setHashKey(this._hashKey, true);

  if (this._rangeKey) {
    query.setRangeKey(this._rangeKey, true);
  }

  query.setExpected(this._conditions);

  var queryData = query.build();

  return this.request("deleteItem", queryData)
    .then(this.prepareOutput.bind(this))
    .setContext({data: queryData, isWrite: true})
    .fail(this.convertErrors)
    .clearContext()
}

module.exports = DeleteItemBuilder
