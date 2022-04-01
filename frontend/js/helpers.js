/**
 * See [Passive Event Listener](https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md)
 * @returns {Boolean}
 */
export function browserSupportsPassiveEvent() {
  let supportsPassive = false;
  try {
    let opts = Object.defineProperty({}, 'passive', {
      get: function() {
        supportsPassive = true;
      }
    });
    window.addEventListener("testPassive", null, opts);
    window.removeEventListener("testPassive", null, opts);
  } catch (e) {}
  return supportsPassive;
}

export function generateUID() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

export function constructSetMap(pairArray, targetMap, extractFunction) {
  for(let [groupId, memberObj] of pairArray) {
    const groupMemberArray = extractFunction(memberObj);
    for(let memberId of groupMemberArray) {
      if (targetMap.has(memberId)) {
        targetMap.get(memberId).add(groupId);
      } else {
        targetMap.set(memberId, new Set([groupId]));
      }
    }
  }
}

export function firstItemInSet(set) {let [first] = set; return first;}

export function firstIntersectItem(set1, set2) {
  for (const set1Item of set1) {
    if (set2.has(set1Item)) return set1Item;
  }
  return false;
}

export function subArrayByItemValues(array, startValue, endValue) {
  let result = [];
  let i = 0;
  while (i < array.length) {
    let item = array[i];
    i++;
    if (item === startValue) {result.push(item); break;}
  }
  while (i < array.length) {
    let item = array[i];
    result.push(item);
    if (item === endValue) break;
    i++;
  }
  if (result.length < 1) return false;
  return result;
}

export function removeItemFromArray(array, itemValue) {
  return array.filter((item) => item != itemValue);
}