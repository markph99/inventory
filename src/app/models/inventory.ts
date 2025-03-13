import { ProductEntry } from "./productEntry";

export interface Inventory {
  _id?: string;
  purpose: string;
  addedBy: string;
  location: string;
  itemName: string;
  quantity: number;
  status: 'incoming' | 'outgoing';
  products: ProductEntry[];
  createdAt?: Date;
}
