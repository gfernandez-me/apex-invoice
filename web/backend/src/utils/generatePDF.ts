import logger from '../lib/logger.js'
import { browser } from '../lib/puppeteer.js'

const generatePDF = async (htmlString: string) => {
	let page = null
	try {
		page = await browser.newPage()
		await page.setContent(htmlString, {
			waitUntil: 'domcontentloaded',
		})

		const pdfString = await page.pdf({
			printBackground: true,
			preferCSSPageSize: true,
		})

		return pdfString
	} catch (error) {
		logger.error(error)
		throw error instanceof Error ? error.message : `Generate PDF Error`
	} finally {
		if (page !== null) {
			await page.close()
		}
	}
}

export { generatePDF }
