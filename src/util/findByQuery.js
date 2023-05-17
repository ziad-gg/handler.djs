async function findObjectByQuery(query) {
    const objEntries = Object.entries(query);
    let string = '';

    await objEntries.forEach(async child => {
        const [name, value] = child;
        if (typeof value === 'string') {
            string += `e.${name} === '${value}' && `;
        } else {
            string += `e.${name} === ${value} && `;
        }
    });

    // Remove the trailing ' && ' from the string
    string = string.slice(0, -4);

    return string;
};

module.exports = findObjectByQuery