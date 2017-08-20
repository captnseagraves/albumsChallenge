process.env.NODE_ENV = 'test';


const { suite, test } = require('mocha');
const request = require('supertest');
const knex = require('../knex');
const server = require('../app.js');

suite('Test suite for albums API', () => {

  before((done) => {
  knex.migrate.latest()
    .then(() => {
      done();
    })
    .catch((err) => {
      done(err);
    });
  });

  beforeEach((done) => {
    knex.seed.run()
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('GET /allArtists', (done) => {
    request(server)
      .get('/allArtists')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, [
        {
          "artistName": "Sylvan Esso"
        },
        {
          "artistName": "Led Zeppelin"
        },
        {
          "artistName": "The Beatles"
        }
      ], done);
    })

  test('GET /allArtistAlbums/Led%20Zeppelin', (done) => {
    request(server)
      .get('/allArtistAlbums/Led%20Zeppelin')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, [
        {
          "albumName": "IV"
        }
      ], done);
    })

  test('GET /album/IV', (done) => {
    request(server)
      .get('/album/IV')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, [
        {
          "albumName": "IV",
          "artistName": "Led Zeppelin",
          "genreName": "Hard Rock",
          "year": 1972
        }
      ] , done);
    })

  test('POST /newAlbum/An%20Awesome%20Wave/Alt-J/indie/2012', (done) => {

    request(server)
      .post('/newAlbum/An%20Awesome%20Wave/Alt-J/indie/2012')
      .set('Accept', 'application/json')
      .expect(200, 'Successfully created new album')
      .then(() => {
        request(server)
        .post('/newAlbum/An%20Awesome%20Wave/Alt-J/indie/2012')
        .set('Accept', 'application/json')
        .expect(400, 'Album already exists' , done);
      })
    })

  test('PATCH /changeAlbumName/IV/III', (done) => {
    request(server)
      .patch('/changeAlbumName/IV/III')
      .set('Accept', 'application/json')
      .expect(200, 'Successfully changed album name')
      .then(() => {
        request(server)
        .patch('/changeAlbumName/IV/III')
        .set('Accept', 'application/json')
        .expect(400, 'Album doesn\'t exist. Please, enter valid title.' , done);
      })
    })

  test('PATCH /changeAlbumArtist/IV/Pink%20Floyd', (done) => {
    request(server)
      .patch('/changeAlbumArtist/IV/Pink%20Floyd')
      .set('Accept', 'application/json')
      .expect(200, 'Successfully changed artist name', done)
  })


  test('PATCH /changeAlbumGenre/IV/Classic%20Rock', (done) => {
    request(server)
      .patch('/changeAlbumGenre/IV/Classic%20Rock')
      .set('Accept', 'application/json')
      .expect(200, 'Successfully changed genre name', done)
  })

  test('PATCH /changeAlbumYear/IV/1971', (done) => {
    request(server)
      .patch('/changeAlbumYear/IV/1971')
      .set('Accept', 'application/json')
      .expect(200, 'Successfully changed album year', done)
  })

  test('DELETE /deleteAlbum/IV', (done) => {
    request(server)
      .del('/deleteAlbum/IV')
      .set('Accept', 'application/json')
      .expect(200, 'Successfully deleted album')
      .then(() => {
        request(server)
        .del('/deleteAlbum/IV')
        .set('Accept', 'application/json')
        .expect(400, 'Album doesn\'t exist. Please, enter valid title.' , done);
      })
  })

})
