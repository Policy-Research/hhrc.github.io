// =============================================================================
// Collapsibles Mini
// =============================================================================

// Version:         1.0.9
// 
// Requires:        Ally.js v1.4.1

// Changes:         1.0.2 | Added clickWithinCloses
//                  1.0.3 | Tested In NVDA on Firefox Windows (everything works for basic and accordion)
//                  1.0.4 | Fixed duplicate ID, remove incorrect aria-selected attr
//                  1.0.5 | Converted to ES module
//                  1.0.6 | Added the ability to change the toggle text with [data-cc-state-text]
//                  1.0.7 | Added ability to fade instead of just slide
//                  1.0.8 | Added dependency ally.js for focus trapping, and added
//                          option for closeOnEscape.
//                  1.0.9 | Added event object from click/keyboard that caused change

// Description:     Mini collapsible module that supports basic show and hide
//                  and accordions. This is not maintained with the Informatics
//                  core module Collapsibles but works similarly, based on 
//                  version 4.0.7. 
//                  - Handlers are attached to the document for convenience.
//                  - Self managed option exists for those that want to manage the click handlers.
//                  - Callbacks for change in state (before and after)
//                  - Type support: 
//                    - hide/show
//                    - accordion
//                    - tabs (with keyboard controls) @coming-soon

// Support:         - Built to work in legacy jQuery 1.12 (may not work in newer versions)
//                  - Uses ES5 include polyfill for:
//                    - Array.every(), Array.forEach()
//                    - Object.assign
//                    - Function.bind() 

// Options:         See the "defaults" object below for options and descriptions. All default
//                  properties can be modified and viewed at MiniCollapsibles.defaults [object]


// Setup:           1. Create the correct markup (see below)
//                     - This plugin will set the aria attributes for you with one exception
//                       if an element is added to the page after calling the constructor
//                       you will need to run instance.init(); to do the same for new elements.
//                       For convenience the module provides a method to update all instances with:
// 
//                       MiniCollapsibles.parse()
// 
//                     - This can be avoided by including the aria attributes in the HTML
//                       use the ariaStates object below for reference on what attributes
//                       should be set initially (based on if you want it open or closed)
//                  2. Setup an instance by calling the constructor:
// 
//                     var dropdown = new MiniCollapsible({
//                       container:  '.collapsible',
//                       toggle:     '.collapsible__toggle',
//                       content:    '.collapsible__content',
//                       slide:      500
//                     });
//  
//                  3. Setup the CSS, the only requirement is adding display none when closed 
//                     on the content container:

//                     .collapsible__content {
//                       display: none;
//                     }
//                     .collapsible__content[data-cc-state="open"] {
//                       display: block;
//                     }
// 
// Markup:          See comments below code  


// Todo:            - Tabs type (time permitting)
//                    - Add arrow key cycler from framework collapsible module

import maintain from 'ally.js/maintain/_maintain';
import { hasRequiredProps } from "./utils.js";

const requiredProps = ['selectorContainer', 'selectorToggle', 'selectorContent'];
const hasRequired = hasRequiredProps(requiredProps);
const $ = jQuery;
const $document = $(document);
const merge = Object.assign;
const elementsFocusable = [
  'a[href]',
  'button:not([disabled])',
  'area[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe','object',
  'embed','*[tabindex]',
  '*[contenteditable]'
];
const selectorFocusable = elementsFocusable.join(' ');
const dataKeyParsed = "MiniCollapsibleInit";
const defaults = {
  idPrefix:             'mc-id--',          // So user can adjust if needed
  selectorContainer:    null,               // (required, string) Selector
  selectorToggle:       null,               // see above
  selectorContent:      null,               // see above
  selectorContext:      'body',             // (string) Selector for container that holds multiple collapsibles (oneOpenPerContext)
  aria:                 true,               // (boolean) Toggle aria attributes for accessibility
  selfManaged:          false,              // (boolean) The module will not handle the clicks (Attach yourself and run methods yourself)
  clickOutsideCloses:   false,              // Will close the collapsible if it's open and the user clicks outside, not available to self managed
  clickWithinCloses:    false,              // Useful for menus
  closeOnEscape:        false,              // Add escape key handler when collapsible is open 
  onChangeBefore:       null,               // Callback(elements, newState, event) called before open/closed/toggled
  onChangeAfter:        null,               // Callback(elements, newState, event) called after open/closed/toggled
  attr:                 'data-cc-state',    // The attribute to use to indicate the state (for styling), for adding a class use the callbacks
  slide:                false,              // Whether or not to use jQuery slide animation pass value for duration or false, also can use keywords
  fade:                 false,              // Whether or not to use jQuery fadeIn/Out animation pass value for duration or false, also can use keywords (Cannot slide and fade)
  oneOpenPerContext:    false,              // If enabled the selector for "context" will be used to close all others before opening a new one
  type:                 'basic',            // The type of collapsible (basic, accordion, tabs[not created yet])
  trapFocus:            false              // Only allow focusing within the open collapsible
};
// Object holds info for plugin internally
const managed = {
  all: [],
  click: {
    // ".container-selector .toggle-selector" : { instance object }
  },
  clickOutside: {
    // ".container-selector .toggle-selector" : { instance object }
  },
  clickWithin: {
    // ".container-selector .toggle-selector" : { instance object }
  }
};
let ariaStates = {
  basic: {
    init: {                                 // Dev note: Use this property to add specific props for this type (non dynamic like aria-role, etc)
      toggle: null,
      content: null,
      container: null,
      callback: null                        // Dev note: Use this for doing custom stuff
    },                             
    open: {
      toggle: {
        'aria-expanded' : 'true',
      },
      content: {
        'aria-hidden' : 'false'
      }
    },
    closed: {
      toggle: {
        'aria-expanded' : 'false',
      },
      content: {
        'aria-hidden' : 'true'
      }
    }
  }
};
let instanceCount = 0;

// Adding other merged Aria States
ariaStates.accordion = merge({}, ariaStates.basic, {
  init: {
    callback: function(elements) {
      if (elements.index === 0) {
        elements.context.attr('aria-label', 'Accordion Control Group Buttons');
      }
    }
  }
});



class MiniCollapsible {
  constructor(options) {
    if (!hasRequired(options)) {
      console.warn('MiniCollapsible: Missing required options:', options);
    }

    merge(this, defaults, options);
    managed.all.push(this); // Register 

    // Click handlers
    if (!this.selfManaged) {
      var clickSelector = this.clickSelector();
      managed.click[clickSelector] = this; 

      if (this.clickOutsideCloses) {
        managed.clickOutside[clickSelector] = this;
      }
      if (this.clickWithinCloses) {
        managed.clickWithin[this.clickSelectorWithin()] = this; 
      }
    }

    this.init();
  }
  // Plugin Interface to re-parse plugin managed collapsibles
  static parse() {
    var all = managed.all;
    for(var k = 0, l = all.length; k < l; k++) {
      all[k].init();
    }
  }
  clickSelector() {
    return this.selectorContainer + ' ' + this.selectorToggle;
  }
  clickSelectorWithin() {
    return this.selectorContainer + ' ' + this.selectorContent;
  }
  openSelector() {
    return this.selectorContainer + '[' + this.attr + '="open"]';
  }
  handleClick(event, $toggle) {
    var elements = this.getElements($toggle);
    this.toggle(elements, event);
  }
  getElements($toggle) {

    var $container = $toggle.closest(this.selectorContainer),
        $content = $container.find(this.selectorContent).first();
    return {
      container: $container,
      toggle: $toggle,
      content: $content,
      context: $container.closest(this.selectorContext),
      all: $container.add($toggle).add($content)
    };
  }
  getElementsFromContainer($container) {
     var $toggle = $container.find(this.selectorToggle).first(),
        $content = $container.find(this.selectorContent).first();
    return {
      container: $container,
      toggle: $toggle,
      content: $content,
      context: $container.closest(this.selectorContext),
      all: $container.add($toggle).add($content)
    };
  }
  getElementsFromContent($content) {
    var $container = $content.closest(this.selectorContainer),
        $toggle = $container.find(this.selectorToggle).first();
    return {
      container: $container,
      toggle: $toggle,
      content: $content,
      context: $container.closest(this.selectorContext),
      all: $container.add($toggle).add($content)
    };
  }
  getElementsArray($container) {
    // Expects multiple containers returns arrays of elements objects
    var self = this,
        elementsArray = [];
    
    function collect() {
      elementsArray.push(self.getElementsFromContainer($(this)));
    }

    $container.each(collect);
    return elementsArray;
  }
  getOtherElements({ container, content, toggle }) {

    var $context = container.closest(this.selectorContext),
        $container = $context.find(this.selectorContainer).not(container),
        $toggle = $context.find(this.selectorToggle).not(toggle),
        $content = $context.find(this.selectorContent).not(content);

    return {
      container: $container,
      toggle: $toggle,
      content: $content,
      context: $context,
      all: $container.add($toggle).add($content)
    };
  }
  // Switched the state
  toggle(elements, event) {
    var state = this.getState(elements),
        isOpening = state === "closed";
        
    if (isOpening && this.oneOpenPerContext) {
      this.setState(this.getOtherElements(elements), "closed", event);
    }
    this.setState(elements, isOpening ? "open" : "closed", event);
  }
  setState(elements, state, event) {
    // Don't want to fire callbacks if no changes were made
    if (!elements.container.length) return;
    // Callback
    const after = () => {
      elements.all.attr(this.attr, state);
      if (this.onChangeAfter) {
        this.onChangeAfter.call(this, elements, state, event);
      }
      if (this.aria) {
        this.setAriaAttr(elements, state);
      }
      if (this.trapFocus) {
        this.setTrapFocus(elements, state);
      } if (this.closeOnEscape) {
        this.setEscapeClose(elements, state);
      }
      // Change the toggle text if user passes state text object
      const textState = elements.toggle.data('cc-state-text');
      if (textState) {
        elements.toggle.text(textState[state]);
      }
    }
    // Change the state and call callback
    if (this.onChangeBefore) {
      this.onChangeBefore.call(this, elements, state, event);
    }
    if (this.slide) {
      elements.content[state === "open" ? "slideDown" : "slideUp"](this.slide, after);
    } else if (this.fade) {
      elements.content[state === "open" ? "fadeIn" : "fadeOut"](this.slide, after);
    } else {
      after();
    }
  }
  getState({ content }) {
    return content.attr(this.attr) || "closed";
  }
  setAriaAttr(elements, state, setImmutable) {

    var ariaAttrs = ariaStates[this.type],
        ariaInit = ariaAttrs.init,
        ariaState = ariaAttrs[state],
        toggleAttrs = ariaState.toggle,
        contentAttrs = ariaState.content;

    if (setImmutable) {

      var tid = this.uniqueId(),
          cid = this.uniqueId();

      toggleAttrs = merge(toggleAttrs, ariaInit.toggle, { 
        "id": tid, 
        "aria-controls" : cid,
      });

      contentAttrs = merge(contentAttrs, ariaInit.content, { 
        "id": cid, 
        "aria-labelledby" : tid 
      });

      if (ariaInit.container) {
        elements.container.attr(ariaInit.container);
      }
      if (ariaInit.context) {
        elements.context.attr(ariaInit.context);
      }
      // Do custom stuff
      if (ariaInit.callback) {
        ariaInit.callback.call(this, elements);
      }
    }

    elements.toggle.attr(toggleAttrs);
    elements.content.attr(contentAttrs);
  }
  /**
   *   Attaches temporary ally handler for disabling
   *   focus outside of the collapsible instance
   *   @param {Object} elements
   *   @param {String} state
   */
  setTrapFocus(elements, state) {
    const filter = elements.container.get(0);
    if (state === "open") {
      this._focusTrapHandler = maintain.disabled({ filter });
    } else if (this.focusTrapHandler) {
      this._focusTrapHandler.disengage();
      delete this._focusTrapHandler;
    }
  }
  /**
   *   Attaches temporary handler for the escape key
   *   while the collapsible is open. Removing it when
   *   it closes.
   *   @param {Object} elements
   *   @param {String} state
   */
  setEscapeClose(elements, state) {
    if (state !== "open") return;
    const { container } = elements;
    const handler = e => {
      if (e.keyCode === 27)  {
        this.setState(elements, "closed", e);
        container.off('keyup', handler);
      }
    }
    container.on('keyup', handler);
  }
  init() {
    this.each(this.initElementSet);
  }
  initElementSet(elements) {
    // Check if they are already setting attributes if not set them
    if (elements.container.data(dataKeyParsed)) {
      return;
    }
    var state = this.getState(elements);
    this.setAriaAttr(elements, state, true);
    elements.container.data(dataKeyParsed, true);
  }
  each(callback) {

    $(this.selectorContainer).each(eachContainer.bind(this));

    function eachContainer(index, container) {
      var $container = $(container),
          $toggle = $container.find(this.selectorToggle).first(), 
          $content = $container.find(this.selectorContent).first();

      var elements = {
        container: $container, 
        toggle: $toggle, 
        content: $content, 
        index: index,
        context: $container.closest(this.selectorContext),
        all: $container.add($toggle).add($content)
      };

      callback.call(this, elements);
    }
  }
  // Function should test DOM for an ID and return one that doesn't exist.
  // - User can override this function if needed
  uniqueId(attempt) {

    attempt = attempt === undefined ? 1 : ++attempt;

    var id = this.idPrefix + (++instanceCount),
        el = $('#' + id);

    // Check to make sure this ID isn't in the DOM (try again)
    // The attempt limit is so this doesn't go into infinite loop for some 
    // reason (very unlikely but it didn't feel right leaving the 
    // opportunity to loop forever)
    if (el.length && attempt < 50) {
      return this.uniqueId(attempt);
    } else {
      return id;
    } 
  }
}

// Attaching properties to class so user can modify globally
MiniCollapsible.defaults = defaults;
MiniCollapsible.ariaStates = ariaStates;
MiniCollapsible.managed = managed;

$document.on('click', onClick); // Module click handler

// Internal Functions
// =============================================================================

function onClick(event) {
  var $target = $(event.target),
      selector,
      $toggle,
      $content,
      instance,
      elements;

  // Check for open instances before changing new ones
  for (selector in managed.clickOutside) {
    // Need to select all open
    instance = managed.clickOutside[selector];
    ifOutsideClose(instance, $target, event);
  }
  // Check all instances
  for (selector in managed.click) {
    $toggle = $target.closest(selector);
    if ($toggle.length) {
      instance = managed.click[selector];
      instance.handleClick(event, $toggle);
    }
  }
  // check Click within and close
  for (selector in managed.clickWithin) {
    $content = $target.closest(selector);
    if ($content.length) {
      instance = managed.clickWithin[selector];
      elements = instance.getElementsFromContent($content);
      instance.setState(elements, 'closed', event);
    }
  }
}
function ifOutsideClose(self, $target, event) {
  // Decide if the current click target is a toggle
  var cont = self.selectorContainer,
      contOpen = self.openSelector(),
      $targetContainer = $target.parents(cont).addBack(cont),
      $openContainer = $document.find(contOpen).not($targetContainer);

  // Then close the open containers
  if ($openContainer.length) {
    var elementsArray = self.getElementsArray($openContainer);
    for(var i = 0; i < elementsArray.length; i++){
      self.setState(elementsArray[i], "closed", event);
    } 
  }
}

export default MiniCollapsible;

/* 
  Markup Example:

  <!-- Basic Hide and Show -->
  <div class="collapsible" data-cc-state="closed">
    <button class="collapsible__toggle" type="button" data-cc-state="closed" data-cc-state-text='{ "open" : "Hide Filters", "closed" : "Show Filters" }'>
      Open Me
    </button>
    <div class="collapsible__content" data-cc-state="closed">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eu molestie est. Proin ante augue, sollicitudin at diam sed, ullamcorper vehicula libero. Vestibulum hendrerit, arcu eget viverra imperdiet, ipsum nunc consectetur sapien, eu tincidunt velit leo vel neque. Quisque sit amet venenatis turpis. Donec ac faucibus nisi. Aliquam nec rhoncus
      </p>
    </div>
  </div>

  <!-- Example accordion -->
  <ul class="accordion">
    <li class="accordion__item" data-cc-state="open">
      <button class="accordion__toggle" data-cc-state="open" type="button">
        <strong>Toggle the accordion</strong>
      </button>
      <div class="accordion__content" data-cc-state="open">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eu molestie est. Proin ante augue, sollicitudin at diam sed, ullamcorper vehicula libero. Vestibulum hendrerit, arcu eget viverra imperdiet, ipsum nunc consectetur sapien, eu tincidunt velit leo vel neque. Quisque sit amet venenatis turpis. Donec ac faucibus nisi. Aliquam nec rhoncus turpis, sit amet euismod sem. Morbi facilisis, ipsum eget fermentum interdum, ligula diam tincidunt nisi, eu auctor lacus sem maximus erat. Sed at metus ex. Nam vestibulum convallis magna, et ultricies eros suscipit non. Quisque ornare semper ipsum vitae tempor. Aliquam semper ante leo, eget pretium nisi fringilla quis.
        </p>
      </div>
    </li>
    <li class="accordion__item" data-cc-state="closed">
      <button class="accordion__toggle" data-cc-state="closed">
        <strong>Toggle the accordion</strong>
      </button>
      <div class="accordion__content" data-cc-state="closed">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eu molestie est. Proin ante augue, sollicitudin at diam sed, ullamcorper vehicula libero. Vestibulum hendrerit, arcu eget viverra imperdiet, ipsum nunc consectetur sapien, eu tincidunt velit leo vel neque. Quisque sit amet venenatis turpis. Donec ac faucibus nisi. Aliquam nec rhoncus turpis, sit amet euismod sem. Morbi facilisis, ipsum eget fermentum interdum, ligula diam tincidunt nisi, eu auctor lacus sem maximus erat. Sed at metus ex. Nam vestibulum convallis magna, et ultricies eros suscipit non. Quisque ornare semper ipsum vitae tempor. Aliquam semper ante leo, eget pretium nisi fringilla quis.
        </p>
      </div>
    </li>
    <li class="accordion__item" data-cc-state="closed">
      <button class="accordion__toggle" data-cc-state="closed">
        <strong>Toggle the accordion</strong>
      </button>
      <div class="accordion__content" data-cc-state="closed">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eu molestie est. Proin ante augue, sollicitudin at diam sed, ullamcorper vehicula libero. Vestibulum hendrerit, arcu eget viverra imperdiet, ipsum nunc consectetur sapien, eu tincidunt velit leo vel neque. Quisque sit amet venenatis turpis. Donec ac faucibus nisi. Aliquam nec rhoncus turpis, sit amet euismod sem. Morbi facilisis, ipsum eget fermentum interdum, ligula diam tincidunt nisi, eu auctor lacus sem maximus erat. Sed at metus ex. Nam vestibulum convallis magna, et ultricies eros suscipit non. Quisque ornare semper ipsum vitae tempor. Aliquam semper ante leo, eget pretium nisi fringilla quis.
        </p>
      </div>
    </li>
    <li class="accordion__item" data-cc-state="closed">
      <button class="accordion__toggle" data-cc-state="closed">
        <strong>Toggle the accordion</strong>
      </button>
      <div class="accordion__content" data-cc-state="closed">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eu molestie est. Proin ante augue, sollicitudin at diam sed, ullamcorper vehicula libero. Vestibulum hendrerit, arcu eget viverra imperdiet, ipsum nunc consectetur sapien, eu tincidunt velit leo vel neque. Quisque sit amet venenatis turpis. Donec ac faucibus nisi. Aliquam nec rhoncus turpis, sit amet euismod sem. Morbi facilisis, ipsum eget fermentum interdum, ligula diam tincidunt nisi, eu auctor lacus sem maximus erat. Sed at metus ex. Nam vestibulum convallis magna, et ultricies eros suscipit non. Quisque ornare semper ipsum vitae tempor. Aliquam semper ante leo, eget pretium nisi fringilla quis.
        </p>
      </div>
    </li>
  </ul>
*/