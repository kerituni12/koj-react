export const camelToSnakeCase = (string = '') =>
  string.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

export const dashesCase = (string = '') => {
  return string
    .replace(/\W+/g, ' ')
    .split(/ |\B(?=[A-Z])/)
    .map((word) => word.toLowerCase())
    .join('-');
};

export function titleCase(string = '') {
  return string.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

export function camelCase(string = '') {
  return string.replace(/^([A-Z])|\W(\w)/g, function (match, p1, p2, offset) {
    if (p2) return p2.toUpperCase();
    return p1.toLowerCase();
  });
}

export function snakeCaseWithoutDot(string = '') {
  return string
    .replace(/\W+/g, ' ')
    .split(/ |\B(?=[A-Z])/)
    .map((word) => word.toLowerCase())
    .join('_');
}

export function snakeCase(string = '') {
  return string
    .replace(/[^a-zA-Z0-9_.]+/g, ' ')
    .split(/ |\B(?=[A-Z])/)
    .map((word) => word.toLowerCase())
    .join('_');
}

export function specialCaseToCamelCase(string = '', character = '') {
  const pattern = `[${character}][a-z]`;
  const regex = new RegExp(pattern, 'g');
  return string.replace(regex, (group) => group.slice(-1).toUpperCase());
}
export function pascalCase(string = '') {
  return (' ' + string).toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => {
    return chr.toUpperCase();
  });
}
