import fs from 'fs';
import path from 'path';

export interface StoreSettings {
  storeSuspended: boolean;
  suspensionMessage: string;
}

const DATA_PATH = path.join(process.cwd(), 'src/data/store-settings.json');

const DEFAULTS: StoreSettings = {
  storeSuspended: false,
  suspensionMessage: "We're crafting the next batch — new stock arriving soon!",
};

export function readSettings(): StoreSettings {
  try {
    return { ...DEFAULTS, ...JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8')) };
  } catch {
    return { ...DEFAULTS };
  }
}

export function writeSettings(settings: StoreSettings): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(settings, null, 2));
}
