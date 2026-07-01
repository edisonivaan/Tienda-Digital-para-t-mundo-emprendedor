// UCE Marketplace — Local Database Service
// Simple localStorage-based database for development

const DB_PREFIX = 'uce_marketplace_';

function getCollection(name) {
  try {
    const data = localStorage.getItem(DB_PREFIX + name);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function setCollection(name, data) {
  localStorage.setItem(DB_PREFIX + name, JSON.stringify(data));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// CRUD Operations
export const db = {
  // Get all items from a collection
  getAll(collection) {
    return getCollection(collection);
  },

  // Get item by ID
  getById(collection, id) {
    const items = getCollection(collection);
    return items.find(item => item.id === id) || null;
  },

  // Query items with filters
  query(collection, filterFn) {
    const items = getCollection(collection);
    return items.filter(filterFn);
  },

  // Create new item
  create(collection, data) {
    const items = getCollection(collection);
    const newItem = {
      ...data,
      id: data.id || generateId(),
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    items.push(newItem);
    setCollection(collection, items);
    return newItem;
  },

  // Update existing item
  update(collection, id, data) {
    const items = getCollection(collection);
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...data, updatedAt: new Date().toISOString() };
    setCollection(collection, items);
    return items[index];
  },

  // Delete item
  delete(collection, id) {
    const items = getCollection(collection);
    const filtered = items.filter(item => item.id !== id);
    setCollection(collection, filtered);
    return filtered.length < items.length;
  },

  // Count items
  count(collection, filterFn) {
    const items = getCollection(collection);
    return filterFn ? items.filter(filterFn).length : items.length;
  },

  // Clear a collection
  clear(collection) {
    localStorage.removeItem(DB_PREFIX + collection);
  },

  // Clear everything
  clearAll() {
    Object.keys(localStorage)
      .filter(key => key.startsWith(DB_PREFIX))
      .forEach(key => localStorage.removeItem(key));
  },
};

export default db;
