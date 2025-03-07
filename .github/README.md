# GitHub Actions Deployment

This repository uses GitHub Actions to deploy both the Next.js app and Firebase functions to production.

## Required Secrets

You need to add the following secrets to your GitHub repository:

1. `VERCEL_TOKEN`: Your Vercel API token
2. `VERCEL_ORG_ID`: Your Vercel organization ID
3. `VERCEL_PROJECT_ID`: Your Vercel project ID
4. `FIREBASE_TOKEN`: Your Firebase CLI token

## How to Get the Secrets

### Vercel Secrets

1. **VERCEL_TOKEN**:
   - Go to your Vercel account settings
   - Navigate to "Tokens"
   - Create a new token with "Full Account" scope

2. **VERCEL_ORG_ID and VERCEL_PROJECT_ID**:
   - Run `vercel link` in your project directory
   - The IDs will be stored in the `.vercel` directory in a file called `project.json`

### Firebase Token

1. **FIREBASE_TOKEN**:
   - Run `firebase login:ci` in your terminal
   - Copy the token that is displayed

## Workflow Overview

The GitHub Actions workflow does the following:

1. **Lint**: Runs ESLint on the codebase
2. **TypeScript Check**: Ensures all TypeScript code is valid
3. **Build and Deploy Next.js App**: Builds and deploys the Next.js app to Vercel
4. **Build and Deploy Firebase Functions**: Builds and deploys Firebase functions
5. **Preview Deployments**: Creates preview deployments for pull requests

## Disabling Automatic Deployments

To ensure that Vercel doesn't automatically deploy your app when you push to GitHub:

1. In the Vercel dashboard, go to your project settings
2. Navigate to the "Git" tab
3. Disable "Deploy on Push"

Alternatively, the `vercel.json` file in this repository already disables automatic deployments.

## Running Locally

To test the deployment process locally:

```bash
# Install dependencies
npm install

# Run linting
npm run lint

# Run TypeScript checks
npm run tsc

# Build the Next.js app
npm run build --workspace=apps/web

# Build Firebase functions
npm run build --workspace=apps/functions
``` 
