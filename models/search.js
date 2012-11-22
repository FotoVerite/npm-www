var client = require('www-npm-search')()
module.exports = search
var transform = require('./showprofile.js').transform

function search (params, cb) {
  var options = {query: { query_string : {} }}
  options.from = ((params.page - 1) * 10)
  options.fields = ["name", "description", 'maintainers']
  options.query.query_string.fields = ["description", "name^5", "author.name^20", "maintainers.name", "readme"]
  options.query.query_string.query = params.q || '*'
  client.searchRegistry(options, function(data) {
    return cb(null, JSON.parse(data))
  })
}