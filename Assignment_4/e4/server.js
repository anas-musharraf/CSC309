/* E4 server.js */
'use strict';
const log = console.log;

const express = require('express')
const bodyParser = require('body-parser')
const { ObjectID } = require('mongodb')

// Mongoose
const { mongoose } = require('./db/mongoose');
const { Restaurant } = require('./models/restaurant')

// Express
const port = process.env.PORT || 3000
const app = express();
app.use(bodyParser.json());

/// Route for adding restaurant, with *no* reservations (an empty array).
/* 
Request body expects:
{
	"name": <restaurant name>
	"description": <restaurant description>
}
Returned JSON should be the database document added.
*/
// POST /restaurants

app.post('/restaurants', (req, res) => {
	// Add code here
	const restaurant = new Restaurant ({
		name:req.body.name,
		description:req.body.description,
		reservations:[]
	})
	restaurant.save().then((rest) => {
		res.send(rest)
	}).catch((error) => {
		res.status(500).send(error)
	})
})


/// Route for getting all restaurant information.
// GET /restaurants
app.get('/restaurants', (req, res) => {
	// Add code here
	Restaurant.find().then((rests) => {
		res.send(rests)
	}).catch((error) => {
		res.status(500).send(error)
	})
})


/// Route for getting information for one restaurant.
// GET /restaurants/id
app.get('/restaurants/:id', (req, res) => {
	// Add code here
	Restaurant.findOne({_id:req.params.id}).then((restaurant) => {
		res.send(restaurant)
	}).catch((error) => {
		res.status(500).send(error)
	})
})


/// Route for adding reservation to a particular restaurant.
/* 
Request body expects:
{
	"time": <time>
	"people": <number of people>
}
*/
// Returned JSON should have the restaurant database 
//   document that the reservation was added to, AND the reservation subdocument:
//   { "reservation": <reservation subdocument>, "restaurant": <entire restaurant document>}
// POST /restaurants/id

app.post('/restaurants/:id', (req, res) => {
	// Add code here
	const res_id = req.params.id
	const newReservation = req.body

	Restaurant.findOne({_id: res_id}).then((chosenRestaurant) => {
		chosenRestaurant.reservations.push(newReservation)
		chosenRestaurant.save().then((rest) => {
			res.send({reservation: rest.reservations, restaurant: rest})
		}).catch((error) => {
			res.status(500).send(error)
		})
	}).catch((error) => {
		res.status(500).send(error)
	})
})


/// Route for getting information for one reservation of a restaurant (subdocument)
// GET /restaurants/id

app.get('/restaurants/:id/:resv_id', (req, res) => {
	// Add code here

	Restaurant.findOne({_id:req.params.id}).then((rest) => {
		const resv = rest.reservations.id(req.params.resv_id)
		res.send(resv)
	}).catch((error) => {
		res.status(500).send(error)
	})
})


/// Route for deleting reservation
// Returned JSON should have the restaurant database
//   document from which the reservation was deleted, AND the reservation subdocument deleted:
//   { "reservation": <reservation subdocument>, "restaurant": <entire restaurant document>}
// DELETE restaurant/<restaurant_id>/<reservation_id>
app.delete('/restaurants/:id/:resv_id', (req, res) => {
	// Add code here
	Restaurant.findOne({_id:req.params.id}).then((rest) => {
		const removed = rest.reservations.id(req.params.resv_id)
		rest.reservations.remove(req.params.resv_id)
		rest.save().then((result) => {
			res.send({reservation: removed, restaurant: rest})
		}).catch((error) => {
			res.staus(500).send(error)
		})
	}).catch((error) => {
		res.status(500).send(error)
	})
})


/// Route for changing reservation information
/* 
Request body expects:
{
	"time": <time>
	"people": <number of people>
}
*/
// Returned JSON should have the restaurant database
//   document in which the reservation was changed, AND the reservation subdocument changed:
//   { "reservation": <reservation subdocument>, "restaurant": <entire restaurant document>}
// PATCH restaurant/<restaurant_id>/<reservation_id>
app.patch('/restaurants/:id/:resv_id', (req, res) => {
	// Add code here
	Restaurant.findOne({_id:req.params.id}).then((rest) => {
		let resv = rest.reservations.id(req.params.resv_id)
		resv.time = req.body.time
		resv.people = req.body.people
		rest.save().then((patchedRest) => {
			res.send({reservation: resv, restaurant: patchedRest})
		}).catch((error) => {
			res.status(500).send(error)
		})
	}).catch((error) => {
		res.status(500).send(error)
	})
})




//////////

app.listen(port, () => {
	log(`Listening on port ${port}...`)
});
