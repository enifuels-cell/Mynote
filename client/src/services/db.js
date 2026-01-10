import Dexie from 'dexie';

// IndexedDB for offline storage
export const db = new Dexie('MynoteDB');

db.version(1).stores({
  notes: '++id, userId, title, lastModified, isDeleted, *tags',
  syncQueue: '++id, action, noteId, timestamp',
  user: 'id',
  clipboardHistory: '++id, timestamp'
});

export default db;
