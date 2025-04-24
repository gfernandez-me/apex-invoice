import { NavigationMenu } from '@shopify/app-bridge-react'
import { I18nContext, I18nManager } from '@shopify/react-i18n'
import { BrowserRouter } from 'react-router-dom'
import { AppBridgeProvider, PolarisProvider, TrpcProvider } from './components'
import Routes, { type Route } from './Routes'

export default function App() {
	// Any .tsx or .jsx files in /pages will become a route
	// See documentation for <Routes /> for more info
	const pages = import.meta.glob<Route>(
		'./pages/**/!(*.test.[jt]sx)*.([jt]sx)',
		{
			eager: true,
		},
	)

	const i18nManager = new I18nManager({
		locale: 'en',
	})

	return (
		<PolarisProvider>
			<BrowserRouter>
				<AppBridgeProvider>
					<TrpcProvider>
						<I18nContext.Provider value={i18nManager}>
							<NavigationMenu
								navigationLinks={[
									{
										label: 'Invoices',
										destination: '/',
									},
									{
										label: 'Settings',
										destination: '/settings',
									},
								]}
							/>
							<Routes pages={pages} />
						</I18nContext.Provider>
					</TrpcProvider>
				</AppBridgeProvider>
			</BrowserRouter>
		</PolarisProvider>
	)
}
