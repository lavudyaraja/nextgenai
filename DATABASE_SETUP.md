# Database Setup Guide

This project uses Neon PostgreSQL as its database. Here's how to set it up properly:

## Prerequisites

1. Ensure you have the correct `DATABASE_URL` in your `.env` file
2. Install all dependencies with `npm install`
3. Make sure Prisma CLI is installed

## Database Configuration

The project is configured to use PostgreSQL. The schema is defined in `prisma/schema.prisma`.

### Environment Variables

Make sure your `.env` file contains the correct database URL:

```env
DATABASE_URL="postgresql://neondb_owner:npg_hBRF2tg9DwHf@ep-fragrant-tree-a1jgbea1-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

## Setup Commands

1. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

2. **Push database schema:**
   ```bash
   npx prisma db push
   ```

3. **Run database setup script (optional):**
   ```bash
   npm run db:setup
   ```

## Database Schema

The database contains the following tables:

- `User` - User information
- `Post` - Blog posts
- `Conversation` - Chat conversations
- `Message` - Individual chat messages

## Troubleshooting

If you encounter connection issues:

1. Verify your `DATABASE_URL` is correct
2. Ensure your Neon database is active
3. Check that you have network access to the database
4. Make sure the database credentials are correct

## Migrations

To create new migrations:

```bash
npx prisma migrate dev --name migration_name
```

To reset the database:

```bash
npx prisma migrate reset
```