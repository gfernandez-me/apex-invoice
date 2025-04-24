import {
  SkeletonPage,
  Layout,
  LegacyCard,
  SkeletonBodyText,
} from '@shopify/polaris';

export function InvoiceSkeleton() {
  return (
    <SkeletonPage>
      <Layout>
        <Layout.Section>
          <LegacyCard sectioned>
            <SkeletonBodyText lines={25} />
          </LegacyCard>
        </Layout.Section>
      </Layout>
    </SkeletonPage>
  );
}
