import express from 'express'
import request from 'request'
import bodyParser from 'body-parser'

const app = express()
// Support encoded bodies
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 'no-cache')
  next()
})

app.use('/', express.static('public'))

app.get('/search', (req, res) => {
  // const keyword = req.body.keyword
  // console.log('req:', req.body)
  // console.log('keyword:', keyword)
  const cliend_id = 'vs5moi1agb6bb7opywk2chpimxxr76'
  const url = 'https://api.twitch.tv/kraken/search/streams?q='
  const keyword = 'startcraft'

  request({
    url: url + keyword,
    headers: {
      'Client-ID': cliend_id,
      'Content-type': 'application/json',
    },
  }, function (error, response, body) {
    if (error) {
      res.send(400, 'Error in getting search result!')
    }
    if (response.statusCode === 200) {
      const results = body
      res.send(200, results)
    }
  })
})

app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${process.env.PORT || 3000}`)
})
