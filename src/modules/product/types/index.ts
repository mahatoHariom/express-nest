import { User } from "src/modules/user/types";


export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  originalPrice: number;
  discountPrice: number;
  stock: number;
  user: User;
  userId: number;
  soldOut?: number | null;
  createdAt: Date;
  updatedAt: Date;
  images: Image[];
}

interface Image {
  id: string;
  public_id: string;
  imgSrc: string;
  product?: Product;
  productId?: number | null;
}
