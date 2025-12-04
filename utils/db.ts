import { Project } from '../types';

const DB_NAME = 'AuraPortfolioDB';
const DB_VERSION = 1;
const STORE_NAME = 'projects';

export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

export const getProjectsFromDB = async (): Promise<Project[] | null> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const result = request.result;
        resolve(result.length > 0 ? result : null);
      };

      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error("Error reading from DB", e);
    return null;
  }
};

export const saveProjectsToDB = async (projects: Project[]): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    // Clear existing to avoid stale data, then add all
    store.clear().onsuccess = () => {
      let completed = 0;
      let failed = false;

      if (projects.length === 0) {
        resolve();
        return;
      }

      projects.forEach(project => {
        const request = store.put(project);
        request.onsuccess = () => {
          completed++;
          if (completed === projects.length) resolve();
        };
        request.onerror = (e) => {
           console.error("Error saving project", e);
           failed = true;
        };
      });
      
      transaction.oncomplete = () => {
          if (!failed) resolve();
      }
      transaction.onerror = () => reject(transaction.error);
    };
  });
};