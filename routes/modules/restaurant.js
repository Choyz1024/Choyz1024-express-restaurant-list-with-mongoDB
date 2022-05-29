const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/Restaurant')

//new
router.get('/new', (req, res) => {
  return res.render('new')
})

router.post('/', (req, res) => {
  Restaurant.create(req.body)
    .then(() => res.redirect('/'))
    .catch((error) => console.log(error))
})

//detail
router.get('/:restaurantId', (req, res) => {
  const { restaurantId } = req.params
  Restaurant.findById(restaurantId)
    .lean()
    .then((restaurantData) => res.render('show', { restaurantData }))
    .catch((error) => console.log(error))
})

//delete
router.delete('/:restaurantId', (req, res) => {
  const { restaurantId } = req.params
  Restaurant.findByIdAndDelete(restaurantId)
    .then(() => res.redirect('/'))
    .catch((err) => console.log(err))
})


//edit
router.get('/:restaurantId/edit', (req, res) => {
  const { restaurantId } = req.params
  Restaurant.findById(restaurantId)
    .lean()
    .then((restaurantData) => res.render('edit', { restaurantData }))
    .catch((err) => console.log(err))
})

router.put('/:restaurantId', (req, res) => {
  const { restaurantId } = req.params
  Restaurant.findByIdAndUpdate(restaurantId, req.body)
    .then(() => res.redirect(`/restaurant/${restaurantId}`))
    .catch((err) => console.log(err))
})
module.exports = router
