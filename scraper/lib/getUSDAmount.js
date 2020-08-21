module.exports = (str) => {
  let num = 0;

  const extractComma = (s) => {
    // runs recursively to remove any commas in string
    if (s.indexOf(',') === -1) {
      return s;
    }
    // grab index of ',' char -> construct new string
    const idx = s.indexOf(',');
    const newStr = s.substring(0, idx) + s.substring(idx + 1);

    return extractComma(newStr);
  };

  if (str.includes(',')) {
    str = extractComma(str);
  }

  // if gains are negative cut "-$" from string
  if (str.includes("-")) {
    num = Number(str.slice(2));
  } else {

    num = Number(str.slice(1));
  }

  return num.toFixed(2);
};