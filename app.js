const express = require('express')
const exphbs = require('express-handlebars')
// const bodyParser = require('body-parser')
const Restaurant = require('./models/Restaurant')

require('./config/mongoose')

const app = express()

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// index
app.get('/', (req, res) => {
  Restaurant.find({})
    .lean()
    .then((restaurantsData) => res.render('index', { restaurantsData }))
    .catch((err) => console.log(err))
})

app.get('/search', (req, res) => {
  if (!req.query.keywords) {
    res.redirect('/')
    return
  }

  const input = req.query.keywords
  const keyword = input.trim().toLowerCase()

  Restaurant.find({})
    .lean()
    .then((restaurantsData) => {
      const filterRestaurantsData = restaurantsData.filter(
        (data) => data.name.toLowerCase().includes(keyword) || data.category.includes(keyword)
      )
      res.render('index', { restaurantsData: filterRestaurantsData, input })
    })
    .catch((err) => console.log(err))
})

// new
app.get('/restaurant/new', (req, res) => {
  return res.render('new')
})

app.post('/restaurant', (req, res) => {
  Restaurant.create(req.body)
    .then(() => res.redirect('/'))
    .catch((err) => console.log(err))
})

//detail
app.get('/restaurant/:restaurantId', (req, res) => {
  const { restaurantId } = req.params // ES6  Destructuring assignment
  Restaurant.findById(restaurantId)
    .lean()
    .then((restaurantData) => res.render('show', { restaurantData }))
    .catch((error) => console.log(error))
})

app.post('/restaurant/:restaurantId', (req, res) => {
  const { restaurantId } = req.params
  Restaurant.findByIdAndDelete(restaurantId)
    .then(() => res.redirect('/'))
    .catch((err) => console.log(err))
})

// edit
app.get('/restaurant/:restaurantId/edit', (req, res) => {
  const { restaurantId } = req.params
  Restaurant.findById(restaurantId)
    .lean()
    .then((restaurantData) => res.render('edit', { restaurantData }))
    .catch((err) => console.log(err))
})

app.post('/restaurant/:restaurantId/edit', (req, res) => {
  const { restaurantId } = req.params
  Restaurant.findByIdAndUpdate(restaurantId, req.body)
    .then(() => res.redirect(`/restaurant/${restaurantId}`))
    .catch((err) => console.log(err))
})

app.listen(3000, () => {
  console.log('Express is listen on http://localhost:3000')
})
