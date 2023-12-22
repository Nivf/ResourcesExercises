/**
 * Class representing a single resource node.
 */
class ResourceNode {
  /*
   * Constructor for ResourceNode.
   * @param {string} id - The ID of the resource.
   */
  constructor(id) {
    this.id = id;
    this.enabled = false; // Default state
    this.children = new Map();
  }

  // Getters and setters for the properties
  getId() {
    return this.id;
  }

  setId(id) {
    this.id = id;
  }

  isEnabled() {
    return this.enabled;
  }

  setEnabled(state) {
    this.enabled = state;
  }

  getChildren() {
    return this.children;
  }

  addChild(child) {
    this.children.push(child);
  }

  getChildrenById(id) {
    if (this.getId() === id) {
      return this;
    }
    for (let child of this.children) {
      let found = child.getChildrenById(id);
      if (found) return found;
    }
    return null;
  }
}

/**
 * Class to manage resources with various operations.
 */
class ResourceManager {
  /**
   * Constructor for ResourceManager.
   * Initializes the root of the resource tree.
   * @param {ResourceNode} root - The root node of the resource tree.
   */
  constructor(root) {
    this.root = root;
  }

  /**
   * Adds a new resource as a child to a parent resource identified by its ID.
   * @param {string} parentResourceId - The ID of the parent resource.
   * @param {ResourceNode} newResource - The new resource node to be added.
   */
  addResource(parentResourceId, newResource) {
    const parent = this._findResourceDFS(parentResourceId);
    parent.addChild(newResource);
  }

  /**
   * Retrieves a list of all resources under a given resource ID.
   * @param {string} resourceId - The ID of the resource.
   * @returns {ResourceNode[]} An array of ResourceNode.
   */
  getAllResources(resourceId) {
    const startNode = this._findResourceDFS(this.root, resourceId);
    const resources = [];

    if (startNode) {
      this._traverseTree(startNode, (node) => {
        resources.push(node);
      });
    }

    return resources;
  }

  /**
   * Enables a specific resource by its ID.
   * @param {string} resourceId - The ID of the resource to enable.
   */
  enableResource(resourceId) {
    const node = this._findResourceDFS(resourceId);
    node.setEnabled(true);
  }

  /**
   * Disables a specific resource by its ID.
   * @param {string} resourceId - The ID of the resource to disable.
   */
  disableResource(resourceId) {
    const node = this._findResourceDFS(resourceId);
    node.setEnabled(false);
  }

  /**
   * Enables all resources in the subtree of a given resource ID.
   * @param {string} resourceId - The ID of the root resource of the subtree.
   */
  deepEnableResource(resourceId) {
    const parent = this._findResourceDFS(resourceId);
    if (parent) {
      this._traverseTree(parent, (node) => {
        node.setEnabled(true);
      });
    }
    return currentNodeResources;
  }

  /**
   * Disables all resources in the subtree of a given resource ID.
   * @param {string} resourceId - The ID of the root resource of the subtree.
   */
  deepDisableResource(resourceId) {
    const parent = this._findResourceDFS(resourceId);
    if (parent) {
      this._traverseTree(parent, (node) => {
        node.setEnabled(false);
      });
    }
    return currentNodeResources;
  }

  /**
   * Generic tree traversal method.
   * @param {ResourceNode} node - The starting node for traversal.
   * @param {Function} callback - A callback function to execute on each node.
   */
  _traverseTree(node, callback) {
    callback(node);
    for (let child of node.getChildren().values()) {
      this._traverseTree(child, callback);
    }
  }

  _findResourceDFS(node, id) {
    if (node.getId() === id) {
      return node;
    }
    for (let child of node.getChildren().values()) {
      let node = this._findResourceDFS(child, id);
      if (node) {
        return node;
      }
    }
    return null;
  }
}
