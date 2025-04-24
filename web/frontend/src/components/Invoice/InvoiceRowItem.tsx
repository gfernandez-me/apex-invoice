import { useNavigate } from '@shopify/app-bridge-react'
import { Badge, IndexTable, Link, Text } from '@shopify/polaris'
import { useI18n } from '@shopify/react-i18n'
import { formatRelative } from 'date-fns'
import { startCase, lowerCase } from 'lodash/fp'
import { type PropsWithChildren, useMemo } from 'react'
// import { useNavigate } from 'react-router-dom';
import { locale } from '../../utils/formatRelative'
import { type RouterOutput } from '../../utils/trpc'

type Item = RouterOutput['invoice']['list']['data'][number]

export function InvoiceRowItem({
	item,
	index,
	selected,
}: {
	item: Item
	index: number
	selected: boolean
}) {
	const {
		_id,
		name,
		customer,
		sent,
		processed_at,
		total_price_set,
		financial_status,
		fulfillment_status,
		cancelled_at,
		closed_at,
	} = item

	const formatedCustomerName =
		(customer &&
			[customer?.first_name, customer?.last_name].join(' ').trim()) ||
		undefined

	const status = sent ? 'success' : 'subdued'

	const [i18n] = useI18n()

	const total = i18n.formatCurrency(
		parseFloat(total_price_set.shop_money.amount) || 0,
		{
			currency: total_price_set.shop_money.currency_code,
			form: 'explicit',
		},
	)

	const navigate = useNavigate()

	const handleOnClickDetail = () => navigate(`/invoices/${_id}`)

	const isCancelled = useMemo(() => !!cancelled_at, [cancelled_at])

	return (
		<IndexTable.Row
			subdued={!!closed_at}
			status={status}
			id={_id}
			key={_id}
			position={index}
			selected={selected}
		>
			<IndexTable.Cell>
				<Link dataPrimaryLink onClick={handleOnClickDetail}>
					<Text variant="bodyMd" fontWeight="bold" as="span">
						<span className={isCancelled ? 'line-through' : ''}>{name}</span>
					</Text>
				</Link>
			</IndexTable.Cell>
			<IndexTable.Cell>
				<Text variant="bodyMd" as="span">
					<span className={isCancelled ? 'line-through' : ''}>
						{formatRelative(new Date(processed_at.$date), new Date(), {
							locale,
						})}
					</span>
				</Text>
			</IndexTable.Cell>
			<IndexTable.Cell>
				<Text variant="bodyMd" as="span">
					<span className={isCancelled ? 'line-through' : ''}>
						{formatedCustomerName}
					</span>
				</Text>
			</IndexTable.Cell>
			<IndexTable.Cell>
				<Text variant="bodyMd" as="span">
					<FinancialStatusBadge financialStatus={financial_status} />
				</Text>
			</IndexTable.Cell>
			<IndexTable.Cell>
				<Text variant="bodyMd" as="span">
					<FulfillmentStatusBadge fulfillmentStatus={fulfillment_status} />
				</Text>
			</IndexTable.Cell>
			<IndexTable.Cell>
				<Text variant="bodyMd" as="span">
					<span className={isCancelled ? 'line-through' : ''}>{total}</span>
				</Text>
			</IndexTable.Cell>
		</IndexTable.Row>
	)
}

function FinancialStatusBadge({
	financialStatus,
}: PropsWithChildren<{
	financialStatus: Item['financial_status']
}>) {
	const status =
		!financialStatus ||
		financialStatus == 'pending' ||
		financialStatus == 'partially_paid' ||
		financialStatus == 'partially_refunded'
			? 'attention'
			: undefined

	const progress =
		financialStatus === 'paid' ||
		financialStatus === 'authorized' ||
		financialStatus == 'voided'
			? 'complete'
			: financialStatus === 'partially_paid' ||
				  financialStatus === 'partially_refunded'
				? 'partiallyComplete'
				: financialStatus === 'pending'
					? 'incomplete'
					: undefined

	return (
		<Badge status={status} progress={progress}>
			{startCase(lowerCase(financialStatus ?? ''))}
		</Badge>
	)
}

function FulfillmentStatusBadge({
	fulfillmentStatus,
}: PropsWithChildren<{
	fulfillmentStatus: Item['fulfillment_status']
}>) {
	const status =
		!fulfillmentStatus || fulfillmentStatus === 'partial'
			? 'attention'
			: undefined

	const progress =
		fulfillmentStatus === 'partial'
			? 'partiallyComplete'
			: fulfillmentStatus === 'fulfilled' || fulfillmentStatus === 'restocked'
				? 'complete'
				: 'incomplete'

	return (
		<Badge status={status} progress={progress}>
			{startCase(lowerCase(fulfillmentStatus ?? 'unfulfilled'))}
		</Badge>
	)
}
