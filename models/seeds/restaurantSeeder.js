const Restaurant = require('../Restaurant.js')
const restaurantList = require('./restaurant.json').results

const db = require('../../config/mongoose')

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('Seeding: restaurantSeeder ... ')
  Restaurant.create(restaurantList)
    .then(() => {
      console.log('Database seeding completed successfully.')
      db.close()
    })
    .catch((err) => console.log(err))
})
