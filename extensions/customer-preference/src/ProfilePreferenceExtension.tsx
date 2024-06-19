import {
  BlockStack,
  Card,
  Heading,
  reactExtension,
  Text,
} from "@shopify/ui-extensions-react/customer-account";

export default reactExtension("customer-account.profile.block.render", () => (
  <ProfilePreferenceExtension />
));

function ProfilePreferenceExtension() {
  return (
    <Card padding>
      <BlockStack spacing="loose">
        <Heading level={3}>Preferences</Heading>
        <BlockStack spacing="none">
          <Text appearance="subdued">Clothing Category</Text>
          <Text>TODO</Text>
        </BlockStack>
      </BlockStack>
    </Card>
  );
}
