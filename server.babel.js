import express from 'express'
import request from 'request'
import bodyParser from 'body-parser'

const app = express()
const PORT = process.env.PORT || 3000
const cliend_id = 'vs5moi1agb6bb7opywk2chpimxxr76'

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
  const keyword = req.query.keyword
  // const offset = req.query.offset
  console.log('req:', req.query)
  console.log('keyword:', keyword)
  const url = 'https://api.twitch.tv/kraken/search/'
  const query = 'streams?q=' + keyword
  const limit  = '&limit=10'

  request({
    url: url + query + limit,
    headers: {
      'Client-ID': cliend_id,
      'Content-type': 'application/json',
    },
  }, function (error, response, body) {
    if (error) {
      console.log('Error:',error)
      res.send(400, 'Error in getting search result!')
      return
    }
    if (response.statusCode === 200) {
      const results = body
      res.status(200).send(results)
      return
    }
  })
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
