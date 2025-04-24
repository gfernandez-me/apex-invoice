import {
	MutationCache,
	QueryCache,
	QueryClient,
	QueryClientProvider,
} from '@tanstack/react-query'
import { httpBatchLink, loggerLink } from '@trpc/react-query'
import { type PropsWithChildren, useState } from 'react'
import superjson from 'superjson'
import { useAuthenticatedFetch } from '../../hooks'
import { trpc } from '../../utils/trpc'

export function TrpcProvider({ children }: PropsWithChildren) {
	const fetchFunction = useAuthenticatedFetch()

	const [queryClient] = useState(
		() =>
			new QueryClient({
				queryCache: new QueryCache(),
				mutationCache: new MutationCache(),
			}),
	)

	const [trpcClient] = useState(() =>
		trpc.createClient({
			links: [
				// adds pretty logs to your console in development and logs errors in production
				loggerLink({
					enabled: (opts) =>
						process.env.NODE_ENV === 'development' ||
						(opts.direction === 'down' && opts.result instanceof Error),
				}),
				httpBatchLink({
					url: `/api/trpc`,
					fetch: fetchFunction,
					transformer: superjson,
				}),
			],
		}),
	)

	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</trpc.Provider>
	)
}
