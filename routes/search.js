// this is basically just here to count form submissions,
// but conceivably it could be used for other things as well.

module.exports = search

// behave like as if the user had done
// <form method=get action="https://encrypted.google.com/search">
// <input name=q type=hidden value='site:npmjs.org'>

var fs = require('fs')
var path = require('path')
var logFile = path.resolve(__dirname, '../search.log')
var searches = []
var minInterval = 1000 // no more than 1ce per second.
var lastUpdated
var updating

function update () {
  if (updating || searches.length === 0) return
  if (lastUpdated && Date.now() - lastUpdated < minInterval) return
  updating = true

  // log the search queries we've gotten so far.
  var write = searches.slice(0)
  var now = Date.now()
  var out = write.map(function (s) {
    return now + ' ' + s + '\n'
  }).join('')
  searches.length = 0

  fs.appendFile(logFile, out, 'utf8', function (er, c) {
    updating = false
    if (er) {
      searches = write.concat(searches)
      return
    }
    lastUpdated = now
  })
}

function search (req, res) {
  req.model.load('search', req.query)
  req.model.end(function (er, result) {
    result.title = "search"
    result.pageSize = Math.ceil((result.search.hits.total || 0) / 10),
    result.page = parseInt(req.query.page) || 1
    result.q = req.query.q
    res.template('search.ejs', result)
  })
  update()
}
