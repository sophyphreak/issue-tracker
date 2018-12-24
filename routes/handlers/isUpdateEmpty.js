const isUpdateEmpty = issue => {
  const issueLength = Object.keys(issue).length;
  let emptyStringCounter = 0;
  for (let property in issue) {
    if (!issue[property]) {
      emptyStringCounter++;
    }
  }
  if (emptyStringCounter >= issueLength - 1) {
    // -1 because _id should always have a value
    return true;
  }
  return false;
};

module.exports = isUpdateEmpty;
