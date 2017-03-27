import express from 'express'

const app = express()
const cliend_id = 'vs5moi1agb6bb7opywk2chpimxxr76'

app.use('/', express.static('public'))

app.get('/search', (req, res) => {

})

app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${process.env.PORT || 3000}`)
})
