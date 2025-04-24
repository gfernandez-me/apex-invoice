import {
	Card as AlphaCard,
	VerticalStack as AlphaStack,
	Banner,
	Box,
	Button,
	Form,
	Frame,
	Page,
	ProgressBar,
	Text,
	TextField,
	Toast,
} from '@shopify/polaris'
import { IncomingMajor } from '@shopify/polaris-icons'
import { useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'
import { useState } from 'react'
import { useToggle } from '../hooks/useToggle'
import { trpc } from '../utils/trpc'

// Settings Component
//
// Overview:
// The Settings component allows users to manually trigger synchronization processes for invoices
// and to manage synchronization by specific IDs. It utilizes several hooks and components from
// the Polaris library and the trpc library for data fetching and mutation.
//
// Functionalities:
// 1. Manual Synchronization:
//    - Triggered by a button press.
//    - Calls the mutateAsync function from a mutation hook to start the synchronization process.
//    - Upon completion, it invalidates related queries to ensure the UI is updated with the latest data.
//
// 2. Synchronization by IDs:
//    - Allows users to enter specific IDs for targeted synchronization.
//    - Utilizes a form where IDs can be submitted.
//    - Similar to manual synchronization, it triggers mutations and invalidates queries upon completion.
//
// Error Handling:
// - Displays error banners using the Banner component if there are issues during the synchronization processes.
//
// UI Components:
// - Progress Indicators: Uses ProgressBar to show the progress of ongoing synchronization processes.
// - Conditional Rendering: Elements like buttons and progress bars are conditionally rendered based on the state of the synchronization.
//
// Dependencies:
// - Polaris Components and Icons: Imported from @shopify/polaris and @shopify/polaris-icons.
// - React Query and tRPC: Used for data fetching and mutations, configured in other parts of the application.
export default function Settings() {
	const queryClient = useQueryClient()

	const { mutateAsync, isPending, isError } = trpc.invoice.sync.useMutation()
	const {
		mutateAsync: mutateAsyncByIds,
		isPending: isPendingByIds,
		isError: isErrorByIds,
	} = trpc.invoice.syncByIds.useMutation()

	const { data: syncStatus } = trpc.invoice.syncStatus.useQuery(undefined, {
		refetchInterval: 5000,
		initialData: { progress: 0, running: false },
	})
	const { data: syncByIdsStatus } = trpc.invoice.syncByIdsStatus.useQuery(
		undefined,
		{
			refetchInterval: 5000,
			initialData: { progress: 0, running: false },
		},
	)

	const syncStatusKey = getQueryKey(trpc.invoice.syncStatus, undefined, 'query')
	const syncByIdsStatusKey = getQueryKey(
		trpc.invoice.syncByIdsStatus,
		undefined,
		'query',
	)

	const [isActive, toggleActive] = useToggle()

	const handleSync = () => {
		mutateAsync()
			.then(toggleActive)
			.then(() => {
				queryClient.invalidateQueries({ queryKey: syncStatusKey })
			})
	}
	const toastMarkup = isActive ? (
		<Toast
			content="Sync initialized"
			onDismiss={toggleActive}
			duration={4500}
		/>
	) : null

	// FORCE SYNC BY ORDER NUMBER
	const handleSyncByIds = () => {
		// Trim whitespace, split by commas, and filter out empty strings
		const idList = ids
			.trim()
			.split(',')
			.map((id) => id.trim())
			.filter((id) => id.length > 0)

		// Check if no IDs are provided
		if (idList.length === 0) {
			return // Exit the function if no IDs are provided
		}

		mutateAsyncByIds({ ids: idList.join(',') })
			.then(toggleActive)
			.then(() => {
				queryClient.invalidateQueries({ queryKey: syncByIdsStatusKey })
			})
	}

	const [ids, setIds] = useState('')
	const handleInputChange = (value: string) => setIds(value)

	return (
		<Frame>
			<Page title="Settings">
				<AlphaStack gap="16" align="center">
					<AlphaStack>
						<Box
							as="section"
							paddingInlineStart={{ xs: '4', sm: '0' }}
							paddingInlineEnd={{ xs: '2', sm: '0' }}
						>
							<AlphaStack gap="4">
								<Text as="h3" variant="headingMd">
									Invoices Syncronization
								</Text>
								<Text as="p" variant="bodyMd">
									Invoices will be created automatically, however it is possible
									to force a 30 days synchronization.
								</Text>
							</AlphaStack>
							{toastMarkup}
						</Box>
						<AlphaCard roundedAbove="sm">
							<AlphaStack gap="4">
								{isError && (
									<Banner status="warning">
										Someting went worng, Please try again in few minutes.
									</Banner>
								)}
								{syncStatus.running && (
									<ProgressBar progress={syncStatus.progress} />
								)}
								<Button
									icon={IncomingMajor}
									loading={isPending}
									disabled={syncStatus?.running || syncByIdsStatus?.running}
									onClick={handleSync}
								>
									Manual Sync
								</Button>
							</AlphaStack>
						</AlphaCard>
						<AlphaCard roundedAbove="sm">
							<Form onSubmit={handleSyncByIds}>
								<AlphaStack gap="4">
									{isErrorByIds && (
										<Banner status="warning">
											Someting went worng, Please try again in few minutes.
										</Banner>
									)}
									<TextField
										label="IDs max 10 (comma separated) e.g. 6029401194595,6029401194596,6029401194595"
										onChange={handleInputChange}
										autoComplete="off"
										value={ids}
									/>
								</AlphaStack>
								<AlphaStack gap="4">
									<Button
										submit
										icon={IncomingMajor}
										loading={isPendingByIds}
										disabled={syncByIdsStatus?.running || syncStatus?.running}
									>
										Force Sync by IDs
									</Button>
								</AlphaStack>
							</Form>
						</AlphaCard>
					</AlphaStack>
				</AlphaStack>
			</Page>
		</Frame>
	)
}
