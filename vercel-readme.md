# Frontend Deployment to Vercel

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out their [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Build Configuration

For Vercel deployment, ensure your `package.json` has:

```json
{
  "scripts": {
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "dev": "next dev"
  }
}
```

Committer: Vercel Bot <noreply+github-actions@github.com>
After account verification, your team members can deploy to Vercel by pushing to the main branch, or by creating a preview deployment for pull requests.

For this project to deploy successfully, you'll need to set up the following environment variables in your Vercel dashboard:

## Environment Variables for Vercel

Go to your Vercel dashboard → Project Settings → Environment Variables:

- `APP_ID`: Your application identifier
- `APP_URL`: Your application URL (usually https://your-app.vercel.app)
- `DATABASE_URL`: Your database connection string (for PostgreSQL or similar)
- `JWT_SECRET`: A secure random string for JWT token signing
- `API_URL`: Backend API URL (for production deployment)
- `NEXT_PUBLIC_API_URL`: Frontend-accessible API URL (used in browser)

Example values:
- `APP_ID`: `customo-robotics-hub`
- `APP_URL`: `https://customo-robotics-hub.vercel.app`
- `DATABASE_URL`: `postgresql://username:password@host:port/database`
- `JWT_SECRET`: Generate a secure random string (32+ characters)
- `API_URL`: `https://your-backend-api.com/api` (point to your deployed backend)
- `NEXT_PUBLIC_API_URL`: Same as API_URL, prefixed with `NEXT_PUBLIC_` for client access

## Backend Deployment Note

This project includes a separate Java Spring Boot backend. You'll need to deploy the backend separately (e.g., to Railway, Heroku, or AWS) and update the `API_URL` and `NEXT_PUBLIC_API_URL` environment variables accordingly.

## Deployment Steps

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Set the environment variables as described above
4. Deploy

Vercel will automatically build and deploy your application when you push to the main branch.
