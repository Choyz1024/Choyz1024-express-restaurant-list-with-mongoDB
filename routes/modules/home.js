const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/Restaurant')

router.get('/', (req, res) => {
  Restaurant.find({})
    .lean()
    .then((restaurantsData) => res.render('index', { restaurantsData }))
    .catch((err) => console.log(err))
})

router.post('/', (req, res) => {
  const sort = req.body.sort  || 'name'
  const sortKey = {
    'name': 'A->Z',
    '-name': 'Z->A',
    'category': '類型',
    'rating': 'Rating',
  }
  Restaurant.find({})
    .lean()
    .sort(sort)
    .then((restaurantsData) => res.render('index', { restaurantsData, sortKey : sortKey[sort] }))
    .catch((err) => console.log(err))
})

router.get('/search', (req, res) => {
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

module.exports = router