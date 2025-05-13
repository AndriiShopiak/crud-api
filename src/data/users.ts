import { v4 as uuidv4 } from 'uuid';

export const users = [
  {
    id: uuidv4(),
    username: 'Alice',
    age: 25,
    hobbies: ['reading', 'chess'],
  },
  {
    id: uuidv4(),
    username: 'Bob',
    age: 30,
    hobbies: [],
  },
];

