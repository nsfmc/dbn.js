const parser = require('./parser');

describe('parser', () => {

  it('imports something that always spews an object', () => {
    expect(parser('paper 100')).toBeInstanceOf(Object)
  })
})
