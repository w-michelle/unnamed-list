export type AddCity = {
  id: string;
  title: string;
  createdAt: string;
};

export type City = {
  id: string;
  title: string;
  createdAt: string;
  categories: Category[] | null;
};

export type Category = {
  id: string;
  title: string;
  userId: string;
  city: string;
  items: Item[] | null;
};

export type Item = {
  city: string;
  description: string | null;
  id: string;
  imageSrc: string | "";
  imageUrl: string | "";
  itemCategory: string;
  title: string;
  createdAt: string;
};
