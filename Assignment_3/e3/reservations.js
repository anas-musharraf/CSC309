/* Reservations.js */ 
'use strict';

const log = console.log
const fs = require('fs');
const datetime = require('date-and-time')

const startSystem = () => {

	let status = {};

	try {
		status = getSystemStatus();
	} catch(e) {
		status = {
			numRestaurants: 0,
			totalReservations: 0,
			currentBusiestRestaurantName: null,
			systemStartTime: new Date(),
		}

		fs.writeFileSync('status.json', JSON.stringify(status))
	}

	return status;
}

const getSystemStatus = () => {
	updateSystemStatus()
	const status = fs.readFileSync('status.json')
	return JSON.parse(status)
}

/*********/

/* Helper functions to save JSON */
const updateSystemStatus = () => {
	let status = {}

	/* Add your code below */
	const allRestaurants = getAllRestaurants()
	const allReservations = getAllReservations()
	const oldStatus = JSON.parse(fs.readFileSync('status.json'))

	const busyRestaurant = allRestaurants.reduce((busiest, restaurant) => busiest.numReservations > restaurant.numReservations ? busiest : restaurant, allRestaurants[0]).name

    status = {
        numRestaurants: allRestaurants.length,
        totalReservations: allReservations.length,
        currentBusiestRestaurantName: busyRestaurant,
        systemStartTime: oldStatus.systemStartTime,
    }
	fs.writeFileSync('status.json', JSON.stringify(status))
}

const saveRestaurantsToJSONFile = (restaurants) => {
	/* Add your code below */
    fs.writeFileSync('restaurants.json', JSON.stringify(restaurants))
	updateSystemStatus()
};

const saveReservationsToJSONFile = (reservations) => {
	/* Add your code below */
	fs.writeFileSync('reservations.json',JSON.stringify(reservations))
	updateSystemStatus()
};

/*********/

// Should return an array
const addRestaurant = (name, description) => {
	// Check for duplicate names
	const allRestaurants = getAllRestaurants()
	for(let i = 0; i < allRestaurants.length; i++) {
        let restName = allRestaurants[i].name
        if (restName.localeCompare(name) == 0) {
            return []
        }
    }
	// if no duplicate names:
	const restaurant = {}
	restaurant['name'] = name
	restaurant['description'] = description
	restaurant['numReservations'] = 0
	allRestaurants.push(restaurant)
	saveRestaurantsToJSONFile(allRestaurants)
	return [restaurant];
}

const addReservation = (restaurant, time, people) => {
	
	/* Add your code below */
	const reservation = {};
	let allReservations = getAllReservations()
	let allRestaurants = getAllRestaurants()

	reservation['restaurant'] = restaurant
	reservation['time'] = new Date(time)
	reservation['people'] = people
	allReservations.push(reservation)

	allRestaurants.filter(cRestaurant => cRestaurant.name === restaurant)[0].numReservations += 1

	saveRestaurantsToJSONFile(allRestaurants)
	saveReservationsToJSONFile(allReservations)

	return reservation;

}


/// Getters - use functional array methods when possible! ///

// Should return an array - check to make sure restaurants.json exists
const getAllRestaurants = () => {
	/* Add your code below */
	try {
		const allRestaurants = fs.readFileSync('restaurants.json')
		return JSON.parse(allRestaurants)
	} catch (e) {
		return []
	}
};


const getRestaurtantByName = (name) => {
	/* Add your code below */
	const allRestaurants = getAllRestaurants()
	for(let i = 0; i < allRestaurants.length; i++) {
		let restName = allRestaurants[i].name
		if(restName.localeCompare(name) == 0) {
			return allRestaurants[i]
		}
	}
	return {}
};

// Should return an array - check to make sure reservations.json exists
 const getAllReservations = () => {
  /* Add your code below */
    try {
        const allReservations = fs.readFileSync('reservations.json')
        return JSON.parse(allReservations)
    } catch (e) {
        return []
    }
};

// Should return an array
const getAllReservationsForRestaurant = (name) => {
	/* Add your code below */
	const reservations = getAllReservations().filter(restaurant => restaurant.restaurant === name)
	reservations.sort((a,b) => {
		if(a < b) return -1;
		if(a > b) return 1;
		return 0;
	});

	return reservations
};


// Should return an array
const getReservationsForHour = (time) => {
	/* Add your code below */
	time = new Date(time)
	return getAllReservations().filter(reservation => datetime.subtract(new Date(reservation.time),time).toHours() < 1)
}


const checkOffEarliestReservation = (restaurantName) => {
	let allRestaurants = getAllRestaurants()
	let allReservations = getAllReservations().sort((a,b) => {
		if(a < b) return -1;
		if(a > b) return 1;
		return 0;
	});

	let checkedOffReservation = null;

	for(let i = 0; i < allReservations.length; i++) {
		if(restaurantName === allReservations[i].restaurant){
			checkedOffReservation = allReservations[i]
			allReservations.splice(i,1)
		}
	}
	allRestaurants.filter(restaurant => restaurant.name === restaurantName)[0].numReservations -= 1
	saveRestaurantsToJSONFile(allRestaurants)
	saveReservationsToJSONFile(allReservations)
 	return checkedOffReservation;
}


const addDelayToReservations = (restaurant, minutes) => {
	// Hint: try to use array.map()
	let reservationsForRest = getAllReservationsForRestaurant(restaurant)
	reservations.map(reservation => reservation.time = datetime.addMinutes(new Date(resv.time), minutes))
	return reservations
	
}

startSystem(); // start the system to create status.json (should not be called in app.js)

// May not need all of these in app.js..but they're here.
module.exports = {
	addRestaurant,
	getSystemStatus,
	getRestaurtantByName,
	getAllRestaurants,
	getAllReservations,
	getAllReservationsForRestaurant,
	addReservation,
	checkOffEarliestReservation,
	getReservationsForHour,
	addDelayToReservations
}
