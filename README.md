
Albums Challenge completed by Kevin Seagraves using Node.js, Express, Knex, and PostgreSQL.


To run the program execute the following commands in your terminal:

1. npm install

2. createdb albumsChallenge

3. knex migrate:latest

4. node dataMassage.js

(The first run of dataMassage.js populates the artist and genre tables, as well as albums that have both the first instance of an artist and a first instance of a genre. There will be errors for violation of a unique constraint. This is due to the asynchronous nature of the internal API calls, and making 100+ GET/POST requests in quick succession.)

5. Press "ctrl + c" to end the Node session

6. node dataMassage.js

(Since the artist and genre tables are now populated the handling for duplicate entries operates properly and populates the remaining albums in the albums table.)

7. "ctrl + c"

8. npm start

You can now make requests to the API using the the following structure.

9. http GET http://localhost:3000/allArtists

For a list of all artists:

GET /allArtists

For all albums by a particular artist:

GET /allArtistAlbums/:artistName

For all information about a particular album:

GET /album/:albumName

To create a new album:

POST /newAlbum/:albumName/:artistName/:genreName/:year

To change an album name:

PATCH /changeAlbumName/:albumName/:newAlbumName

To change an artist name on an album:

PATCH /changeAlbumArtist/:albumName/:newArtistName

To change a genre on an album:

PATCH /changeAlbumGenre/:albumName/:newGenreName

To change a year on an album:

PATCH /changeAlbumYear/:albumName/:newAlbumYear

To delete an album:

DELETE /deleteAlbum/:albumName


albumsChallege also has a test suite which can be run using the following commands:

1. createdb albumsChallenge_test

2. knex migrate:latest

3. knex seed:run

4. npm test
