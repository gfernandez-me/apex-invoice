import {
	Popover,
	Box,
	ChoiceList,
	VerticalStack as AlphaStack,
	Button,
	IndexTable,
	EmptySearchResult,
	EmptyState,
	Filters,
	useIndexResourceState,
	Pagination,
	type AppliedFilterInterface,
	type FilterInterface,
} from '@shopify/polaris'
import { ArrowUpMinor, ArrowDownMinor, SortMinor } from '@shopify/polaris-icons'
import { useState, useMemo, useCallback, type SetStateAction } from 'react'
import { notFoundImage } from '../../assets'
import { useToggle } from '../../hooks/useToggle'
import { type RouterInputs, trpc } from '../../utils/trpc'
import { InvoiceRowItem } from './InvoiceRowItem'

type QueryInvoicesInput = RouterInputs['invoice']['list']

type SortOrder = 'asc' | 'desc'

export function InvoiceList() {
	const [queryValue, setQueryValue] = useState<string | undefined>(undefined)

	const [emailSent, setEmailSent] = useState<['sent' | 'unsdent'] | undefined>(
		undefined,
	)

	const [orderBy, setOrderBy] =
		useState<keyof NonNullable<QueryInvoicesInput['orderBy']>>('processed_at')

	const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

	const [cursor, setCursor] = useState<string | null>()

	const resetCursor = useCallback(() => {
		setCursor(null)
	}, [])

	const orderByKey = useMemo(() => {
		switch (orderBy) {
			case 'processed_at':
				return { processed_at: sortOrder }
			default:
				return { processed_at: sortOrder ?? 'desc' }
		}
	}, [orderBy, sortOrder])

	const sent = !emailSent ? undefined : emailSent[0] === 'sent' ? true : false

	const {
		data: invoiceQuery,
		isLoading,
		isFetching,
	} = trpc.invoice.list.useQuery(
		{
			sent,
			text: queryValue,
			orderBy: orderByKey,
			cursor,
		},
		{
			refetchOnWindowFocus: false,
			refetchInterval: 10000,
		},
	)

	const invoices = invoiceQuery?.data ?? []

	const pagination = invoiceQuery?.pagination

	const handleEmailSent = useCallback(
		(selected: string[]) => {
			resetCursor()
			setEmailSent(selected as ['sent' | 'unsdent'])
		},
		[resetCursor],
	)

	const handleQueryValueChange = useCallback(
		(value: SetStateAction<string | undefined>) => {
			resetCursor()
			setQueryValue(value)
		},
		[resetCursor],
	)

	const handleOrderBy = useCallback(
		(value: string[]) => {
			resetCursor()
			setOrderBy(value[0] as keyof NonNullable<QueryInvoicesInput['orderBy']>)
		},
		[resetCursor],
	)

	const handleQueryValueRemove = useCallback(() => {
		setQueryValue(undefined)
	}, [])

	const handleEmailSentRemove = useCallback(() => {
		resetCursor()
		setEmailSent(undefined)
	}, [resetCursor])

	const handleClearAll = useCallback(() => {
		resetCursor()
		handleQueryValueRemove()
		handleEmailSentRemove()
	}, [resetCursor, handleQueryValueRemove, handleEmailSentRemove])

	const { selectedResources, allResourcesSelected, handleSelectionChange } =
		useIndexResourceState(invoices)

	const [sortByPopoverActive, toggleSortByPopoverActive] = useToggle(false)

	const appliedFilters: AppliedFilterInterface[] = !isEmpty(emailSent)
		? [
				{
					key: 'emailSent',
					label: disambiguateLabel('emailSent', emailSent),
					onRemove: handleEmailSentRemove,
				},
			]
		: []

	const filters: FilterInterface[] = [
		{
			key: 'emailSent',
			label: 'Email Status',
			filter: (
				<ChoiceList
					titleHidden
					title={'Email Status'}
					selected={emailSent ?? []}
					choices={[
						{ label: 'Sent', value: 'sent' },
						{ label: 'Unsent', value: 'unsent' },
					]}
					onChange={handleEmailSent}
				/>
			),
			shortcut: true,
		},
	]

	const resourceName = { singular: 'invoice', plural: 'invoices' }

	const emptyStateMarkup =
		queryValue && !invoiceQuery?.data.length ? (
			<EmptySearchResult
				title={'No invoices yet'}
				description={'Try changing the filters or search term'}
				withIllustration
			/>
		) : (
			<EmptyState heading="Manage Invoices" image={notFoundImage}>
				<p>
					Invoices will be created automatically, please wait for a new order to
					be placed.
				</p>
			</EmptyState>
		)
	const filterControl = (
		<Filters
			queryPlaceholder={'Filter invoices'}
			queryValue={queryValue}
			filters={filters}
			appliedFilters={appliedFilters}
			onQueryChange={handleQueryValueChange}
			onQueryClear={handleQueryValueRemove}
			onClearAll={handleClearAll}
		/>
	)

	const promotedBulkActions = [
		{
			content: 'Send Invoice',
			onAction: () => console.log('Todo: implement'),
		},
		{
			content: 'Download Invoice',
			onAction: () => console.log('Todo: implement'),
		},
	]

	const sortOptions = [{ label: 'Date', value: 'processed_at' }]

	const rowMarkup = invoices.map((item, index) => (
		<InvoiceRowItem
			key={item._id}
			item={item}
			index={index}
			selected={selectedResources.includes(item._id)}
		/>
	))

	const sortByactivator = (
		<Button
			onClick={toggleSortByPopoverActive}
			disclosure
			icon={SortMinor}
			disabled={isLoading}
		/>
	)

	const handleSortByChange = useCallback(
		(value: SortOrder) => {
			resetCursor()
			setSortOrder(value)
		},
		[resetCursor],
	)

	return (
		<>
			<div style={{ padding: '16px', display: 'flex' }}>
				<div style={{ flex: 1 }}>{filterControl}</div>
				<div style={{ paddingLeft: '0.25rem' }}>
					<Popover
						fluidContent
						active={sortByPopoverActive}
						activator={sortByactivator}
						onClose={toggleSortByPopoverActive}
					>
						<Box padding="4">
							<ChoiceList
								title="Sort by"
								choices={sortOptions}
								selected={[orderBy]}
								onChange={handleOrderBy}
							/>
						</Box>
						<Box padding="4">
							<AlphaStack>
								<Button
									plain
									removeUnderline
									icon={ArrowUpMinor}
									pressed={sortOrder === 'asc'}
									onClick={() => handleSortByChange('asc')}
								>
									Oldest to newest
								</Button>
								<Button
									plain
									removeUnderline
									pressed={sortOrder === 'desc'}
									icon={ArrowDownMinor}
									onClick={() => handleSortByChange('desc')}
								>
									Nestest to oldest
								</Button>
							</AlphaStack>
						</Box>
					</Popover>
				</div>
			</div>
			<IndexTable
				emptyState={emptyStateMarkup}
				itemCount={invoices.length}
				selectedItemsCount={
					allResourcesSelected ? 'All' : selectedResources.length
				}
				resourceName={resourceName}
				loading={isFetching}
				promotedBulkActions={promotedBulkActions}
				onSelectionChange={handleSelectionChange}
				headings={[
					{ title: 'Number' },
					{ title: 'Date' },
					{ title: 'Customer' },
					{ title: 'Payment Status' },
					{ title: 'Fulfilment Status' },
					{ title: 'Total' },
				]}
			>
				{rowMarkup}
			</IndexTable>
			<Box padding="8">
				<AlphaStack align="center">
					<Pagination
						hasNext={!!pagination?.nextCursor}
						onNext={() => {
							resetCursor()
							setCursor(pagination?.nextCursor)
						}}
					/>
				</AlphaStack>
			</Box>
		</>
	)
}

function isEmpty(value: unknown) {
	if (Array.isArray(value)) {
		return value.length === 0
	} else {
		return value === '' || value == null
	}
}

function disambiguateLabel(key: string, value: string | string[] | undefined) {
	switch (key) {
		case 'emailSent':
			return `Email ${value}`
		default:
			return `${value}`
	}
}
