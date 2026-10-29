export type AccountProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  memberSince: string;
  address: {
    label: string;
    street: string;
    city: string;
    postalCode: string;
  };
};

export type OrderStatus =
  | "Delivered"
  | "In transit"
  | "Processing"
  | "Cancelled";

export type OrderItem = {
  id: string;
  name: string;
  variant: string;
  quantity: number;
  price: number;
  image: string;
};

export type CustomerOrder = {
  id: string;
  placedAt: string;
  status: OrderStatus;
  paymentMethod: string;
  shippingAddress: string;
  items: OrderItem[];
};

export const demoProfile: AccountProfile = {
  firstName: "Ariana",
  lastName: "Rahman",
  email: "ariana.rahman@example.com",
  phone: "+880 1712-345678",
  memberSince: "March 2024",
  address: {
    label: "Home",
    street: "House 24, Road 7, Dhanmondi",
    city: "Dhaka",
    postalCode: "1205",
  },
};

export const demoOrders: CustomerOrder[] = [
  {
    id: "NX-2026-1048",
    placedAt: "October 18, 2026",
    status: "In transit",
    paymentMethod: "Cash on delivery",
    shippingAddress: "House 24, Road 7, Dhanmondi, Dhaka 1205",
    items: [
      {
        id: "oxford-shirt",
        name: "Classic Oxford Shirt",
        variant: "Cloud white · M",
        quantity: 1,
        price: 2950,
        image: "https://picsum.photos/120/140?random=39",
      },
      {
        id: "leather-belt",
        name: "Everyday Leather Belt",
        variant: "Cognac · 34",
        quantity: 1,
        price: 1450,
        image: "https://picsum.photos/120/140?random=50",
      },
    ],
  },
  {
    id: "NX-2026-0972",
    placedAt: "September 26, 2026",
    status: "Delivered",
    paymentMethod: "bKash",
    shippingAddress: "House 24, Road 7, Dhanmondi, Dhaka 1205",
    items: [
      {
        id: "linen-shirt",
        name: "Relaxed Linen Shirt",
        variant: "Olive · M",
        quantity: 1,
        price: 3250,
        image: "https://picsum.photos/120/140?random=52",
      },
    ],
  },
  {
    id: "NX-2026-0831",
    placedAt: "August 09, 2026",
    status: "Processing",
    paymentMethod: "Cash on delivery",
    shippingAddress: "House 24, Road 7, Dhanmondi, Dhaka 1205",
    items: [
      {
        id: "denim-jacket",
        name: "Essential Denim Jacket",
        variant: "Washed blue · L",
        quantity: 1,
        price: 4890,
        image: "https://picsum.photos/120/140?random=43",
      },
      {
        id: "crew-tee",
        name: "Heavyweight Crew Tee",
        variant: "Black · L",
        quantity: 2,
        price: 1250,
        image: "https://picsum.photos/120/140?random=55",
      },
    ],
  },
  {
    id: "NX-2026-0614",
    placedAt: "June 14, 2026",
    status: "Cancelled",
    paymentMethod: "Card",
    shippingAddress: "House 24, Road 7, Dhanmondi, Dhaka 1205",
    items: [
      {
        id: "canvas-sneakers",
        name: "Canvas Low-Top Sneakers",
        variant: "Off white · 40",
        quantity: 1,
        price: 3650,
        image: "https://picsum.photos/120/140?random=58",
      },
    ],
  },
];

export const formatTaka = (amount: number) =>
  `৳${amount.toLocaleString("en-BD")}`;

export const getOrderTotal = (order: CustomerOrder) =>
  order.items.reduce((total, item) => total + item.price * item.quantity, 0);
