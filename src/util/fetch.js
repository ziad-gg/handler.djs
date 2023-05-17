async function fetchApp(path) {
  return (await import(path)).default
}

module.exports = fetchApp
  