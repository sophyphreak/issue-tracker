const isUpdateEmpty = issue => {
  let howManyProperties = 0;
  for (let property in issue) {
    if (issue[property]) {
      howManyProperties++;
    }
  }
  if (howManyProperties <= 3) {
    // 3 because _id, updated_on, and project should always have a value
    return true;
  }
  return false;
};

module.exports = isUpdateEmpty;
