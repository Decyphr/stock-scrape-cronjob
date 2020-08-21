module.exports = () => {
  const dateTime = new Date();
  const month = dateTime.getUTCMonth() + 1;
  const day = dateTime.getUTCDate();
  const year = dateTime.getUTCFullYear().toString();

  return month + "/" + day + "/" + year.slice(-2);
}