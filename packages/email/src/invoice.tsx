import {
	Body,
	Container,
	Head,
	Html,
	Link,
	Tailwind,
	Text,
} from '@react-email/components'

interface InvoiceEmailProps {
	username?: string
	invoiceNumber?: string
	printLink?: string
	pdfLink?: string
}

export const InvoiceEmail = ({
	username,
	pdfLink,
	printLink,
	invoiceNumber,
}: InvoiceEmailProps) => {
	return (
		<Html>
			<Head />
			<Tailwind>
				<Body className="mx-auto my-auto bg-white font-sans">
					<Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
						<Text className="text-[14px] leading-[24px] text-black">
							Dear {username},
						</Text>
						<Text className="text-[14px] leading-[24px] text-black">
							Find attached a copy of invoice {invoiceNumber}.
						</Text>
						<Text className="text-[14px] leading-[24px] text-black">
							Please submit payment at your earliest convenience. If you have
							already paid this invoice, please disregard this message.
						</Text>
						<Text>
							To view this invoice online, click on the following link:{' '}
							<Link href={printLink} className="text-blue-600 no-underline">
								View invoice
							</Link>
						</Text>
						<Text>
							Also PDF of invoice should be available at this link:{' '}
							<Link href={pdfLink} className="text-blue-600 no-underline">
								Dowload pdf
							</Link>
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	)
}

export default InvoiceEmail
