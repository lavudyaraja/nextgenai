// In-memory user storage (in a real app, this would be a database)
// This file is no longer used as we're now storing users in the database
// Keeping it for backward compatibility but it's not used in the current implementation
export let users: Array<{id: string, name: string, email: string, password: string}> = []
