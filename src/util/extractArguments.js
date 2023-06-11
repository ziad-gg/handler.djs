function extractInteractionOptions(data) {
  const options = [];
  if (!data || !Array.isArray(data)) return []
  for (const option of data) {
    const name = option.name;
    let value;

    if (option.options) {
      value = extractInteractionOptions(option.options);
      options.push(...value);
    } else {
      value = option.value;
      options.push({ name, value });
    }
  }
  return options;
}

module.exports = extractInteractionOptions;
