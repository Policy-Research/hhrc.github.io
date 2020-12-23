/**
 * Class that provides a method to store data based on node/element
 */
export default class NodeDataManager {
  constructor() {
    this.store = [];
  }
  /**
   * Get data for an element/node
   * @param {Node} node Html Node/Element to get data for
   * @param {String|Boolean} key If key is passed, return that key's data for the element, if falsey return elements complete dataset
   */
  get(node, key = false) {
    const nodeData = this.find(node);
    if (nodeData) {
      return nodeData.get(key);
    }
  }
  /**
   * Bind data to a specific Node/Element
   * @param {Node} node Html Node/Element to get data for
   * @param {String} key Key to save the data under
   * @param {*} value Value to save 
   */
  set(node, key, value) {
    const nodeData = this.find(node);
    if (nodeData) {
      nodeData.set(key, value);
    } else {
      this.store.push(new NodeDataStore(node, { [key] : value }));
    }
  }
  /**
   * Return an elements store object
   */
  find(node) {
    return this.store.find(nd => nd.isNode(node));
  }
  /**
   * Destroy all references to data and nodes/elements
   */
  destroy() {
    this.store.forEach(nd => nd.destroy());
    this.store = [];
  }
}
/**
 * Child class that provides a store for one specific node/element
 */
export class NodeDataStore {
  constructor(node, data) {
    this.node = node;
    this.data = data || {}; // Lookup
  }
  set(key, value) {
    this.data[key] = value;
  }
  get(key = false) {
    return key ? this.data[key] : this.data;
  }
  remove(key) {
    delete this.data[key];
  }
  isNode(node) {
    return this.node.isSameNode(node);
  }
  clearData() {
    this.data = {};
  }
  destroy() {
    this.clearData();
    this.node = null;
  }
}