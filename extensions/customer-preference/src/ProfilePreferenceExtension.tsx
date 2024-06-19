import {
  reactExtension,
  Text,
} from "@shopify/ui-extensions-react/customer-account";

export default reactExtension("customer-account.profile.block.render", () => (
  <ProfilePreferenceExtension />
));

function ProfilePreferenceExtension() {
  return <Text>Hello world</Text>;
}
