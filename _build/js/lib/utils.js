/**
 * Debounces function using requestAnimationFrame()
 * @param  {Function} callback Function to invoke, cancelled if called faster than RAF
 * @param  {Object} context Optional context to bind to callback
 */
export function debounceAnimationFrame(callback, context = null) {
  let tid;
  return function debounced() {
    const args = arguments;
    if (tid) window.cancelAnimationFrame(tid);
    tid = window.requestAnimationFrame(() => {
      tid = false;
      callback.apply(context, args);
    });
  };
}
/**
 * Returns a function, that, as long as it continues to be invoked, will not be triggered
 * - Credit David Walsh (https://davidwalsh.name/javascript-debounce-function)
 * @param {Function} callback Function to invoke 
 * @param {Number} wait  Amount of time after (milliseconds)
 * @param {Boolean} immediate  trigger the function on the leading edge, instead of the trailing.
 * @param {Object} valueThis  Context for function
 */
export function debounce(callback, wait, immediate, valueThis) {
  var timeout;
  return function executedFunction() {
    var context = valueThis || this;
    var args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) callback.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) callback.apply(context, args);
  };
}
/**
 * Searches array for first item matching test, beginning at a start index but searching the entire array
 * @param {Array} array Array to search
 * @param {Number} startIndex The index in the array to start the search from
 * @param {Function} callback A test function that is passed array item and index
 * - Credit: (James Waddington) https://stackoverflow.com/questions/28430348/how-to-loop-through-arrays-starting-at-different-index-while-still-looping-throu
 */
export function offsetFindIndexOf(array, startIndex = 0, callback) {
  let found, offset;
  for (var i = 0; i < array.length; i++) {
    offset = (i + startIndex) % array.length;
    found = callback(array[offset], offset);
    if (found) return offset;
  }
  return -1;
}

export function prettyDate(dateStr) {
  const date = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${ months[date.getMonth()] } ${ date.getDate() }, ${ date.getFullYear() }`;
}
// Does not include name
export function formatDateIso(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

// export function mapMostReferenced(array) {
//   return array.map(item => {
//     const itemData = item[0]; // This is the object of static data
//     itemData.count = item[1].count;
//     itemData.summariesOverTime = item[1].summaries_over_time;
//     return itemData;
//   });
// }

export function removeArrayElement(array, elem) {
  var index = array.indexOf(elem);
  if (index > -1) {
    array.splice(index, 1);
  }
}

/**
 *   Will return an object with the separation details
 *   @param  {[type]} string [description]
 *   @return {object}        keys: value, original, unit
 */
export function separateCssUnit(original) {
  const pattern = /(px|vw|vh|%|em|rem)/i;
  return {
    original,
    value:  original.replace(pattern, ""),
    unit:   original.match(pattern)[0]
  };
}

/**
 *   Truncates string with ellipsis if over the max, note use framework function
 *   if you need to know the effects of the truncate process (returns an object 
 *   with info instead) this function only modifies the string
 *   @param  {string} string    String to possibly truncate
 *   @param  {number} max       How many characters max?
 *   @return {string}     
 */
export function truncate(string, max, overflowChar = '…') {
  return string.length <= max ? string : string.slice(0, max) + overflowChar;
}

/**
 *   Prints something if modulus is true
 *   @param  {number}         index           Index to check
 *   @param  {number}         modulo          Modulus to check
 *   @param  {string|number}  string          String to print/return if modulus
 *   @return {string|number}                  Returns the string or empty string depending on modulus truthfulness
 */
export function printModulus(index, modulo, string) {
  return index % modulo ? string : "";
}
/**
 *   Returns reliable document height
 *   @return {number}
 */
export function documentHeight() {
  return Math.max(
    document.body.scrollHeight, document.documentElement.scrollHeight,
    document.body.offsetHeight, document.documentElement.offsetHeight,
    document.body.clientHeight, document.documentElement.clientHeight
  );
}
/**
 *   Returns reliable window height
 *   @return {number}
 */
export function windowHeight() {
  return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
}
/**
 *   Returns reliable window width
 *   @return {number}
 */
export function windowWidth() {
  return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
}
/**
 *   Returns object with both
 *   @return {Object}
 */
export function windowSize() {
  return { height: windowHeight(), width: windowWidth()  };
}
/**
 *   Returns an array of direct descendants
 *   @param  {Node}   element
 *   @param  {String} selector
 *   @return {Array}
 */
export function getDirectDescandants(element, selector) {
  return [...element.children].filter(child => child.matches(selector));
};
/**
 *   Checks if element is overflown both vertically and horizontally
 *   @param  {Node}  element
 *   @return {Boolean}
 */
export function isOverflown(element) {
  return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}
/**
 *   Checks if element is overflown vertically
 *   @param  {Node}  element
 *   @return {Boolean}
 */
export function isOverflownY(element) {
  return element.scrollHeight > element.clientHeight;
}
/**
 *   Check browser support for position: sticky
 *   - https://stackoverflow.com/questions/60214332/dynamically-detect-if-positionsticky-is-supported-by-the-browser
 *   @return {Boolean}
 */
export function browserWithPositionSticky() {
  var prop = 'position:';
  var value = 'sticky';
  var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');

  var el = document.createElement('a');
  var mStyle = el.style;
  mStyle.cssText = prop + prefixes.join(value + ';' + prop).slice(0, - prop.length);
  
  return mStyle.position.indexOf(value) !== -1;
};

export function urlize(string) {
  var newString;
  string = string.replace(/^[^-_a-zA-Z]+/, '').replace(/^-(?:[-0-9]+)/, '-');
  newString = string && string.replace(/[^-_a-zA-Z0-9]+/g, '-');
  return newString;
}
/**
 *   Checks object has required properties
 *   @param  {array.string}  required     Array of properties to check for
 *   @return {function}                   Function for user to use to test for props passed
 */
export function hasRequiredProps(required) {
  /**
   *   Function used for testing on user end
   *   @param  {object}   testObject   Object to test on
   *   @return {Boolean}
   */
  return function(object) {
    return required.every(value => object[value] !== undefined);
  }
}