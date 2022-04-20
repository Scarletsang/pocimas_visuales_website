/**
 * generate a unique UUID using the web crypto object.
 * @returns {String}
 */
export function generateUID() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

/**
 * Given an array of groups, each group contain data of itself and its members. Construct a setmap where the group IDs can be queried by the id of its member.
 * @template GroupId,GroupData,MemberId
 * @param {Array<[GroupId, GroupData]>} groupEntries A key/value pair array describing the group data. It is recommended to pass in the result from {@link Object.entries}
 * @param {(groupData: GroupData) => Array<MemberId>} extractFunction A function that extract the member IDs from the group data. This function can also be treated as a transform function, so that the result map can be queried by the transformed values.
 * @returns {Map<MemberId, Set<GroupId>>}
 */
export function constructMemberSetsMap(groupEntries, extractFunction) {
  let targetMap = new Map();
  for(let [groupId, groupData] of groupEntries) {
    const members = extractFunction(groupData);
    for(let memberId of members) {
      if (targetMap.has(memberId)) {
        targetMap.get(memberId).add(groupId);
      } else {
        targetMap.set(memberId, new Set([groupId]));
      }
    }
  }
  return targetMap;
}

/**
 * Return the first element in a javascript set.
 * @template T
 * @param {Set<T>} set 
 * @returns {T}
 */
export function firstItemInSet(set) {let [first] = set; return first;}

/**
 * Return the first element of the intersection of two sets.
 * @template T
 * @param {Set<T>} set1 
 * @param {Set<T>} set2 
 * @returns {T | false}
 */
export function firstIntersectItem(set1, set2) {
  for (const set1Item of set1) {
    if (set2.has(set1Item)) return set1Item;
  }
  return false;
}

/**
 * Returns a slice of an array. The sub-array starts from and ends with the specified values.
 * @template T
 * @param {Array<T>} array 
 * @param {T} startValue 
 * @param {T} endValue 
 * @returns {Array<T>}
 */
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

/**
 * Remove all items in an array that has the specified value.
 * @template T
 * @param {Array<T>} array 
 * @param {T} itemValue 
 * @returns {Array<T>}
 */
export function removeItemFromArray(array, itemValue) {
  return array.filter((item) => item != itemValue);
}