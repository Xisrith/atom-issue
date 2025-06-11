import { useAtom, useAtomValue } from "jotai";
import { ChangeList, Item, List } from "./atoms";

const list = new List([
  new ChangeList([
    new Item("Item 1", 1),
    new Item("Item 2", 1),
  ]),
  new ChangeList([]),
]);

interface RowProps {
  item: Item;
  list: List;
}

export const Row = ({ item, list }: RowProps) => {
  const [quantity] = useAtom(item.quantityAtom);

  const increment = () => {
    list.addItem(item.name, 1);
  }

  const decrement = () => {
    list.addItem(item.name, -1);
  }

  return (
    <tr>
      <td className="px-3 py-2 text-sm text-gray-900">{item.name}</td>
      <td className="px-3 py-2 text-sm text-gray-900">
        <span>
          {quantity}
          <button onClick={increment}>Add</button>
          <button onClick={decrement}>Remove</button>
        </span>
      </td>
    </tr>
  )
}

export const Component = () => {
  const items = useAtomValue(list.listAtom);

  return (
    <table className="w-full">
      <thead>
        <tr>
          <th className="px-3 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-300">Item Name</th>
          <th className="px-3 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-300 w-20">Quantity</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => <Row key={item.name} item={item} list={list} />)}
      </tbody>
    </table>
  )
};