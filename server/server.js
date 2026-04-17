const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const movieModel = require('./movie-model.js');

const app = express();

// Parse urlencoded bodies
app.use(bodyParser.json()); 

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, 'files')));

/* Task 1.2: Add a GET /genres endpoint:
   This endpoint returns a sorted array of all the genres of the movies
   that are currently in the movie model.
*/
/* Task 1.2: Add the GET /genres endpoint */
app.get('/genres', function (req, res) {
  // 1. Create a Set (a bucket that automatically removes duplicates)
  const genreSet = new Set();

  // 2. Loop through every movie in your model
  Object.values(movieModel).forEach(movie => {
    // 3. For every genre in that movie, add it to our bucket
    movie.Genres.forEach(genre => {
      genreSet.add(genre);
    });
  });

  // 4. Convert the bucket back to a normal Array and sort it
  const sortedGenres = Array.from(genreSet).sort();

  // 5. Send it back to the client
  res.send(sortedGenres);
});





/* Task 1.4: Extend the GET /movies endpoint:
   When a query parameter for a specific genre is given, 
   return only movies that have the given genre
 */
app.get('/movies', function (req, res) {
  // 1. Start with all movies as an array
  let movies = Object.values(movieModel)
  // 2. Look for a "genre" parameter in the URL (e.g., /movies?genre=Action)
  const selectedGenre = req.query.genre;
  // 3. If a genre was actually provided, filter the list
  if (selectedGenre) {
    movies = movies.filter(movie => movie.Genres.includes(selectedGenre));
  }
  // 4. Send the (filtered or full) list back
  res.send(movies);
})

// Configure a 'get' endpoint for a specific movie
app.get('/movies/:imdbID', function (req, res) {
  const id = req.params.imdbID
  const exists = id in movieModel
 
  if (exists) {
    res.send(movieModel[id])
  } else {
    res.sendStatus(404)    
  }
})

app.put('/movies/:imdbID', function(req, res) {

  const id = req.params.imdbID
  const exists = id in movieModel

  movieModel[req.params.imdbID] = req.body;
  
  if (!exists) {
    res.status(201)
    res.send(req.body)
  } else {
    res.sendStatus(200)
  }
  
})

app.listen(3000)

console.log("Server now listening on http://localhost:3000/")
