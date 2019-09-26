/* E2 Library - JS */

/*-----------------------------------------------------------*/
/* Starter code - DO NOT edit the code below. */
/*-----------------------------------------------------------*/

// global counts
let numberOfBooks = 0; // total number of books
let numberOfPatrons = 0; // total number of patrons

// global arrays
const libraryBooks = [] // Array of books owned by the library (whether they are loaned or not)
const patrons = [] // Array of library patrons.

// Book 'class'
class Book {
	constructor(title, author, genre) {
		this.title = title;
		this.author = author;
		this.genre = genre;
		this.patron = null; // will be the patron objet

		// set book ID
		this.bookId = numberOfBooks;
		numberOfBooks++;
	}

	setLoanTime() {
		// Create a setTimeout that waits 3 seconds before indicating a book is overdue

		const self = this; // keep book in scope of anon function (why? the call-site for 'this' in the anon function is the DOM window)
		setTimeout(function() {

			console.log('overdue book!', self.title)
			changeToOverdue(self);

		}, 3000)

	}
}

// Patron constructor
const Patron = function(name) {
	this.name = name;
	this.cardNumber = numberOfPatrons;

	numberOfPatrons++;
}


// Adding these books does not change the DOM - we are simply setting up the
// book and patron arrays as they appear initially in the DOM.
libraryBooks.push(new Book('Harry Potter', 'J.K. Rowling', 'Fantasy'));
libraryBooks.push(new Book('1984', 'G. Orwell', 'Dystopian Fiction'));
libraryBooks.push(new Book('A Brief History of Time', 'S. Hawking', 'Cosmology'));

patrons.push(new Patron('Jim John'))
patrons.push(new Patron('Kelly Jones'))

// Patron 0 loans book 0
libraryBooks[0].patron = patrons[0]
// Set the overdue timeout
libraryBooks[0].setLoanTime()  // check console to see a log after 3 seconds


/* Select all DOM form elements you'll need. */
const bookAddForm = document.querySelector('#bookAddForm');
const bookInfoForm = document.querySelector('#bookInfoForm');
const bookLoanForm = document.querySelector('#bookLoanForm');
const patronAddForm = document.querySelector('#patronAddForm');

/* bookTable element */
const bookTable = document.querySelector('#bookTable')
/* bookInfo element */
const bookInfo = document.querySelector('#bookInfo')
/* Full patrons entries element */
const patronEntries = document.querySelector('#patrons')

/* Event listeners for button submit and button click */

bookAddForm.addEventListener('submit', addNewBookToBookList);
bookLoanForm.addEventListener('submit', loanBookToPatron);
patronAddForm.addEventListener('submit', addNewPatron)
bookInfoForm.addEventListener('submit', getBookInfo);

/* Listen for click patron entries - will have to check if it is a return button in returnBookToLibrary */
patronEntries.addEventListener('click', returnBookToLibrary)

/*-----------------------------------------------------------*/
/* End of starter code - do *not* edit the code above. */
/*-----------------------------------------------------------*/


/** ADD your code to the functions below. DO NOT change the function signatures. **/


/*** Functions that don't edit DOM themselves, but can call DOM functions
     Use the book and patron arrays appropriately in these functions.
 ***/

// Adds a new book to the global book list and calls addBookToLibraryTable()
function addNewBookToBookList(e) {
	e.preventDefault();

	// Add book book to global array
	var newBookName = document.querySelector("#newBookName").value;
	var newBookAuthor = document.querySelector("#newBookAuthor").value;
	var newBookGenre = document.querySelector("#newBookGenre").value;

	var newBook = new Book(newBookName, newBookAuthor, newBookGenre);
	libraryBooks.push(newBook);

	// Call addBookToLibraryTable properly to add book to the DOM
	addBookToLibraryTable(newBook);

}

// Changes book patron information, and calls
function loanBookToPatron(e) {
	e.preventDefault();

	// Get correct book and patron
	var bookId = document.querySelector("#loanBookId").value;
	var cardNum = document.querySelector("#loanCardNum").value;
	var book = libraryBooks[bookId];


	// Add patron to the book's patron property
	book.patron = patrons[cardNum];


	// Add book to the patron's book table in the DOM by calling addBookToPatronLoans()
	addBookToPatronLoans(book);

	// Start the book loan timer.
	book.setLoanTime();
}

// Changes book patron information and calls returnBookToLibraryTable()
function returnBookToLibrary(e){
	e.preventDefault();
	// check if return button was clicked, otherwise do nothing.
	var srcElement = e.srcElement;

	if(srcElement.className == 'return') {
		var row = srcElement.parentElement.parentElement;
		var bookId = parseInt(row.children[0].innerText);
		var book = libraryBooks[bookId];

		// Call removeBookFromPatronTable()
		removeBookFromPatronTable(book);


		// Change the book object to have a patron of 'null'
		book.patron = null;
	}


}

// Creates and adds a new patron
function addNewPatron(e) {
	e.preventDefault();

	// Add a new patron to global array
	var name = document.querySelector("#newPatronName").value;
	var patron = new Patron(name);
	patrons.push(patron);

	// Call addNewPatronEntry() to add patron to the DOM
	addNewPatronEntry(patron);

}

// Gets book info and then displays
function getBookInfo(e) {
	e.preventDefault();

	// Get correct book
	var bookId = document.querySelector("#bookInfoId").value;
	var book = libraryBooks[bookId];


	// Call displayBookInfo()
	displayBookInfo(book);

}


/*-----------------------------------------------------------*/
/*** DOM functions below - use these to create and edit DOM objects ***/

// Adds a book to the library table.
function addBookToLibraryTable(book) {
	// Add code here
	const tr = document.createElement('tr');
	const td1 = document.createElement('td');
	const td2 = document.createElement('td');
	const td3 = document.createElement('td');
	const strong = document.createElement('strong');

	strong.innerText = book.title;
	td1.innerText = book.bookId;
	td2.appendChild(strong);

	tr.appendChild(td1);
	tr.appendChild(td2);
	tr.appendChild(td3);

	bookTable.children[0].appendChild(tr);
}


// Displays deatiled info on the book in the Book Info Section
function displayBookInfo(book) {
	// Add code here
	var bookNode = document.querySelector("#bookInfo");

	// update DOM using book info
	bookInfo.children[0].children[0].innerText = book.bookId;
	bookInfo.children[1].children[0].innerText = book.title;
	bookInfo.children[2].children[0].innerText = book.author;
	bookInfo.children[3].children[0].innerText = book.genre;
	bookInfo.children[4].children[0].innerText = book.patron ? book.patron.name : 'N/A';

}

// Adds a book to a patron's book list with a status of 'Within due date'.
// (don't forget to add a 'return' button).
function addBookToPatronLoans(book) {
	// Add code here
	const tr = document.createElement('tr');
	const td1 = document.createElement('td');
	const td2 = document.createElement('td');
	const td3 = document.createElement('td');
	const td4 = document.createElement('td');
	const strong = document.createElement('strong');
	const span = document.createElement('span');
	const button = document.createElement('button');

	// create first column of the table
	td1.innerText = book.bookId;

	// create second column of the table
	strong.innerText = book.title;
	td2.appendChild(strong);

	// create third column of the table
	span.className = 'green';
	span.innerText = 'Within due date';
	td3.appendChild(span);

	// create button
	button.className = 'return';
	button.innerText = 'return';
	td4.appendChild(button);

	// create the row element
	tr.appendChild(td1);
	tr.appendChild(td2);
	tr.appendChild(td3);
	tr.appendChild(td4);

	var patrons = document.querySelectorAll('.patron');
	var cardNum = document.querySelector("#loanCardNum").value;

	// find the correct patron and add book to patron's book list
	for(var i = 0; i < patrons.length; i++) {
		patron = patrons[i];

		// check if card number matches the patron's card number
		if(cardNum == patron.children[1].children[0].innerText) {
			// add the row to the patron's book list
			patron.children[3].children[0].appendChild(tr);
		}
	}

	for(var i = 1; i < bookTable.children[0].children.length; i++) {
		var row = bookTable.children[0].children[i];

		if(row.children[0].innerText == book.bookId) {
			row.children[2].innerText = cardNum;
		}
	}
}

// Adds a new patron with no books in their table to the DOM, including name, card number,
// and blank book list (with only the <th> headers: BookID, Title, Status).
function addNewPatronEntry(patron) {
	// Add code here
	var outerDiv = document.createElement('div');
	var p1 = document.createElement('p');
	var p2 = document.createElement('p');
	var h4 = document.createElement('h4');
	var table = document.createElement('table');
	var span1 = document.createElement('span');
	var span2 = document.createElement('span');

	// first p tag
	span1.className = 'bold';
	span1.innerText = patron.name;
	p1.appendChild(document.createTextNode('Name: '));
	p1.appendChild(span1);

	// second p tag
	span2.className = 'bold';
	span2.innerText = patron.cardNumber;
	p2.appendChild(document.createTextNode('Card Number: '));
	p2.appendChild(span2);

	// h4 tag
	h4.innerText = 'Books on loan:';

	// table
	table.className = 'patronLoansTable';
	table.innerHTML = (`
		<tr><th>BookID</th><th>Title</th><th>Status</th><th>Return</th></tr>
	`);

	outerDiv.className = 'patron';
	outerDiv.appendChild(p1);
	outerDiv.appendChild(p2);
	outerDiv.appendChild(h4);
	outerDiv.appendChild(table);

	patronEntries.appendChild(outerDiv);

}


// Removes book from patron's book table and remove patron card number from library book table
function removeBookFromPatronTable(book) {
	// Add code here
	var patron = book.patron;
	var cardNum = patron.cardNumber;

	// get the patron's book table
	var table = document.querySelectorAll('.patron')[cardNum].children[3].children[0];

	// go to the patron's book table and find the book and delete the row
	for(var i = 1; i < table.children.length; i++) {
		var row = table.children[i];

		if(row.children[0].innerText == book.bookId) {
			table.removeChild(row);
		}
	}

	// go to the book table and remove the patron card number
	for(var i = 1; i < bookTable.children[0].children.length; i++) {
		var row = bookTable.children[0].children[i];

		if(row.children[0].innerText == book.bookId) {
			row.children[2].innerText = '';
		}
	}
}

// Set status to red 'Overdue' in the book's patron's book table.
function changeToOverdue(book) {
	// Add code here
	var patron = book.patron;
	var cardNum = patron.cardNumber;

	// get the patron's book table
	var table = document.querySelectorAll('.patron')[cardNum].children[3].children[0];

	// go into the patron's book table, find book, and set status
	for(var i = 1; i < table.children.length; i++) {
		var row = table.children[i];

		if(row.children[0].innerText == book.bookId) {
			row.children[2].children[0].className = 'red';
			row.children[2].children[0].innerText = 'Overdue';
		}
	}
}
