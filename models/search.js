var client = require('www-npm-search')()
module.exports = search
var transform = require('./showprofile.js').transform

function search (params, cb) {
  var options = {query: {}}
  options.from = ((params.page - 1) * 10)
  options.fields = ["name", "description"]
  options.query.field = {"_all": params.q || '*'}
  client.searchRegistry(options, function(data) {
    return cb(null, JSON.parse(data))
  })
}