// =============================================================================
// Modals
// =============================================================================

// Version:         1.0.0
// 
// Requires:        Ally.js

const defaults = {
  deferInit: false, // If you want to call init on user side 
  classRoot: 'modals',
  rootParent: document.body,
  // selectorTab: '[role="tab"]',
  // selectorPanel: '[role="tabpanel"]'
};
export class Modals() {
  constructor(options) {
    this.options = Object.assign({}, defaults, options);
    if (!this.options.deferInit) {
      this.buildRoot();
    }
  }
  buildRoot() {
    this.elementRoot = document.createElement('div');
    rootElement.classList.add(this.options.classRoot);
    this.options.rootParent.appendChild(this.elementRoot);
  }
  add() {
    
  }
}

class Modal {
  constructor() {
    
  }
}


// Webinar
//   - Has link
//   - First item
//   - Remove webinar section and display this in the modal when the user clicks on view webinar
//   - Remove other two

// About Us
//  -