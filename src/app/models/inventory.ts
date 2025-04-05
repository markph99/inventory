import { ProductEntry } from "./productEntry";
import { Room } from "./room";

export interface Inventory {
  _id?: string;
  purpose: string;
  addedBy: string;
  location: Room;
  itemName?: string;
  quantity?: number;
  status: 'incoming' | 'outgoing';
  products: ProductEntry[];
  createdAt?: Date;
}
