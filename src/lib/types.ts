export type BlogPost = {
  id: string;
  title: string;
  author: string;
  date: string;
  status: 'Published' | 'Draft';
};

export type Volunteer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  joined: string;
  avatarUrl: string;
};

export type Event = {
  id: string;
  name: string;
  date: string;
  location: string;
  attendees: number;
};

export type Contact = {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
};

export type Category = {
  _id: string;
  name: string;
};

export interface GalleryImage {
  _id: string
  image: Image
  altText: string
  imageDescription: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface Image {
  _id: string
  url: string
}
