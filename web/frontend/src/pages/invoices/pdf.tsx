import { useNavigate } from '@shopify/app-bridge-react'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { InvoiceSkeleton } from '../../components/Invoice/InvoiceSkeleton'

export default function Pdf() {
	const navigate = useNavigate()

	const [searchParams] = useSearchParams()

	const orderId = searchParams.get('id')

	useEffect(() => {
		if (orderId) {
			navigate({
				name: 'Order',
				resource: {
					id: orderId,
				},
			})

			window.open(`/a/invoices/${orderId}/pdf`, '_blank')
		}
	}, [navigate, orderId])

	return <InvoiceSkeleton />
}
