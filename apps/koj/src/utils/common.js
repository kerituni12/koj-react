import { TypeEnum } from '@/modules/challenge/configs/constant.config';

export function getLastPathSegments(path) {
  return path.substring(path.lastIndexOf('/') + 1);
}

export function isEditPage(path) {
  return getLastPathSegments(path) === 'edit';
}

export function sortInputDesc(a, b) {
  if (a < b) {
    return 1;
  }
  return -1;
}

export function parseType(string = '') {
  const regex =
    /^(OBJECT|ARRAY)((\[|{)([A-Za-z@][A-Za-z0-9{}[\]())@ ]*)(}|\]))?(\(([A-Za-z0-9 ])\))?$/;
  const result = string.match(regex);
  if (result) {
    return {
      type: result[1],
      encapsulated: result[4],
      size: result[7],
    };
  }
  return null;
}

export function typeFromString(string) {
  switch (string) {
    case TypeEnum.INTEGER:
    case TypeEnum.CHAR:
    case TypeEnum.STRING:
      return { type: string };
    default: {
      const parseTypeResult = parseType(string);
      if (parseTypeResult) {
        if (parseTypeResult.type.toUpperCase() === TypeEnum.OBJECT) {
          return {
            type: TypeEnum.OBJECT,
            structName: parseTypeResult.encapsulated,
          };
        }
        if (parseTypeResult.type.toUpperCase() === TypeEnum.ARRAY) {
          // const encapsulated = typeFromString(parseTypeResult.encapsulated);
          return {
            type: TypeEnum.ARRAY,
            size: parseTypeResult.size,
            encapsulated: { type: parseTypeResult.encapsulated },
          };
        }
      }
      return null;
    }
  }
}
