import { atom, type Atom, type PrimitiveAtom } from "jotai";
import { store } from "./store";

export interface Item {
  name: string;
  quantity: number;
}

export interface Change {
  items: Item[];
}

export class ListModel {
  private _changesAtom: PrimitiveAtom<Item[]>;
  private _historyAtom: PrimitiveAtom<Change[]>;
  private _itemsAtom: Atom<Item[]>;

  constructor(history: Change[]) {
    this._changesAtom = atom<Item[]>([]);
    this._historyAtom = atom<Change[]>(history);
    this._itemsAtom = atom<Item[]>((get) => {
      const changes = get(this._changesAtom);
      const history = get(this._historyAtom);
      const items: Item[] = [];
      for (const change of history) {
        for (const item of change.items) {
          const existingItem = items.find(i => i.name === item.name);
          if (existingItem) {
            existingItem.quantity += item.quantity;
          } else {
            items.push({ ...item });
          }
        }
      }
      for (const item of changes) {
        const existingItem = items.find(i => i.name === item.name);
        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          items.push({ ...item });
        }
      }
      return items.filter(item => item.quantity > 0);
    });
  }

  add(name: string, quantity: number = 1): void {
    const changes = store.get(this._changesAtom);
    const item = changes.find(item => item.name === name);

    if (item) {
      item.quantity += quantity;
      store.set(this._changesAtom, changes.filter(item => item.quantity !== 0));
    } else {
      store.set(this._changesAtom, [...changes, { name, quantity }]);
    }
  }

  revert(): void {
    store.set(this._changesAtom, []);
  }

  save(): void {
    const changes = store.get(this._changesAtom);
    const history = store.get(this._historyAtom);

    store.set(this._historyAtom, [...history, { items: changes }]);
    store.set(this._changesAtom, []);
  }

  get itemsAtom(): Atom<Item[]> {
    return this._itemsAtom;
  }
}