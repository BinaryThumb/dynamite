var common = require('./common')
var DynamoRequest = require('./DynamoRequest')
var Builder = require('./Builder')

/**
 * @param {Object} options
 * @constructor
 * @extends {Builder}
 */
function GetItemBuilder(options) {
  Builder.call(this, options)
}
require('util').inherits(GetItemBuilder, Builder)

GetItemBuilder.prototype.execute = function () {
  var query = new DynamoRequest(this.getOptions())
    .setTable(this._tablePrefix, this._table)
    .returnConsumedCapacity()
    .setConsistent(this._isConsistent)
    .setHashKey(this._hashKey, true);
  if (this._rangeKey) {
    query.setRangeKey(this._rangeKey, true);
  }
  query.selectAttributes(this._attributes);
  var queryData = query.build()
  return this.request("getItem", queryData)
    .then(this.prepareOutput.bind(this))
    .fail(this.emptyResult)
    .setContext({data: queryData, isWrite: false})
    .fail(this.convertErrors)
    .clearContext()
}

module.exports = GetItemBuilder
