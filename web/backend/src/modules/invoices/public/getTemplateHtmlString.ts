import { readFileSync } from 'node:fs'
import path from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'

const STATIC_PATH =
	process.env.NODE_ENV === 'production'
		? `${process.cwd()}/dist/assets`
		: `${process.cwd()}/src/assets`

const css = readFileSync(path.join(STATIC_PATH, 'build.css'))

/**
 * Get the Component Html String
 * @returns html string for the Page
 */
export function getTemplateHtmlString(component: JSX.Element): string {
	const componentHtmlString = renderToStaticMarkup(component)

	const htmlString = `
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
             ${css}
            </style>
          </head>
          <body>
            ${componentHtmlString}
          </body>
        </html>
    `

	return htmlString
}
