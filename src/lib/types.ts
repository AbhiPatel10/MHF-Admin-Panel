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
  id: string;
  name: string;
};
