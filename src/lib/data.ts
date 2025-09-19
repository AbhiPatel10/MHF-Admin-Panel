import { BlogPost, Volunteer, Event, Contact, Category, GalleryImage } from './types';

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Our Annual Charity Gala was a Success!',
    author: 'Jane Doe',
    date: '2023-10-28',
    status: 'Published',
  },
  {
    id: '2',
    title: 'New Volunteer Opportunities This Fall',
    author: 'John Smith',
    date: '2023-09-15',
    status: 'Published',
  },
  {
    id: '3',
    title: 'Recap: Community Clean-Up Day',
    author: 'Jane Doe',
    date: '2023-08-05',
    status: 'Published',
  },
  {
    id: '4',
    title: 'Upcoming Workshop: Grant Writing Basics',
    author: 'Admin',
    date: '2023-11-01',
    status: 'Draft',
  },
];

export const volunteers: Volunteer[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '123-456-7890',
    joined: '2022-03-12',
    avatarUrl: 'https://picsum.photos/seed/v1/40/40',
  },
  {
    id: '2',
    name: 'Bob Williams',
    email: 'bob@example.com',
    phone: '234-567-8901',
    joined: '2021-07-22',
    avatarUrl: 'https://picsum.photos/seed/v2/40/40',
  },
  {
    id: '3',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    phone: '345-678-9012',
    joined: '2023-01-05',
    avatarUrl: 'https://picsum.photos/seed/v3/40/40',
  },
  {
    id: '4',
    name: 'Diana Prince',
    email: 'diana@example.com',
    phone: '456-789-0123',
    joined: '2022-11-30',
    avatarUrl: 'https://picsum.photos/seed/v4/40/40',
  },
];

export const events: Event[] = [
  {
    id: '1',
    name: 'Annual Charity Gala',
    date: '2023-10-27',
    location: 'Grand Ballroom',
    attendees: 250,
  },
  {
    id: '2',
    name: 'Tech for Good Workshop',
    date: '2023-11-15',
    location: 'Online',
    attendees: 120,
  },
  {
    id: '3',
    name: 'Food Drive',
    date: '2023-12-01',
    location: 'Community Center',
    attendees: 75,
  },
  {
    id: '4',
    name: 'Holiday Toy Drive',
    date: '2023-12-18',
    location: 'City Hall',
    attendees: 0,
  },
];

export const contacts: Contact[] = [
  {
    id: '1',
    name: 'Emily Carter',
    email: 'emily.c@example.com',
    message:
      'Hello, I am a software developer with an interest in educational outreach. Are there any opportunities where I can use my technical skills to help teach kids about coding?',
    date: '2023-10-20',
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'm.chen@example.com',
    message:
      "I'm passionate about the environment and would love to get involved in any local conservation or clean-up events you have planned.",
    date: '2023-10-18',
  },
  {
    id: '3',
    name: 'Sarah Rodriguez',
    email: 'sarah.r@example.com',
    message:
      "I have a background in event planning and logistics. I'd be happy to help organize or manage any upcoming fundraising events.",
    date: '2023-10-15',
  },
  {
    id: '4',
    name: 'David Lee',
    email: 'david.lee@example.com',
    message:
      "I enjoy working with animals and would like to volunteer at a shelter or with animal rescue operations. Please let me know if you have any programs like that.",
    date: '2023-10-12',
  },
];

export const categories: Category[] = [
  {
    _id: '1',
    name: 'Fundraising',
  },
  {
    _id: '2',
    name: 'Community Outreach',
  },
  {
    _id: '3',
    name: 'Education',
  },
  {
    _id: '4',
    name: 'Environmental',
  },
];

export const galleryImages: GalleryImage[] = [
  { id: '1', url: 'https://picsum.photos/seed/img1/600/400', description: 'A sunny day at the grand opening of our new community garden.', uploaded: '2023-10-15' },
  { id: '2', url: 'https://picsum.photos/seed/img2/600/400', description: 'Participants crossing the finish line at our 5k charity run.', uploaded: '2023-09-20' },
  { id: '3', url: 'https://picsum.photos/seed/img3/600/400', description: 'Young minds at work during our weekend coding workshop.', uploaded: '2023-08-01' },
  { id: '4', url: 'https://picsum.photos/seed/img4/600/400', description: 'Volunteers sorting donations during our annual food drive.', uploaded: '2023-07-25' },
  { id: '5', url: 'https://picsum.photos/seed/img5/600/400', description: 'A memorable night of fundraising and celebration at our annual gala.', uploaded: '2023-06-10' },
  { id: '6', url: 'https://picsum.photos/seed/img6/600/400', description: 'Celebrating the incredible people who make our work possible.', uploaded: '2023-05-30' },
];
