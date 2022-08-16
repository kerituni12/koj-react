export function eqSet(as, bs) {
  if (!(as instanceof Set) || !(bs instanceof Set)) return false;
  if (as?.size !== bs?.size) return false;
  for (var a of as) if (!bs.has(a)) return false;
  return true;
}

export function getFirstMatchedArrayValueInSet(array, set, property, equalFnc) {
  if (property) {
    if (equalFnc)
      return array.find((element) => equalFnc(element[property], set));
    return array.find((element) => set.has(element[property]));
  }
  if (equalFnc) return array.find((element) => equalFnc(element, set));
  return array.find((element) => set.has(element));
}
