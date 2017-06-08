const tokenizer = require('./tokenizer');

describe('tokenizer', () => {

  it('tokenizes a command with correct number of tokens', () => {
    expect(tokenizer('paper 100')).toHaveLength(3);
  });

  it('matches a line command', () => {
    expect(tokenizer('line 30 21 22 50')).toMatchSnapshot();
  });

  it('matches a complex set command', () => {
    expect(tokenizer('set v (23 + 10)')).toMatchSnapshot();
  })
  it('tokenizes a set command', () => {
    expect(tokenizer('set v (23 + 10)')).toHaveLength(11);
  })
  it('matches a multiline set command', () => {
    expect(tokenizer(`set v \n(23 + 10)`)).toMatchSnapshot();
  });
})
