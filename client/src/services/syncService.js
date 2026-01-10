import db from './db';
import { notesAPI, syncAPI } from './api';

class SyncService {
  constructor() {
    this.syncInterval = null;
    this.isOnline = navigator.onLine;
    this.deviceId = this.getOrCreateDeviceId();
    
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.sync();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  getOrCreateDeviceId() {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
      deviceId = 'device-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
  }

  startAutoSync(userId, interval = 30000) {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    
    this.syncInterval = setInterval(() => {
      if (this.isOnline) {
        this.sync(userId);
      }
    }, interval);
  }

  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  async sync(userId) {
    if (!this.isOnline || !userId) return;

    try {
      // Get local notes that need syncing
      const localNotes = await db.notes.where('userId').equals(userId).toArray();
      
      // Get sync queue
      const syncQueue = await db.syncQueue.toArray();
      
      // Sync notes to server
      if (localNotes.length > 0) {
        const response = await syncAPI.syncNotes(userId, localNotes, this.deviceId);
        
        // Handle sync results
        if (response.data.syncResults) {
          for (const result of response.data.syncResults) {
            if (result.status === 'conflict') {
              // Handle conflict - server version wins for now
              await db.notes.put(result.note);
            } else if (result.status === 'updated' || result.status === 'created') {
              await db.notes.put(result.note);
            }
          }
        }
      }
      
      // Get notes from server modified after last sync
      const lastSync = localStorage.getItem('lastSync');
      const serverResponse = await syncAPI.getNotes(userId, lastSync);
      
      if (serverResponse.data.notes) {
        for (const note of serverResponse.data.notes) {
          await db.notes.put(note);
        }
      }
      
      // Clear sync queue
      await db.syncQueue.clear();
      
      // Update last sync time
      localStorage.setItem('lastSync', new Date().toISOString());
      
      return { success: true };
    } catch (error) {
      console.error('Sync error:', error);
      return { success: false, error };
    }
  }

  async saveNoteOffline(note) {
    try {
      // Save to IndexedDB
      const id = await db.notes.put(note);
      
      // Add to sync queue
      await db.syncQueue.add({
        action: note.id ? 'update' : 'create',
        noteId: id,
        timestamp: new Date()
      });
      
      return id;
    } catch (error) {
      console.error('Error saving note offline:', error);
      throw error;
    }
  }

  async getNotesOffline(userId) {
    try {
      const notes = await db.notes
        .where('userId')
        .equals(userId)
        .and(note => !note.isDeleted)
        .toArray();
      return notes;
    } catch (error) {
      console.error('Error getting notes offline:', error);
      return [];
    }
  }

  async deleteNoteOffline(id) {
    try {
      const note = await db.notes.get(id);
      if (note) {
        note.isDeleted = true;
        note.lastModified = new Date();
        await db.notes.put(note);
        
        await db.syncQueue.add({
          action: 'delete',
          noteId: id,
          timestamp: new Date()
        });
      }
    } catch (error) {
      console.error('Error deleting note offline:', error);
      throw error;
    }
  }
}

export default new SyncService();
