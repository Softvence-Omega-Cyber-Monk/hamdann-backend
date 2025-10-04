export interface IProductVariation {
  image?: string;         // URL of variation image
  color?: string;         // color hex or name
  size?: string;          // e.g. S, M, L, XL
}

export interface IProduct {
  _id?: string;
  name: string;
  sku: string;
   category: "Fashion" | "Food" | "Beauty" | "Perfume"; 
  brand?: string;
  weight?: number;
  gender?: "male" | "female" | string;
  availableSizes?: string[];     // ["S", "M", "L", "XL"]
  availableColors?: string[];    // hex values or names
  variations?: IProductVariation[];
  description : string;
  quantity: number;
  price: number;
  productImages?: string[];             // main + additional images
  createdAt?: Date;
  updatedAt?: Date;
}
