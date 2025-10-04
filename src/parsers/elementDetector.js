function hasMessageAuthorRole(element) {
  if (!element || element.nodeType !== Node.ELEMENT_NODE) {
    return false;
  }

  return (
    element.dataset !== undefined &&
    typeof element.dataset.messageAuthorRole === 'string' &&
    element.dataset.messageAuthorRole.length > 0
  );
}

function getDatasetRole(node) {
  if (
    node &&
    node.dataset &&
    typeof node.dataset.messageAuthorRole === 'string'
  ) {
    const role = node.dataset.messageAuthorRole.toLowerCase();
    if (role === 'user' || role === 'assistant') {
      return role;
    }
  }

  return null;
}

function getMessageContainer(node) {
  if (!node || node.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  if (getDatasetRole(node)) {
    return node;
  }

  if (typeof node.closest === 'function') {
    const ancestor = node.closest('[data-message-author-role]');
    if (ancestor) {
      return ancestor;
    }
  }

  return null;
}

function getRoleFromClassName(node) {
  if (!node || node.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  const className = typeof node.className === 'string' ? node.className : '';

  if (className === 'empty:hidden') {
    return 'user';
  } else if (className.includes('markdown prose')) {
    return 'assistant';
  }

  return null;
}

module.exports = {
  hasMessageAuthorRole,
  getDatasetRole,
  getMessageContainer,
  getRoleFromClassName,
};
