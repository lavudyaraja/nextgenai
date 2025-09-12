// In-memory user storage (in a real app, this would be a database)
export let users: Array<{id: string, name: string, email: string, password: string}> = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123', // In a real app, this would be hashed
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password456', // In a real app, this would be hashed
  }
]