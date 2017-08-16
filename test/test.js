const chai = require('chai')
chai.use(require('chai-http'))
const app = require('../app')
const expect = require('chai').expect
const request = require('supertest');
const knex = require('../knex');

let id = 1

describe('GET /:id', function() {
  it('respond with json', function() {
    return request(app)
      .get(`/:${id}`)
      .set('Accept', 'application/json')
      .expect(200)
      .then(response => {
          assert(response.body.artistName, 'What Now')
      })
  });
});
