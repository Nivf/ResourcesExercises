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

  addChild(id) {
    const childNode = new ResourceNode(id);
    this.children.set(id, childNode);
    return childNode;
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
    const parent = this._findResourceDFS(this.root, resourceId);
    if (parent) {
      this._traverseTree(parent, (node) => {
        node.setEnabled(true);
      });
    }
  }

  /**
   * Disables all resources in the subtree of a given resource ID.
   * @param {string} resourceId - The ID of the root resource of the subtree.
   */
  deepDisableResource(resourceId) {
    const parent = this._findResourceDFS(this.root, resourceId);
    if (parent) {
      this._traverseTree(parent, (node) => {
        node.setEnabled(false);
      });
    }
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
    for (let [childId, childNode] of node.getChildren()) {
      let foundNode = this._findResourceDFS(childNode, id);
      if (foundNode) {
        return foundNode;
      }
    }
    return null;
  }
}

// Creating a tree structure
const root = new ResourceNode("root");
const resourceManager = new ResourceManager(root);

const nodeA = new ResourceNode("A");
root.addChild("A"); // Correctly add nodeA to root with ID "A"

const nodeB = new ResourceNode("B");
nodeA.addChild("B"); // Correctly add nodeB to nodeA with ID "B"

const nodeC = new ResourceNode("C");
nodeB.addChild("C"); // Correctly add nodeC to nodeB with ID "C"

// Performing operations
resourceManager.deepEnableResource("A"); // Enable node A and its subtree

// Retrieving and displaying all resources under 'root'
const allResources = resourceManager.getAllResources("root");
allResources.forEach((node) => {
  console.log(`Node ID: ${node.getId()}, Enabled: ${node.isEnabled()}`);
});
