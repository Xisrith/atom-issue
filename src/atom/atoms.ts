import { atom } from "jotai";
import type { Atom, PrimitiveAtom } from "jotai";
import { store } from "./store";


export class Item {
  readonly name: string;
  readonly id: string = crypto.randomUUID();

  private _quantityAtom: PrimitiveAtom<number>;

  constructor(name: string, quantity: number = 1) {
    this.name = name;
    this._quantityAtom = atom(quantity);
  }

  get quantity() {
    return store.get(this._quantityAtom);
  }

  set quantity(value: number) {
    store.set(this._quantityAtom, value);
  }

  get quantityAtom() {
    return this._quantityAtom;
  }
}

export class ChangeList {
  private _itemsAtom: PrimitiveAtom<Item[]>;

  constructor(items: Item[] = []) {
    this._itemsAtom = atom(items);
  }

  addItem(name: string, quantity: number = 1) {
    const items = store.get(this._itemsAtom);
    const item = items.find(i => i.name === name);
    if (item) {
      store.set(item.quantityAtom, item.quantity + quantity);;
    } else {
      const newItem = new Item(name, quantity);
      store.set(this._itemsAtom, [...items, newItem]);
    }
  }

  get itemsAtom() {
    return this._itemsAtom;
  }
}

export class List {
  private _listItems: Item[];

  private _changesAtom: PrimitiveAtom<ChangeList[]>;
  private _listAtom: Atom<Item[]>;

  constructor(changes: ChangeList[] = []) {
    this._listItems = [];

    this._changesAtom = atom(changes);
    this._listAtom = atom((get) => {
      const items = [...this._listItems];
      items.forEach(item => item.quantity = 0);
      const changes = get(this._changesAtom);
      for (const change of changes) {
        const changeItems = get(change.itemsAtom);
        for (const item of changeItems) {
          const existingItem = items.find(i => i.name === item.name);
          const quantity = get(item.quantityAtom);
          if (existingItem) {
            existingItem.quantity += quantity
          } else {
            items.push(new Item(item.name, quantity));
          }
        }
      }
      const filteredItems = items.filter(item => item.quantity > 0);
      this._listItems = filteredItems;
      return this._listItems;
    });
  }

  addItem(name: string, quantity: number = 1) {
    const changes = store.get(this._changesAtom);
    const activeChange = changes[changes.length - 1];
    if (activeChange) {
      activeChange.addItem(name, quantity);
    }
  }

  get listAtom() {
    return this._listAtom;
  }
}