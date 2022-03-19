import type { AppProps } from 'next/app'
import Script from 'next/script'
import Head from 'next/head'
import '../styles/App.scss'

function App({ Component }: AppProps) {
	return (
		<>
			<Head>
				<title>Polytronome - train your polyrythms</title>
				<meta charSet="utf-8" />
				<meta name="theme-color" content="#EAEBEA" />

				<meta
					name="description"
					content="An easy way to visualize polyrythms. Use it to discover new rythms, challenge yourself to play along, or simply enjoy the sounds you created !"
				/>

				<link rel="icon" id="favicon" href="/favicon.png" />
				<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
				<link rel="manifest" href="/manifest.json" />

				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://polytronome.com/" />
				<meta property="og:title" content="Polytronome - train your polyrythms" />
				<meta property="og:image" content="https://polytronome.com/preview.webp" />
				<meta
					property="og:description"
					content="An easy way to visualize polyrythms. Use it to discover new rythms, challenge yourself to play along, or simply enjoy the sounds you created !"
				/>

				<meta name="twitter:card" content="summary" />
				<meta property="twitter:domain" content="polytronome.com" />
				<meta property="twitter:url" content="https://polytronome.com/" />
				<meta name="twitter:title" content="Polytronome - train your polyrythms" />
				<meta
					name="twitter:description"
					content="An easy way to visualize polyrythms. Use it to discover new rythms, challenge yourself to play along, or simply enjoy the sounds you created !"
				/>
				<meta name="twitter:image" content="https://polytronome.com/preview.webp" />

				<Script
					async
					src="https://www.googletagmanager.com/gtag/js?id=G-6DMK8FJVX9"
				></Script>
				<Script
					dangerouslySetInnerHTML={{
						__html: `
							window.dataLayer = window.dataLayer || [];
							function gtag(){dataLayer.push(arguments);}
							gtag('js', new Date());
							gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}'});
						`,
					}}
				></Script>
			</Head>
			<Component />
		</>
	)
}

export default App
