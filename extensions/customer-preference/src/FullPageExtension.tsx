import { Banner, Page, reactExtension, useApi } from '@shopify/ui-extensions-react/customer-account';

export default reactExtension(
  "customer-account.page.render",
  () => <FullPageExtension />
);

function FullPageExtension() {
  const { extension, i18n } = useApi();

  return (
    <Page title={i18n.translate('fullPageTitle')}>
      <Banner>{i18n.translate('welcome', {target: extension.target})}</Banner>
    </Page>
  )
}