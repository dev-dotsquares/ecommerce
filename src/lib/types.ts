export type Category = {
  id: string;
  name: string;
  slug: string;
  image: string;
  subcategories?: {
    id:string;
    name: string;
    slug: string;
  }[];
};

export type Product = {
  id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  mrp: number;
  category: string; // slug
  brand: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  attributes: {
    [key: string]: string;
  };
  tags?: string[];
};

export type Review = {
  id: string;
  productId: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
};

export type Coupon = {
  code: string;
  type: 'percentage' | 'flat' | 'shipping';
  value: number;
  description: string;
};

export type CartItem = Product & {
  quantity: number;
};

export type Banner = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
}

export type ShippingAddress = {
  name: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}
