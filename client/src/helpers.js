const convertIsoDateToNormal = isoDate => {
  const date = new Date(isoDate);

  return `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`;
};

module.exports = {
  convertIsoDateToNormal
};
