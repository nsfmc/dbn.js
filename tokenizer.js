const tokenTypes = [
  {kind: 'openParen', test: input => /^\($/.test(input)},
  {kind: 'closeParen', test: input => /^\)$/.test(input)},
  {kind: 'openBracket', test: input => /^\{$/.test(input)},
  {kind: 'closeBracket', test: input => /^\}^/.test(input)},
  {kind: 'questionMark', test: input => /^\?^/.test(input)},
  {kind: 'identifier', test: input => /^[a-zA-Z]+$/.test(input)},
  {kind: 'number', test: input => /^[0-9]+$/.test(input)},
  {kind: 'plusSign', test: input => /^\+$/.test(input)},
  {kind: 'minusSign', test: input => /^-$/.test(input)},
  {kind: 'multiplySign', test: input => /^\*$/.test(input)},
  {kind: 'divideSign', test: input => /^\/$/.test(input)},
  {kind: 'newline', test: input => /^\n$/.test(input)},
  {kind: 'whitespace', test: input => /^\s$/.test(input)},
];

const assignTokens = (token, index, allTokens) => {
  const matchedTokens = tokenTypes.filter(type => type.test(token.value))[0]
  const kind = matchedTokens
    ? matchedTokens.kind
    : 'unknown';

  return Object.assign({}, token, {kind});
}

const mergeTokens = (output, currentToken, index, allTokens) => {
  if (output.length === 0) {
    return [currentToken];
  } else {
    const previous = output[output.length - 1];
    if (previous.kind === currentToken.kind) {
      const previousToken = output.pop();
      const mergedToken = Object.assign({}, previousToken, {
        value: previousToken.value + currentToken.value,
        end: currentToken.end,
        loc: {
          start: previousToken.start,
          end: currentToken.end,
        }
      })
      output.push(mergedToken);
    } else {
      output.push(currentToken);
    }
    return output;
  }
}

const withPositions = (output, current, idx, arr) => {
  const firstToken = output.length === 0;
  const previousToken = output[output.length - 1];
  const previousLine = firstToken ? 0 : previousToken.loc.end.line;
  const startsLine = firstToken ? true : previousToken.value === `\n`

  const pos = {
    start: firstToken
      ? 0
      : previousToken.end,
    end: firstToken
      ? current.value.length
      : previousToken.end + current.value.length,
    loc: {
      start: {
        line: firstToken
          ? 0
          : startsLine
            ? previousLine + 1
            : previousLine,
        column: firstToken
          ? 0
          : startsLine
            ? 0
            : previousToken.loc.end.column,
      },
      end: {
        line: firstToken
          ? 0
          : startsLine
            ? previousLine + 1
            : previousLine,
        column: firstToken
          ? current.value.length
          : startsLine
            ? current.value.length
            : previousToken.loc.end.column + current.value.length,
      }
    }
  };

  const positioned = Object.assign({}, current, pos)
  output.push(positioned)

  return output
}

const toValues = value => ({value});

const tokenize = input => {
  const tokens = input
    .split('')
    .map(toValues)
    .reduce(withPositions, [])
    .map(assignTokens)
    .reduce(mergeTokens, [])
  return tokens;
}

module.exports = tokenize
