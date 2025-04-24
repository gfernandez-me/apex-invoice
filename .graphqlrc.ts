import fs from 'fs'
import { ApiType, pluckConfig, preset } from '@shopify/api-codegen-preset'
import { type IGraphQLConfig } from 'graphql-config'

function getConfig() {
	const config: IGraphQLConfig = {
		projects: {
			default: {
				// For type extraction
				schema: 'https://shopify.dev/admin-graphql-direct-proxy',
				documents: ['./web/backend/src/**/!(*.d).{ts,tsx,graphql}'],
				extensions: {
					codegen: {
						// Enables support for `#graphql` tags, as well as `/* GraphQL */`
						pluckConfig,
						generates: {
							'./web/backend/src/graphql/admin.schema.json': {
								plugins: ['introspection'],
								config: { minify: true },
							},
							'./web/backend/src/graphql/admin.types.d.ts': {
								plugins: ['typescript'],
							},
							'./web/backend/src/graphql/admin.generated.d.ts': {
								preset,
								presetConfig: {
									apiType: ApiType.Admin,
								},
							},
						},
					},
				},
			},
		},
	}

	let extensions: string[] = []
	try {
		extensions = fs.readdirSync('./extensions')
	} catch {
		// ignore if no extensions
	}

	for (const entry of extensions) {
		const extensionPath = `./extensions/${entry}`
		const schema = `${extensionPath}/schema.graphql`
		if (!fs.existsSync(schema)) {
			continue
		}
		config.projects[entry] = {
			schema,
			documents: [`${extensionPath}/**/*.graphql`],
		}
	}

	return config
}

module.exports = getConfig()
