import type { StoredApplication, HandoffRecord } from "./types";

type StoreState = {
  applications: Map<string, StoredApplication>;
  handoffs: Map<string, HandoffRecord>;
};

const STORE_KEY = "ECE_Store";

function getStore(): StoreState {
  const globalstore = globalThis as typeof globalThis & {
    [STORE_KEY]?: StoreState;
  };
  if (!globalstore[STORE_KEY]) {
    globalstore[STORE_KEY] = {
      applications: new Map<string, StoredApplication>(),
      handoffs: new Map<string, HandoffRecord>(),
    };
  }
  return globalstore[STORE_KEY]!;
}

export function saveApplication(app: StoredApplication): void {
  getStore().applications.set(app.applicationId, app);
}

export function getApplication(id: string): StoredApplication | undefined {
  return getStore().applications.get(id);
}

export function saveHandoff(record: HandoffRecord): void {
  getStore().handoffs.set(record.applicationId, record);
}

export function getHandoff(id: string): HandoffRecord | undefined {
  return getStore().handoffs.get(id);
}
