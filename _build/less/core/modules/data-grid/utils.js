/**
 *   Sets up the positonal classes that would come from the equal
 *   height module. Needs to be rerun by user when layout changes
 *   or new instances are added to the screen
 *   @param {Node} parent  The grid parent <data-grid="">
 *   @param {Object} classes Override the default equal heights classes
 */
export function setPositionClasses(parent, classes = { 
  columnFirst: 'position--column-first', 
  columnLast: 'position--column-last', 
  rowFirst: 'position--row-first', 
  rowLast: 'position--row-last' 
}) {  
  const children = [...parent.children];
  const rows = [];
  let lastY;
  // Check element against last
  // If they don't match it's a new row create a new array
  // Then push into the last array in the rows array
  children.forEach((child) => {
    const y = child.getBoundingClientRect().y;
    if (lastY !== y) rows.push([]);
    rows[rows.length - 1].push(child);
    lastY = y;
    child.classList.remove(...Object.values(classes)); // Remove previously set classes
  });
  // Apply Classes
  rows.forEach((row, index) => {
    if (index === 0) 
      row.forEach(child => child.classList.add(classes.rowFirst));
    if (index == rows.length - 1) 
      row.forEach(child => child.classList.add(classes.rowLast));

    row.forEach((child, childIndex) => {
      if (childIndex === 0) 
        child.classList.add(classes.columnFirst);
      if (childIndex == row.length - 1) 
        child.classList.add(classes.columnLast);
    });
  });

}