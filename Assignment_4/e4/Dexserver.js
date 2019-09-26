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
	const newRestaurant = new Restaurant({
		name: req.body.name,
		description: req.body.description,
		reservations: []
	});

	newRestaurant.save().then((restaurant) => {
		res.send(restaurant);
	}, (error) => {
		res.status(500).send(error);
	});

})


/// Route for getting all restaurant information.
// GET /restaurants
app.get('/restaurants', (req, res) => {
	// Add code here
	Restaurant.find().then((restaurants) => {
		res.send(restaurants);
	}, (error) => {
		res.status(500).send(error);
	});

})


/// Route for getting information for one restaurant.
// GET /restaurants/id
app.get('/restaurants/:id', (req, res) => {
	// Add code here
	const id = req.params.id;

	Restaurant.findOne({_id: id}).then((restaurant) => {
		res.send(restaurant);
	}, (error) => {
		res.status(500).send(error);
	});

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
	const id = req.params.id;
	const reservation = req.body;

	Restaurant.findOne({_id: id}).then((restaurant) => {
		restaurant.reservations.push(reservation);
		restaurant.save().then((restaurant) => {
			res.send({restaurant: restaurant, reservation: restaurant.reservations});
		}, (error) => {
			res.status(500).send(error);
		});
	}, (error) => {
		res.status(500).send(error);
	});

})


/// Route for getting information for one reservation of a restaurant (subdocument)
// GET /restaurants/id
app.get('/restaurants/:id/:resv_id', (req, res) => {
	// Add code here
	const id = req.params.id;
	const resv_id = req.params.resv_id;

	Restaurant.findOne({_id: id}).then((restaurant) => {
		const reservation = restaurant.reservations.id(resv_id);
		res.send(reservation);
	}, (error) => {
		res.status(500).send(error);
	});

})


/// Route for deleting reservation
// Returned JSON should have the restaurant database
//   document from which the reservation was deleted, AND the reservation subdocument deleted:
//   { "reservation": <reservation subdocument>, "restaurant": <entire restaurant document>}
// DELETE restaurant/<restaurant_id>/<reservation_id>
app.delete('/restaurants/:id/:resv_id', (req, res) => {
	// Add code here
	const id = req.params.id;
	const resv_id = req.params.resv_id;

	Restaurant.findOne({_id: id}).then((restaurant) => {
		const deleted = restaurant.reservations.id(resv_id);
		restaurant.reservations.remove(resv_id);
		restaurant.save().then((restaurant) => {
			res.send({reservation: deleted, restaurant: restaurant});
		}, (error) => {
			res.status(500).send(error);
		});
	}, (error) => {
		res.status(500).send(error);
	});
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
	const id = req.params.id;
	const resv_id = req.params.resv_id;

	Restaurant.findOne({_id: id}).then((restaurant) => {
		let reservation = restaurant.reservations.id(resv_id);
		reservation.time = req.body.time;
		reservation.people = req.body.people;
		restaurant.save().then((restaurant) => {
			res.send({reservation: reservation, restaurant: restaurant});
		}, (error) => {
			res.status(500).send(error);
		});
	}, (error) => {
		res.status(500).send(error);
	});
})


//////////

app.listen(port, () => {
	log(`Listening on port ${port}...`)
});
