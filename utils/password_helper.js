const isValid = (candidate) => {
  if (!candidate) {
    return false;
  }
  if (candidate.length < 3) {
    return false;
  }
  return true;
};

module.exports = { isValid };
