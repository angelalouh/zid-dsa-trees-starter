const Queue = require("./Queue");

class BinarySearchTree {
  // This constructor represents a single node in the tree.
  // You can optionally pass in a key, a value, and a pointer to the parent node
  constructor(key = null, value = null, parent = null) {
    // If the key property is null, then the object represents an empty tree;
    this.key = key;
    this.value = value;
    // If the parent pointer is null, then you are dealing with a root node
    this.parent = parent;
    // The node starts with the left and right pointers to their child nodes being null;
    this.left = null;
    this.right = null;
  }

  insert(key, value) {
    // If the tree is empty, then this key being inserted is the root node of the tree.
    if (this.key == null) {
      this.key = key;
      this.value = value;
    } else if (key < this.key) {

    /* If the tree already exists, then start at the root and compare it to the key that you
    want to insert. If the new key is less than the node's key, then the new node needs to
    live in the left-hand branch. */
      /* If the existing node does not have a left child, meaning that the 'left' pointer
      is empty, then instantiate and insert the new node as the left child of that node, 
      passing 'this' as the parent node. */
      if (this.left == null) {
        this.left = new BinarySearchTree(key, value, this);
      } else {
      /* If the node has an existing left child, then you recursively call the 'insert()'
      method so that the node is added further down the tree. */
        this.left.insert(key, value);
      }
    } else {

    /* Similarly, if the new key is greater than the node's key, 
    you do the same thing as above, but on the right-hand side. */
      if (this.right == null) {
        this.right = new BinarySearchTree(key, value, this);
      } else {
        this.right.insert(key, value);
      }
    }
  }

  find(key) {
    // If the item is found at the root, then return that value.
    if (this.key === key) {
      return this.value;
    } else if (key < this.key && this.left) {
    /* If the item that you are looking for is less than the root,
    then follow the left child. If there is an existing left child, then
    recursively check its left and/or right child until you find the item. */
      return this.left.find(key);
    } else if (key > this.key && this.right) {
    /* If the item that you are looking for is greater than the root, follow
    the right child. If there is an existing right child, recursively check its
    left and/or right child until you find the item. */
      return this.right.find(key);
    }
    // You have searched the tree and the item isn't in the tree
    else {
      throw new Error("Key Not Found");
    }
  }

  remove(key) {
    if (this.key == key) {
      if (this.left && this.right) {
        const successor = this.right._findMin();
        this.key = successor.key;
        this.value = successor.value;
        successor.remove(successor.key);
      } else if (this.left) {
      /* If the node only has a left child, then you replace the node with its left child. */
        this._replaceWith(this.left);
      } else if (this.right) {
      /* If the node only has a right child, then you replace the node with its right child. */
        this._replaceWith(this.right);
      } else {
      /* If the node has no children, then simply remove it and any references to it
      by calling 'this._replaceWith(null)' */
        this._replaceWith(null);
      }
    }
    // The key to remove is less than the current key, meaning it must be on the left side of the subtree
    // If the current key has a left child, recursively run remove on that child until the key to be removed is found
    else if (key < this.key && this.left) {
      this.left.remove(key);
    }
    // The key to remove is greater than the current key, meaning it must be on the right side of the subtree
    // If the current key has a right child, recursively run remove on that child until the key to be removed is found
    else if (key > this.key && this.right) {
      this.right.remove(key);
    } else {
      throw new Error("Key Not Found.");
    }
  }

  /* Helper function: _replaceWith()
  Used to find the node you want to use to replace a node that has children. If the node you are replacing
  has a parent, then you need to wire up the references from the parent to the replacement node, and the replacement
  node back to the parent. Otherwise, if the node is a root node, you simply copy over the properties of the 
  replacement node.
  */

  _replaceWith(node) {
    // If the node to be replaced has a parent:
    if (this.parent) {
      // If the current node is the left child of the current node's parent, set the left child of the parent node to be the new node
      if (this == this.parent.left) {
        this.parent.left = node;
      }
      // If the current node is the right child of the current node's parent, set the right child of the parent node to be the new node
      else if (this == this.parent.right) {
        this.parent.right = node;
      }
      // If the node that will replace the node to be removed exists:
      if (node) {
        // Set the replacement node's parent to be the parent of the node that will be removed
        node.parent = this.parent;
      }
    } else {
      // The current node doesn't have a parent, aka it is the root node. Copy over the properties of the replacement node
      if (node) {
        this.key = node.key;
        this.value = node.value;
        this.left = node.left;
        this.right = node.right;
      }
      // The node to be removed has no children, will remove it and set its properties to null
      else {
        this.key = null;
        this.value = null;
        this.left = null;
        this.right = null;
      }
    }
  }

  /* Helper function: _findMin()
  Called on this.right
  Used to find the minimum value from the right subtree. When you are removing a node from the tree that
  has two children, you want to replace the node with the smallest node from the right subtree.
  */
  _findMin() {
    // If the right child does not have a left child, return this because it is the min value of the subtree
    if (!this.left) {
      return this;
    }
    // If the right child has a left child, recursively call _findMin() on that left child to find the min value
    return this.left._findMin();
  }

  dfsInOrder(values = []) {
    // First, process the left node recursively
    if (this.left) {
      values = this.left.dfsInOrder(values);
    }

    // Next, process the current node by adding it to the values array
    values.push(this.value);

    // Finally, process the right node recursively
    if (this.right) {
      values = this.right.dfsInOrder(values);
    }
    return values;
  }

  dfsPreOrder(values = [] ) {
    // First, process the current node by adding it to the values array
    values.push(this.value);
    // Next, process the left node recursively
    if (this.left) {
      values = this.left.dfsPreOrder(values);
    }
    // Finally, process the right node recursively
    if (this.right) {
      values = this.right.dfsPreOrder(values);
    }

    return values;
  }

  dfsPostOrder(values = [] ) {
    // First, process the left node recursively
    if (this.left) {
      values = this.left.dfsPostOrder(values);
    }
    // Next, process the right node recursively
    if (this.right) {
      values = this.right.dfsPostOrder(values);
    }
    // Finally, process the current node
    values.push(this.value);

    return values;
  }

  bfs(tree, values = [] ) {
    const queue = new Queue();
    queue.enqueue(tree); // Start the traversal at the tree and add the tree node to the queue to kick off the BFS
    let node = queue.dequeue(); // Remove from the queue
    while (node) {
      values.push(node.value); // Add that value from the queue to an array

      if (node.left) {
        queue.enqueue(node.left); // Add the left child to the queue
      }

      if (node.right) {
        queue.enqueue(node.right); // Add the right child to the queue
      }

      node = queue.dequeue();
    }

    return values;
  }

  getHeight(currentHeight = 0) {
    // Base Case:
    /* If the current node doesn't have a left or right child, then the base case
    is reached and the function can return the height. */
    if (!this.left && !this.right) return currentHeight;

    // Recursive Case:
    // Otherwise, compute the new height.
    const newHeight = currentHeight + 1;

    /* If there's no left child, recurse down the right subtree only,
    passing down the height of the current node. */
    if (!this.left) return this.right.getHeight(newHeight);

    /* If there's no right child, recurse down the left subtree only, passing down
    the height of the current node. */
    if (!this.right) return this.left.getHeight(newHeight);

    /* If both children exist, recurse down both subtrees, passing down the height
    of the current node. */
    const leftHeight = this.left.getHeight(newHeight);
    const rightHeight = this.right.getHeight(newHeight);

    // Return the greater of the left or right subtree heights
    return Math.max(leftHeight, rightHeight);
  }

  isBST() {
    // Use the existing 'dfsInOrder()' method to traverse the tree in order.
    const values = this.dfsInOrder();

    // Check if the array returned by the in-order DFS is a sorted array
    for (let i = 0; i < values.length; i++) {
      // Compare the current and previous values
      // The previous value should always be smaller, so if the current value is smaller, return false
      if (values[i] < values[i-1]) {
        return false;
      }
    }
    return true;
  }

  findKthLargestValue(k) {
    // Use the existing 'dfsInOrder()' method to traverse the tree.
    const values = this.dfsInOrder();
    const kthIndex = values.length - k;
    // Ensure the index is within the bounds of the array
    if (kthIndex >= 0) {
      return values[kthIndex];
    } else {
      console.error("k value exceeds the size of the BST.");
    }
  }

}
