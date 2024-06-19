import "@shopify/shopify-app-remix/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  DeliveryMethod,
  shopifyApp,
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import { restResources } from "@shopify/shopify-api/rest/admin/2024-04";
import prisma from "./db.server";
import type { AdminApiContext } from "node_modules/@shopify/shopify-app-remix/dist/ts/server/clients";
import type { ShopifyRestResources } from "@shopify/shopify-api";

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.Unstable,
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  restResources,
  webhooks: {
    APP_UNINSTALLED: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: "/webhooks",
    },
  },
  hooks: {
    afterAuth: async ({ admin, session }) => {
      await shopify.registerWebhooks({ session });

      try {
        const metafield = await getMetafieldDefinition(admin);

        if (metafield == null) {
          await createMetafieldDefinition(admin);
        }
      } catch (error: any) {
        if ("graphQLErrors" in error) {
          console.error(error.graphQLErrors);
        } else {
          console.error(error);
        }

        throw error;
      }
    },
  },
  future: {
    unstable_newEmbeddedAuthStrategy: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});

export default shopify;
export const apiVersion = ApiVersion.April24;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;

async function getMetafieldDefinition(
  admin: AdminApiContext<ShopifyRestResources>,
) {
  const response = await admin.graphql(getMetafieldDefinitionQuery, {
    variables: {
      key: "clothing-category",
      namespace: "$app:preferences",
      ownerType: "CUSTOMER",
    },
  });

  const json = await response.json();
  return json.data?.metafieldDefinitions.nodes[0];
}

const getMetafieldDefinitionQuery = `#graphql
query getMetafieldDefinition($key: String!, $namespace: String!, $ownerType: MetafieldOwnerType!) {
  metafieldDefinitions(first: 1, key: $key, namespace: $namespace, ownerType: $ownerType) {
    nodes {
      id
    }
  }
}
`;

async function createMetafieldDefinition(
  admin: AdminApiContext<ShopifyRestResources>,
) {
  const response = await admin.graphql(createMetafieldDefinitionMutation, {
    variables: {
      definition: {
        access: {
          customerAccount: "READ_WRITE",
          admin: "PRIVATE",
        },
        key: "clothing-category",
        name: "The customer's preferred clothing category",
        namespace: "$app:preferences",
        ownerType: "CUSTOMER",
        type: "single_line_text_field",
      },
    },
  });

  const json = await response.json();
  console.log(JSON.stringify(json, null, 2));
}

const createMetafieldDefinitionMutation = `#graphql
mutation metafieldDefinitionCreate($definition: MetafieldDefinitionInput!) {
  metafieldDefinitionCreate(definition: $definition) {
    createdDefinition {
      key
      namespace
    }
    userErrors {
      field
      message
    }
  }
}
`;
