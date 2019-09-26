/* E3 app.js */
'use strict';

const log = console.log
const yargs = require('yargs').option('addRest', {
    type: 'array' // Allows you to have an array of arguments for particular command
  }).option('addResv', {
    type: 'array' 
  }).option('addDelay', {
    type: 'array' 
  })

const reservations = require('./reservations');
const datetime = require('date-and-time')

const yargs_argv = yargs.argv
//log(yargs_argv) // uncomment to see what is in the argument array

if ('addRest' in yargs_argv) {
	const args = yargs_argv['addRest']
	const rest = reservations.addRestaurant(args[0], args[1]);	
	if (rest.length > 0) {
		/* complete */
		log(`Added restaurant ${rest[0].name}.`);
	} else {
		/* complete */
		log(`Duplicate restaurant not added.`)
	}
}
if ('addResv' in yargs_argv) {
	const args = yargs_argv['addResv']
	const resv = reservations.addReservation(args[0], args[1], args[2]);

	// Produce output below
	log(`Added reservation at ${resv.restaurant} on ${datetime.format(resv.time, 'MMMM DD YYYY at h:mm A')} for ${resv.people} people.`);
}

if ('allRest' in yargs_argv) {
	const restaurants = reservations.getAllRestaurants(); // get the array
	
	// Produce output below
	for(let i = 0; i < restaurants.length; i++) {
		let restaurant = restaurants[i]
		log(`${restaurant.name}: ${restaurant.description} - ${restaurant.numReservations} active reservations.`)
	}
}

if ('restInfo' in yargs_argv) {
	const restaurants = reservations.getRestaurtantByName(yargs_argv['restInfo']);

	// Produce output below
	log(`${restaurants.name}: ${restaurants.description} - ${restaurants.numReservations} active reservations.`);
}

if ('allResv' in yargs_argv) {
	const restaurantName = yargs_argv['allResv']
	const reservationsForRestaurant = reservations.getAllReservationsForRestaurant(restaurantName); // get the arary
	
	// Produce output below
	log(`Reservations for ${restaurantName}:`)

	for(let i = 0; i < reservationsForRestaurant.length; i++) {
		log(`- ${datetime.format(new Date(reservationsForRestaurant[i].time), 'MMM. DD YYYY, h:mm A')}, table for ${reservationsForRestaurant[i].people}`)
	}
}

if ('hourResv' in yargs_argv) {
	const time = yargs_argv['hourResv']
	const reservationsForRestaurant = reservations.getReservationsForHour(time); // get the arary
	
	// Produce output below
	log(`Reservations in the next hour:`)
	for(let i = 0; i < reservationsForRestaurant.length; i++) {
		log(`- ${reservationsForRestaurant[i].restaurant}: ${datetime.format(new Date(reservationsForRestaurant[i].time), 'MMM. DD YYYY, h:mm A')}, table for ${reservationsForRestaurant[i].people}`);
	}
}

if ('checkOff' in yargs_argv) {
	const restaurantName = yargs_argv['checkOff']
	const earliestReservation = reservations.checkOffEarliestReservation(restaurantName); 
	
	// Produce output below
	log(`Checked off reservation on ${datetime.format(new Date(earliestReservation.time), 'MMM. DD YYYY, h:mm A')}, table for ${earliestReservation.people}`)
}

if ('addDelay' in yargs_argv) {
	const args = yargs_argv['addDelay']
	const resv = reservations.addDelayToReservations(args[0], args[1]);	

	// Produce output below
	log(`Reservations for ${args[0]}:`)
	for(let i = 0; i < resv.length; i++) {
		log(`- ${datetime.format(new Date(resv[i].time), 'MMM. DD YYYY, h:mm A')}, table for ${resv[i].people}`)
	}

	
}

if ('status' in yargs_argv) {
	const status = reservations.getSystemStatus()

	// Produce output below
	log(`Number of restaurants: ${status.numRestaurants}`)
	log(`Number of total reservations: ${status.totalReservations}`)
	log(`Busiest restaurant: ${status.currentBusiestRestaurantName}`)
	log(`System started at: ${datetime.format(new Date(status.systemStartTime), 'MMM DD, YYYY, h:mm A')}`)

}

