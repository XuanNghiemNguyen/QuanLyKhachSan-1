const notification = (_show, _title, _message) => {
  return {
    show: _show || false,
    title: _title || "",
    message: _message || "",
  }
}
module.exports = {
  notification,
}
