!function(){var t={569:function(t){window,t.exports=function(t){var e={};function i(a){if(e[a])return e[a].exports;var s=e[a]={i:a,l:!1,exports:{}};return t[a].call(s.exports,s,s.exports,i),s.l=!0,s.exports}return i.m=t,i.c=e,i.d=function(t,e,a){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:a})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var a=Object.create(null);if(i.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var s in t)i.d(a,s,function(e){return t[e]}.bind(null,s));return a},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=0)}([function(t,e,i){"use strict";i.r(e),i.d(e,"AriaTablist",(function(){return b}));var a={37:-1,38:-1,39:1,40:1},s=function(){function t(t){this.tabs=t.tabs,this.panels=t.panels,this.options=t.options,this.open=this.open.bind(t),this.close=this.close.bind(t),this.delete=this.delete.bind(t),this.destroy=this.destroy.bind(t),t.tablist.ariaTablist=this}return t.prototype.open=function(t,e){this.checkMultiple(),this.activateTabWithTimer.apply(this,[t,e,!0])},t.prototype.close=function(t,e){this.checkMultiple(),this.deactivateTab.apply(this,[t,e,!0]),this.makeFocusable()},t.prototype.delete=function(t){this.determineDeletable.call(this,t)},t.prototype.destroy=function(){this.destroy.call(this)},t}(),n=function(t){for(var e in void 0===t&&(t={}),this.delay=0,this.deletable=!1,this.focusableTabs=!1,this.focusablePanels=!0,this.arrowActivation=!1,this.allArrows=!1,this.tabSelector='[role="tab"]',this.tabindex=0,t)t.hasOwnProperty(e)&&void 0!==t[e]&&(this[e]=t[e])};function r(t){t&&"function"==typeof t.preventDefault&&t.preventDefault()}function o(t,e){return t.getAttribute&&t.getAttribute(e)||""}function l(t,e,i){t&&o(t,e)!==i&&t.setAttribute&&t.setAttribute(e,i)}function u(t,e){t&&e&&t.removeAttribute&&e.split(" ").forEach((function(e){return e&&t.removeAttribute(e)}))}var h=0,c=function(){function t(t,e){if(this.tabs=[],this.panels=[],t&&1===t.nodeType){var i=t.ariaTablist;i&&"function"==typeof i.destroy&&i.destroy(),h+=1,this.tablist=t,this.options=new n(e),this.api=new s(this),this.init()}}return t.prototype.checkMultiple=function(){this.multiple="true"===o(this.tablist,"aria-multiselectable")},t.prototype.triggerOptionCallback=function(t,e){if(void 0===e&&(e=[]),this.options&&"function"==typeof this.options[t])return this.options[t].apply(this.api,e)},t.prototype.makeFocusable=function(){for(var t=""+(this.options.tabindex||0),e=0,i=this.tabs.length;e<i;e+=1)if(o(this.tabs[e],"tabindex")===t)return;l(this.tabs[0],"tabindex",t)},t.prototype.setCoreAttributes=function(t,e,i){var a=this.options.tabindex||"0";this.options.focusableTabs&&l(t,"tabindex",a),this.options.focusablePanels&&l(e,"tabindex",a),t.id||l(t,"id","aria-tablist-"+h+"-tab-"+i),e.id||l(e,"id","aria-tablist-"+h+"-panel-"+i),l(t,"role","tab"),l(e,"role","tabpanel"),l(t,"aria-controls",e.id),l(e,"aria-labelledby",t.id)},t.prototype.getTabPanel=function(t){var e="number"==typeof t?this.tabs[t]:t;if(!e||1!==e.nodeType)return null;var i="number"==typeof t?this.panels[t]:null;if(i)return i;var a=o(e,"aria-controls");return a||(a=o(e,"data-controls")),a&&(i=document.getElementById(a)),i||(a&&u(e,"aria-controls"),e.id&&(i=document.querySelector('[aria-labelledby="'+e.id+'"]')),i||(i=document.querySelector('[data-labelledby="'+e.id+'"]'))),i},t.prototype.generateArrays=function(t){this.tabs.splice(0),this.panels.splice(0);var e=this.tablist.querySelectorAll(this.options.tabSelector);t&&!e.length&&(e=this.tablist.childNodes);for(var i=0,a=e.length;i<a;i+=1){var s=e[i];if(s&&1===s.nodeType&&!(this.panels.indexOf(s)>-1)){var n=this.getTabPanel(s);n?(this.tabs.push(s),this.panels.push(n),this.setCoreAttributes(s,n,i),s._ariaTablistTabIndex=this.tabs.length-1):"tab"===o(s,"role")&&u(s,"role")}}},t.prototype.elementIsTab=function(t){return!!(t&&this.tabs.indexOf(t)>-1)},t.prototype.addListenersToTab=function(t){var e=this.tabs[t];e.addEventListener("keydown",this.tabKeydownEvent),e.addEventListener("keyup",this.tabKeyupEvent),e.addEventListener("click",this.tabClickEvent)},t.prototype.tabClickEvent=function(t){var e=t.target;do{if(this.elementIsTab(e))return this.checkMultiple(),r(t),this.activateTabWithTimer(e,!1);e=e.parentElement||e.parentNode}while(null!==e&&1===e.nodeType)},t.prototype.tabKeydownEvent=function(t){if(this.elementIsTab(t.target))switch(t.keyCode){case 35:r(t),this.focusLastTab();break;case 36:r(t),this.focusFirstTab();break;case 38:case 40:case 37:case 39:this.processArrowPress(t);break;case 32:case 13:r(t)}},t.prototype.tabKeyupEvent=function(t){var e=t.target;if(this.elementIsTab(e))switch(t.keyCode){case 46:this.determineDeletable(e);break;case 13:case 32:this.checkMultiple(),r(t),this.activateTabWithTimer(e)}},t.prototype.processArrowPress=function(t){var e=t.keyCode;(this.options.allArrows||("vertical"===o(this.tablist,"aria-orientation")?38===e||40===e:37===e||39===e))&&this.switchTabOnArrowPress(t)},t.prototype.switchTabOnArrowPress=function(t){var e=t.keyCode,i=a[e],s=t.target._ariaTablistTabIndex;if(i&&"number"==typeof s){r(t);var n=!(37!==e&&39!==e||"rtl"!==document.dir&&"rtl"!==this.tablist.dir);n&&"ltr"!==this.tablist.dir&&(i*=-1);var o=s+i;this.tabs[o]?this.focusTab(o):37===e||38===e?n?this.focusFirstTab():this.focusLastTab():39!==e&&40!=e||(n?this.focusLastTab():this.focusFirstTab())}},t.prototype.getTab=function(t){return"number"==typeof t&&this.elementIsTab(this.tabs[t])?this.tabs[t]:this.elementIsTab(t)?t:null},t.prototype.activateTabWithTimer=function(t,e,i){var a=this;this.tabTimer&&clearTimeout(this.tabTimer);var s="number"==typeof this.options.delay?this.options.delay:0;this.tabTimer=setTimeout((function(){a.activateTab(t,e,i)}),s)},t.prototype.activateTab=function(t,e,i){void 0===e&&(e=!0),void 0===i&&(i=!1);var a=this.getTab(t);if(a&&e&&a.focus(),a&&(i||"true"!==o(a,"aria-disabled"))){var s="true"===o(a,"aria-selected");if(this.multiple&&s&&!i)return this.deactivateTab(a),void this.makeFocusable();this.multiple||this.deactivateTabs([a]);var n=this.options.tabindex||"0";l(a,"tabindex",n),l(a,"aria-selected","true");var r=this.getTabPanel(t);if(r){var h="hidden"===o(r,"hidden");u(r,"hidden aria-hidden"),this.multiple&&(l(r,"aria-expanded","true"),l(a,"aria-expanded","true")),this.options.focusablePanels&&l(r,"tabindex",n),h&&this.triggerOptionCallback("onOpen",[r,a])}}},t.prototype.deactivateTab=function(t,e,i){void 0===e&&(e=!1),void 0===i&&(i=!1);var a=this.getTab(t);if(a&&(e&&a.focus(),l(a,"tabindex",this.options.focusableTabs?this.options.tabindex||"0":"-1"),i||"true"!==o(a,"aria-disabled"))){l(a,"aria-selected","false");var s=this.getTabPanel(t);if(s){var n="hidden"===o(s,"hidden");u(s,"tabindex"),l(s,"hidden","hidden"),l(s,"aria-hidden","true"),this.multiple?(l(a,"aria-expanded","false"),l(s,"aria-expanded","false")):(u(s,"aria-expanded"),u(a,"aria-expanded")),n||this.triggerOptionCallback("onClose",[s,a])}}},t.prototype.deactivateTabs=function(t){var e=this;void 0===t&&(t=[]);var i=Array.isArray(t);this.tabs.forEach((function(a){i&&-1!==t.indexOf(a)||e.deactivateTab(a,!1,!0)}))},t.prototype.focusTab=function(t){var e=this.getTab(t),i=this.options.arrowActivation;if(e){if(i&&"true"!==o(e,"aria-selected"))return void this.activateTabWithTimer(e);e.focus()}},t.prototype.focusFirstTab=function(){this.focusTab(0)},t.prototype.focusLastTab=function(){this.focusTab(this.tabs.length-1)},t.prototype.determineDeletable=function(t){if(this.options.deletable){var e=this.getTab(t);if(e&&"false"!==o(e,"data-deletable")){this.checkMultiple(),this.deleteTab(e),this.generateArrays();var i=e._ariaTablistTabIndex,a=i-1>-1?i-1:0;this.multiple||"true"!==o(e,"aria-selected")?this.tabs[a]&&this.tabs[a].focus():this.activateTab(a),this.makeFocusable(),this.triggerOptionCallback("onDelete",[e])}}},t.prototype.deleteTab=function(t){var e=this.getTabPanel(t);t.parentElement.removeChild(t),e&&e.parentElement.removeChild(e)},t.prototype.destroy=function(){var t=this,e="aria-expanded aria-hidden hidden role tabindex";this.tabs.forEach((function(i,a){i.removeEventListener("keydown",t.tabKeydownEvent),i.removeEventListener("keyup",t.tabKeyupEvent),i.removeEventListener("click",t.tabClickEvent),u(t.panels[a],e),u(i,e),delete i._ariaTablistTabIndex})),this.tablist&&(delete this.tablist.ariaTablist,u(this.tablist,"role")),this.panels.splice(0),this.tabs.splice(0),this.tablist=null},t.prototype.init=function(){var t=this;this.checkMultiple(),this.generateArrays(!0),this.tabKeydownEvent=this.tabKeydownEvent.bind(this),this.tabClickEvent=this.tabClickEvent.bind(this),this.tabKeyupEvent=this.tabKeyupEvent.bind(this);var e=[];this.tabs.forEach((function(i,a){t.addListenersToTab(a),"true"!==o(i,"aria-selected")&&"true"!==o(i,"data-selected")||!t.multiple&&e.length||e.push(i)})),l(this.tablist,"role","tablist"),this.tabs.length&&(this.multiple||e.length||e.push(this.tabs[0]),this.deactivateTabs(e),e.forEach((function(e){return t.activateTab(e,!1,!0)})),this.makeFocusable()),this.triggerOptionCallback("onReady",[this.tablist])},t}();function b(t,e){return new c(t,e).api}e.default=b}])}},e={};function i(a){if(e[a])return e[a].exports;var s=e[a]={exports:{}};return t[a](s,s.exports,i),s.exports}i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,{a:e}),e},i.d=function(t,e){for(var a in e)i.o(e,a)&&!i.o(t,a)&&Object.defineProperty(t,a,{enumerable:!0,get:e[a]})},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},function(){"use strict";var t=i(569),e=i.n(t);console.log(e()),document.querySelectorAll('[role="tablist"]').forEach((function(t){e()(t)}))}()}();
//# sourceMappingURL=scripts.js.map