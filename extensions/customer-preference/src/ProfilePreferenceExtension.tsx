import {
  BlockStack,
  Card,
  Heading,
  reactExtension,
  Text,
} from "@shopify/ui-extensions-react/customer-account";

export default reactExtension(
  "customer-account.profile.block.render",
  async () => {
    const customerPreferences = await getCustomerPreferences();

    console.log(customerPreferences);

    return (
      <ProfilePreferenceExtension
        clothingCategory={customerPreferences.clothingCategory}
      />
    );
  },
);

interface Props {
  clothingCategory?: string;
}

function ProfilePreferenceExtension(props: Props) {
  return (
    <Card padding>
      <BlockStack spacing="loose">
        <Heading level={3}>Preferences</Heading>
        <BlockStack spacing="none">
          <Text appearance="subdued">Clothing category</Text>
          <Text>{props.clothingCategory}</Text>
        </BlockStack>
      </BlockStack>
    </Card>
  );
}

async function getCustomerPreferences() {
  const response = await fetch(
    "shopify:customer-account/api/2024-07/graphql.json",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `query preferences($namespace: String!, $key: String!) {
          customer {
            metafield(namespace: $namespace, key: $key) {
              value
            }
          }
        }`,
        variables: {
          key: "clothing-category",
          namespace: "$app:preferences",
        },
      }),
    },
  );

  const { data } = await response.json();

  return {
    clothingCategory: data.customer.metafield?.value,
  };
}
