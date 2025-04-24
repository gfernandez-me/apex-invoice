import { Card as AlphaCard, EmptyState, Page, Text } from '@shopify/polaris'
import { notFoundImage } from '../assets'

export default function NotFound() {
	return (
		<Page>
			<AlphaCard>
				<EmptyState
					heading="There is no page at this address"
					image={notFoundImage}
				>
					<Text as="p" variant={'bodyMd'}>
						Check the URL and try again.
					</Text>
				</EmptyState>
			</AlphaCard>
		</Page>
	)
}
