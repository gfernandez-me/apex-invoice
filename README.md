# Shopify App - Invoice Management System

This is a Shopify app that provides invoice management functionality for Shopify
stores. It allows merchants to view and manage their invoices directly from
their Shopify admin panel.

## Tech Stack

This template combines a number of third party open-source tools:

- [Express](https://expressjs.com/) builds the backend.
- [Vite](https://vitejs.dev/) builds the [React](https://reactjs.org/) frontend.
- [React Router](https://reactrouter.com/) is used for routing. We wrap this
  with file-based routing.
- [React Query](https://react-query.tanstack.com/) queries the Admin API.

The following Shopify tools complement these third-party tools to ease app
development:

- [Shopify API library](https://github.com/Shopify/shopify-node-api) adds OAuth
  to the Express backend. This lets users install the app and grant scope
  permissions.
- [App Bridge React](https://shopify.dev/apps/tools/app-bridge/getting-started/using-react)
  adds authentication to API requests in the frontend and renders components
  outside of the App's iFrame.
- [Polaris React](https://polaris.shopify.com/) is a powerful design system and
  component library that helps developers build high quality, consistent
  experiences for Shopify merchants.
- [Custom hooks](https://github.com/Shopify/shopify-frontend-template-react/tree/main/hooks)
  make authenticated requests to the Admin API.
- [File-based routing](https://github.com/Shopify/shopify-frontend-template-react/blob/main/Routes.jsx)
  makes creating new pages easier.

## Getting started

### Requirements

1. You must [download and install Node.js](https://nodejs.org/en/download/) if
   you don't already have it.
2. You must
   [create a Shopify partner account](https://partners.shopify.com/signup) if
   you don't have one.
3. You must
   [create a development store](https://help.shopify.com/en/partners/dashboard/development-stores#create-a-development-store)
   if you don't have one.

### Installing the template

#### Local Development

For a better developer experience it is recommended to use the remote vscode
container, which has all the settings ready in addition to the database.

[The Shopify CLI](https://shopify.dev/apps/tools/cli) connects to an app in your
Partners dashboard. It provides environment variables, runs commands in
parallel, and updates application URLs for easier development.

You can develop locally using your pnpm package manager. Run one of the
following commands from the root of your app.

Using turbo:

```shell
turbo run dev
```

Open the URL generated in your console. Once you grant permission to the app,
you can start development.

#### PNPM cheatsheet

- [pnpm](https://pnpm.io/) Fast, disk space efficient package manager

```shell
#install
pnpm install

# Add on root
pnpm  add <pkg>

# Add on backend
pnpm --filter backend add <pkg>

# Add on frontend
pnpm --filter frontend add <pkg>

#Add as dev
pnpm --filter add <pkg> -D
```

## Deployment

### Generate Shopify GraphqQL Schema (optional)

- Fill out your .env.schema file

  - SHOP: Dev stores url
  - APP_OFFLINE_ACCESSTOKEN: Offile Token
  - SHOPIFY_API_VERSION: Api Version

- Run using pnpm:
  ```shell
  pnpm get-schema
  ```

### Application Storage

### Build

The frontend is a single page app. It requires the `SHOPIFY_API_KEY`, which you
can find on the page for your app in your partners dashboard. Paste your app's
key in the command for the package manager of your choice:

Using pnpm:

```shell
cd web/frontend/ && SHOPIFY_API_KEY=REPLACE_ME pnpm run build
```

You do not need to build the backend.

## Hosting

## Known issues

## Developer resources

- [Introduction to Shopify apps](https://shopify.dev/apps/getting-started)
- [App authentication](https://shopify.dev/apps/auth)
- [Shopify CLI](https://shopify.dev/apps/tools/cli)
- [Shopify API Library documentation](https://github.com/Shopify/shopify-api-js#readme)

## Admin Integration

This app uses Shopify's
[Admin Link Extensions](https://shopify.dev/docs/apps/build/admin/admin-links)
to appear in the "More actions" menu of the Shopify admin interface. This allows
merchants to easily access invoice management features directly from their order
details page.
