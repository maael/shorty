const pokemon = require('pokemon')
const superb = require('superb')

function getShort () {
  return `${superb.random()}-${pokemon.random()}`.toLowerCase()
}

module.exports = {
  getShort
}
