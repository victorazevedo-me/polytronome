import { useEffect, useState } from 'react'
import { useDrag } from '@use-gesture/react'
import Themes from '../assets/themes.json'
import defaultLayers from '../assets/layers.json'
import { animated, useSpring, config } from '@react-spring/web'
import { applyTheme, createExportCode, importCode } from '../utils'

const Menu = ({
	moreSettings,
	setMoreSettings,
	easy,
	setEasy,
	setImport,
	mainSpring,
	mainBounds,
}) => {
	const [openedTheme, setOpenedTheme] = useState(false)
	const [fullscreen, setFullscreen] = useState(false)
	const [extended, setExtended] = useState(false)
	const isOn = bool => (bool ? 'on' : '')

	const changeAnimations = () => {
		const appDOM = document.querySelector('.polytronome') as HTMLDivElement

		moreSettings.performance
			? appDOM.classList.add('performance')
			: appDOM.classList.remove('performance')

		setMoreSettings(prev => ({
			...prev,
			performance: moreSettings.performance ? false : true,
		}))
	}

	const changeFullscreen = () => {
		if (!moreSettings.fullscreen && document.fullscreenElement === null) {
			document.body!.requestFullscreen()
			setFullscreen(true)
		} else if (document.fullscreenElement !== null) {
			document.exitFullscreen()
			setFullscreen(false)
		}
	}

	const changeTheme = (index?: number) => {
		let nextTheme = index || 0

		if (!extended) nextTheme = (moreSettings.theme + 1) % Themes.length

		setMoreSettings(prev => ({ ...prev, theme: nextTheme }))
		localStorage.theme = nextTheme
		applyTheme(nextTheme)
	}

	const changeClickType = () => {
		setMoreSettings(prev => ({ ...prev, clickType: (moreSettings.clickType + 1) % 3 }))
	}

	const changeOffset = () => {
		setMoreSettings(prev => ({ ...prev, offset: (moreSettings.offset + 50) % 550 }))
	}

	const resetToDefault = () => {
		setImport(importCode(createExportCode(80, defaultLayers, moreSettings, easy)))
	}

	useEffect(() => {
		const keymappings = e => (e.code === 'KeyF' ? changeFullscreen() : '')
		const cleanupEvents = () => window.removeEventListener('keypress', keymappings)

		window.addEventListener('keypress', keymappings)
		return cleanupEvents
	}, [])

	// eslint-disable-next-line
	const springProps = { x: 0, y: 0, config: config.stiff }
	const [menuStyles, menuSpring] = useSpring(() => springProps)

	const menuSize = 360
	const padding = 60

	const moveElements = (moves: number[]) => {
		menuSpring.start({ x: moves[0] })
		mainSpring.start({ x: moves[1] })
	}

	// Ugly session storage to always save main left position
	// EXCEPT when App redraws main while menu is open
	// (because main left would be set to 420px or menuSize + padding)
	useEffect(() => {
		if (mainBounds.left !== menuSize + padding) sessionStorage.leftBound = mainBounds.left
	}, [mainBounds])

	const drag = useDrag(
		({ active, offset: [ox], tap }) => {
			// Moves main and menu together

			// sets offsets between main and menu
			const left = sessionStorage.leftBound || 0
			const dragMainOffest = Math.max(0, ox + padding - left)
			const clickMainOffset = Math.max(0, menuSize + padding - left)

			// moves on drag
			moveElements([ox, dragMainOffest < 0 ? 0 : dragMainOffest])

			// release drag, finds rest position
			if (!active) moveElements(ox > menuSize / 2 ? [menuSize, clickMainOffset] : [0, 0])

			// clicking dragbar, === 0 is click to open
			if (tap)
				moveElements(menuStyles.x.get() === 0 ? [menuSize, clickMainOffset] : [0, 0])
		},
		{
			axis: 'x',
			rubberband: 0.1,
			filterTaps: true,
			bounds: { left: 0, right: menuSize },
		}
	)

	const links = [
		{ url: 'https://polytronome.com/docs', icon: '📚', text: 'documentation' },
		{ url: 'https://github.com/victrme/polytronome', icon: '⌨️', text: 'github' },
		{ url: 'https://ko-fi.com/victr', icon: '❤️', text: 'donate' },
		{ url: 'mailto:mail@victr.me', icon: '🗨️', text: 'contact' },
	]

	const texts = {
		advanced: ['on', 'off'],
		animations: ['off', 'on'],
		fullscreen: ['off', 'on'],
		view: ['layers', 'segment', 'block'],
	}

	const options = [
		{
			icon: '🎨',
			text: 'themes',
			title: 'change theme',
			func: () => (extended ? setOpenedTheme(!openedTheme) : changeTheme()),
			css: '',
			state: Themes[moreSettings.theme].name,
		},
		{
			icon: '🌀',
			text: 'advanced mode',
			title: 'advanced mode',
			func: () => setEasy(!easy),
			css: isOn(!easy),
			state: texts.advanced[+easy],
		},
		{
			icon: '💫',
			text: 'animations',
			title: 'enable animations',
			func: changeAnimations,
			css: isOn(moreSettings.performance),
			state: texts.advanced[+moreSettings.performance],
		},
		{
			icon: '📱',
			text: 'click view',
			title: 'change click view',
			func: changeClickType,
			css: '',
			state: texts.view[moreSettings.clickType],
		},
		{
			icon: '➕',
			text: 'fullscreen',
			title: 'fullscreen',
			func: changeFullscreen,
			css: isOn(fullscreen),
			state: texts.fullscreen[+fullscreen],
		},
		{
			icon: '🔉',
			text: 'sound offset',
			title: 'sound offset',
			func: changeOffset,
			css: '',
			state: moreSettings.offset + 'ms',
		},
		{
			icon: '🔥',
			text: 'reset to default',
			title: 'reset to default',
			func: resetToDefault,
			css: '',
			state: '',
		},
	]

	return (
		<div className="menu">
			<button onClick={() => setExtended(!extended)}>Menu</button>

			<animated.aside
				style={{ x: menuStyles.x }}
				className={extended ? 'extended' : 'closed'}
			>
				<div className="inner-menu">
					<div
						className="theme-list"
						style={{
							maxHeight: openedTheme ? 100 : 0,
							paddingTop: openedTheme ? 20 : 0,
							paddingBottom: openedTheme ? 20 : 0,
							transition: 'max-height .5s, padding .4s',
							overflow: 'hidden',
						}}
					>
						{Themes.map((theme, i) => (
							<span
								key={i}
								style={{
									backgroundColor: theme.background,
									color: theme.accent,
								}}
								onClick={e => {
									e.stopPropagation()
									e.nativeEvent.stopImmediatePropagation()
									changeTheme(i)
								}}
							>
								{theme.name}
							</span>
						))}
					</div>

					{options.map(({ func, title, icon, css, text, state }) => (
						<button key={title} title={title} onClick={func} className={css}>
							<p>
								<span>{icon}</span>
								<span>{text}</span>
							</p>
							<span className="optionState">{state}</span>
						</button>
					))}

					<div className="links">
						{links.map(link => (
							<a key={link.text} title="documentation" href={link.url}>
								<span>{link.icon}</span>
								<span>{link.text}</span>
							</a>
						))}
					</div>
				</div>
			</animated.aside>
		</div>
	)

	/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7 3.5">
	<path
		d={
			segment.on
				? 'M1 1.75 1.5 1.75M2.5 1.75 4 1.75M5 1.75 6 1.75'
				: 'M1 1 2 1M3 1 4 1M5 1 6 1M1 2.5 3 2.5M4 2.5 6 2.5'
		}
		stroke="var(--accent)"
		strokeWidth="1"
		strokeLinecap="round"
		fill="none"
	/>
</svg> */
}

export default Menu
