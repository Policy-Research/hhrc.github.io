import AriaTablist from 'aria-tablist';
import NodeDataManager from '../lib/node-data-manager.js';

const tabs = new NodeDataManager();
const tablists = document.querySelectorAll('[role="tablist"]');
// Create instances
tablists.forEach(element => {
  tabs.set(element, 'ariaTablist', AriaTablist(element));
});




