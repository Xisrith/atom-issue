import { useAtom } from "jotai";
import { ListModel } from "./atoms";
import type { Item } from "./atoms";

const listModel = new ListModel([
  {
    items: [
      { name: "Item 1", quantity: 1 },
      { name: "Item 2", quantity: 1 },
    ],
  },
]);

interface RowProps {
  item: Item;
  onIncrement: () => void;
  onDecrement: () => void;
}

export const Row = ({ item, onIncrement, onDecrement }: RowProps) => {
  const increment = () => {
    onIncrement();
  }

  const decrement = () => {
    onDecrement();
  }

  return (
    <tr>
      <td className="px-3 py-2 text-sm text-gray-900">{item.name}</td>
      <td className="px-3 py-2 text-sm text-gray-900">
        <span>
          {item.quantity}
          <button onClick={increment}>Add</button>
          <button onClick={decrement}>Remove</button>
        </span>
      </td>
    </tr>
  )
}

export const Component = () => {
  const [items] = useAtom(listModel.itemsAtom);

  return (
    <table className="w-full">
      <thead>
        <tr>
          <th className="px-3 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-300">Item Name</th>
          <th className="px-3 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-300 w-20">Quantity</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <Row
            key={item.name}
            item={item}
            onIncrement={() => listModel.add(item.name, 1)}
            onDecrement={() => listModel.add(item.name, -1)}
          />
        ))}
      </tbody>
    </table>
  )
};