import type { StoredApplication, HandoffRecord } from "./types";
import type { EncryptedPayload } from "./crypto";
import { decryptJson, encryptJson } from "./crypto";

type StoreState = {
  applications: Map<string, EncryptedPayload>;
  handoffs: Map<string, HandoffRecord>;
};

const STORE_KEY = "ECE_Store";

const getStore = (): StoreState => {
  const globalstore = globalThis as typeof globalThis & {
    [STORE_KEY]?: StoreState;
  };
  if (!globalstore[STORE_KEY]) {
    globalstore[STORE_KEY] = {
      applications: new Map<string, EncryptedPayload>(),
      handoffs: new Map<string, HandoffRecord>(),
    };
  }
  return globalstore[STORE_KEY]!;
};

export const saveApplication = (app: StoredApplication): void => {
  const encrypted = encryptJson(app);
  getStore().applications.set(app.applicationId, encrypted);
};

export const getApplication = (id: string): StoredApplication | undefined => {
  const encrypted = getStore().applications.get(id);
  if (!encrypted) return undefined;
  return decryptJson<StoredApplication>(encrypted);
};

export const saveHandoff = (record: HandoffRecord): void => {
  getStore().handoffs.set(record.applicationId, record);
};

export const getHandoff = (id: string): HandoffRecord | undefined => {
  return getStore().handoffs.get(id);
};
