import { InvoiceTemplate } from '@apex/shared-ui'
import { useNavigate } from '@shopify/app-bridge-react'
import { Banner, Frame, Modal, Page } from '@shopify/polaris'
import { ExternalMinor } from '@shopify/polaris-icons'
import { useCallback, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import invariant from 'tiny-invariant'
import { ValorImage } from '../../assets'
import { InvoiceSkeleton } from '../../components/Invoice/InvoiceSkeleton'
import { usePdfDownload } from '../../hooks/usePdfDownload'
import { trpc } from '../../utils/trpc'

function SendEmaiBanner({
	message,
	isError,
}: {
	message?: string
	isError?: boolean
}) {
	return (
		<Banner
			status={isError ? 'warning' : 'success'}
			title={isError ? 'Could not send email' : 'Email sent successfully'}
		>
			<p>{message}</p>
		</Banner>
	)
}

function SendEmailModal({
	active,
	onConfirm,
	onClose,
}: {
	active: boolean
	onConfirm: () => void
	onClose: () => void
}) {
	return (
		<Modal
			open={active}
			onClose={onClose}
			title="Invoice email"
			primaryAction={{
				content: 'Send email',
				onAction: onConfirm,
			}}
			secondaryActions={[
				{
					content: 'Cancel',
					onAction: onClose,
				},
			]}
		>
			<Modal.Section>
				Please confirm that you want to send the invoice email.
			</Modal.Section>
		</Modal>
	)
}

export default function DetailInvoice() {
	const { id } = useParams()

	const [active, setActive] = useState(false)

	const toggleModal = useCallback(() => setActive((active) => !active), [])

	invariant(id, 'id is required')

	const navigate = useNavigate()
	const [downloadPdf, isDownloading] = usePdfDownload()
	const location = useLocation()

	const {
		mutateAsync,
		isSuccess,
		isError: isEmailError,
		error: emailError,
	} = trpc.invoice.sendEmail.useMutation()

	const sendEmail = useCallback(() => {
		mutateAsync({ id })
		toggleModal()
	}, [id, mutateAsync, toggleModal])

	const {
		data: invoice,
		error,
		isLoading,
	} = trpc.invoice.byId.useQuery({ id }, { retry: false })

	if (error?.data?.httpStatus === 404) {
		return navigate('/notFound')
	}

	const { data: shop } = trpc.shop.current.useQuery()

	const fetchPdfDowload = () => fetch(`/a/invoices/${id}/pdf`)

	const fetchPdfPrint = () => fetch(`/a/invoices/${id}/print`)

	const handleDownloadClick = () => {
		downloadPdf(fetchPdfDowload)
	}

	const handlePrintClick = () => {
		downloadPdf(fetchPdfPrint, true)
	}

	if (isLoading) {
		return <InvoiceSkeleton />
	}

	if (!shop || !invoice) {
		return
	}

	return (
		<Frame>
			<SendEmailModal
				active={active}
				onClose={toggleModal}
				onConfirm={sendEmail}
			/>
			{isEmailError && <SendEmaiBanner message={emailError.message} isError />}
			{isSuccess && <SendEmaiBanner />}
			<Page
				fullWidth
				title={`Invoice ${invoice.name}`}
				secondaryActions={[
					{
						content: 'Public Preview',
						external: true,
						target: '_blank',
						icon: ExternalMinor,
						url: `/a${location.pathname}`,
					},
				]}
				actionGroups={[
					{
						title: 'More actions',
						disabled: isDownloading,
						actions: [
							{
								content: 'Print',
								onAction: handlePrintClick,
							},
							{
								content: 'Download',
								onAction: handleDownloadClick,
							},
							{
								content: 'Send',
								onAction: toggleModal,
							},
						],
					},
				]}
			>
				<InvoiceTemplate logo={ValorImage} invoice={invoice} />
			</Page>
		</Frame>
	)
}
