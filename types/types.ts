export type AddCity = {
  id: string;
  title: string;
  createdAt: string;
};

export type Category = {
  id: string;
  title: string;
  userId: string;
  city: string;
};
