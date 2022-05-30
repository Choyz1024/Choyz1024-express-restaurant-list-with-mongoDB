const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/Restaurant')

router.get('/', (req, res) => {
  Restaurant.find({})
    .lean()
    .sort('name')
    .then((restaurantsData) => res.render('index', { restaurantsData, sortKey: 'A > Z' }))
    .catch((err) => console.log(err))
})

router.post('/', (req, res) => {
  const sort = req.body.sort || 'name'
  const sortKey = {
    name: 'A > Z',
    '-name': 'Z > A',
    category: '類型',
    location: '地區',
    '-rating': 'Rating',
  }
  Restaurant.find({})
    .lean()
    .sort(sort)
    .then((restaurantsData) => res.render('index', { restaurantsData, sortKey: sortKey[sort] }))
    .catch((err) => console.log(err))
})

router.get('/search', (req, res) => {
  if (!req.query.keywords) {
    res.redirect('/')
    return
  }

  const input = req.query.keywords
  const keyword = input.trim().toLowerCase()

  Restaurant.find({
    $or: [{ name: { $regex: keyword, $options: '$i' } }, { category: { $regex: keyword, $options: '$i' } }],
  })
    .lean()
    .sort('name')
    .then((restaurantsData) => {
      res.render('index', { restaurantsData, sortKey: 'A > Z', input })
    })
    .catch((err) => console.log(err))
})

router.post('/search', (req, res) => {
  const input = req.body.keywords
  const keyword = input.trim().toLowerCase()
  const sort = req.body.sort || 'name'
  const sortKey = {
    name: 'A > Z',
    '-name': 'Z > A',
    category: '類型',
    location: '地區',
    '-rating': 'Rating',
  }
  Restaurant.find({
    $or: [{ name: { $regex: keyword, $options: '$i' } }, { category: { $regex: keyword, $options: '$i' } }],
  })
    .lean()
    .sort(sort)
    .then((restaurantsData) => res.render('index', { restaurantsData, sortKey: sortKey[sort], input }))
    .catch((err) => console.log(err))
})

module.exports = router
