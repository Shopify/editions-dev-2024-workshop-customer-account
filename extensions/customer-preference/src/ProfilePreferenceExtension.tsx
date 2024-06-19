import {
  BlockStack,
  Button,
  Card,
  Form,
  Heading,
  Icon,
  InlineStack,
  Modal,
  reactExtension,
  Select,
  Text,
} from "@shopify/ui-extensions-react/customer-account";
import { useState } from "react";

export default reactExtension(
  "customer-account.profile.block.render",
  async () => {
    const customerPreferences = await getCustomerPreferences();

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
  const [clothingCategory, setClothingCategory] = useState(
    props.clothingCategory ?? "",
  );

  const handleSubmit = () => {
    console.log(clothingCategory);
  };

  return (
    <Card padding>
      <BlockStack spacing="loose">
        <Heading level={3}>
          <InlineStack>
            <Text>Preferences</Text>
            <Button
              kind="plain"
              overlay={
                <Modal padding title="Edit preferences">
                  <Form onSubmit={handleSubmit}>
                    <BlockStack>
                      <Select
                        label="Clothing category"
                        options={[
                          {
                            label: "",
                            value: "",
                          },
                          {
                            label: "Kids",
                            value: "kids",
                          },
                          {
                            label: "Men",
                            value: "men",
                          },
                          {
                            label: "Women",
                            value: "women",
                          },
                        ]}
                        value={clothingCategory}
                        onChange={(value) => setClothingCategory(value)}
                      />
                      <InlineStack inlineAlignment="end">
                        <Button accessibilityRole="submit">Save</Button>
                      </InlineStack>
                    </BlockStack>
                  </Form>
                </Modal>
              }
            >
              <Icon source="pen" size="small" appearance="monochrome" />
            </Button>
          </InlineStack>
        </Heading>
        <BlockStack spacing="none">
          <Text appearance="subdued">Clothing category</Text>
          <Text>{translateClothingCategory(clothingCategory)}</Text>
        </BlockStack>
      </BlockStack>
    </Card>
  );
}

function translateClothingCategory(value?: string) {
  switch (value) {
    case "":
      return "";
    case "kids":
      return "Kids";
    case "men":
      return "Men";
    case "women":
      return "Women";
  }
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
