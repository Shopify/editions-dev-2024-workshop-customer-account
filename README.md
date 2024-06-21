# Editions.dev 2024 customer account workshop

[Workshop walkthrough](https://shopify.dev/workshops/customer)

This is a blank Shopify app and customer account UI extension generated through the Shopify CLI. It's using Remix, TypeScript, and React.

Rather than cloning this repo, you can use the Shopify CLI to generate the equivalent with these steps:

```bash
npm init @shopify/app@latest
cd <project>
npm run shopify app generate extension
npm run dev
```

## Quick start

Clone the repository, install node dependencies, and then run the preview server to make sure everything works. That last step will ask you to connect this app to your Shopify partners account, and to create a Shopify app for it. Make sure the store connect it to was created using the [customer account extensibility dev preview](https://shopify.dev/docs/api/release-notes/developer-previews#checkout-and-customer-accounts-extensibility-developer-preview).

```bash
git clone https://github.com/Shopify/editions-dev-2024-workshop-customer-account.git
cd editions-dev-2024-workshop-customer-account
npm install
npm run dev
```

## Branches

The `main` branch contains the starting point to follow during the workshop. The whole workshop can be completed using it. If you ever get stuck on one step, you can use the other branches to catch-up. Each of them contains the expected end result of that step.

## Local development

### Run the preview server

```shell
npm run dev
```

Press P to open the URL to your app. Once you click install, you can start development.

Local development is powered by [the Shopify CLI](https://shopify.dev/docs/apps/tools/cli). It logs into your partners account, connects to an app, provides environment variables, updates remote config, creates a tunnel and provides commands to generate extensions.

## Common errors

### Error after changing branch

If you receive this error after changing to one of the provided branch:

```
╭─ error ──────────────────────────────────────────────────────────────────────────────────╮
│                                                                                          │
│  App configuration is not valid                                                          │
│  Validation errors in shopify.app.toml:                                                  │
│                                                                                          │
│  • [handle]: String can't contain special characters                                     │
│                                                                                          │
│                                                                                          │
╰──────────────────────────────────────────────────────────────────────────────────────────╯
```

...you can most likely fix it by running the partners connection process again. This will ask you which account to use, whether to create a new app or re-use an existing one, etc.

```bash
npm run shopify app config link
```

### Missing API permissions

Make sure you deployed any changes to the `access_scopes` your app needs. After the deploy, while the preview server is running, you also need to install (or re-install) the app to your dev store.

```shell
npm run deploy
npm run dev
# followed by installing the app on your store
```
