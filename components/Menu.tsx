import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTrail, animated } from '@react-spring/web'

import { applyTheme, createExportCode, importCode } from '../lib/utils'
import defaultLayers from '../public/assets/layers.json'
import Themes from '../public/assets/themes.json'
import useIsMobile from '../hooks/useIsMobile'
import useFullscreen from '../hooks/useFullscreen'
import Settings from '../types/settings'

import {
	faBars,
	faPalette,
	faExpand,
	faEye,
	faHeadphones,
	faFire,
	faStar,
	faCode,
	faHandPeace,
	faSlidersH,
	faChalkboardTeacher,
} from '@fortawesome/free-solid-svg-icons'

const OptionIcon = ({ icon }) => (
	<span className="option-icon">
		<FontAwesomeIcon icon={icon} />
	</span>
)

const Menu = ({
	tutoStage,
	setTutoStage,
	moreSettings,
	setSettingsFromCode,
	handleMoreSettings,
}: {
	setSettingsFromCode: Function
	setTutoStage: Function
	tutoStage: string
	moreSettings: Settings
	handleMoreSettings: ({ cat, theme }: { cat: keyof Settings; theme?: number }) => void
}) => {
	const [openedTheme, setOpenedTheme] = useState(false)
	const [extended, setExtended] = useState(false)
	const [isMobile] = useIsMobile()
	const [fullscreen, toggleFullscreen] = useFullscreen()
	const isOn = (bool: boolean) => (bool ? 'on' : '')

	//
	// Menu options functions
	//

	const changeAnimations = () => {
		const appDOM = document.querySelector('.polytronome') as HTMLDivElement

		moreSettings.animations
			? appDOM.classList.remove('performance')
			: appDOM.classList.add('performance')

		handleMoreSettings({ cat: 'animations' })
	}

	const changeTheme = (index?: number) => {
		let nextTheme = index || 0

		if (!extended) nextTheme = (moreSettings.theme + 1) % Themes.length

		handleMoreSettings({ cat: 'theme', theme: index })
		applyTheme(nextTheme, moreSettings.animations)
		localStorage.theme = nextTheme
	}

	const toggleMenu = () => {
		if (isMobile && tutoStage !== 'removed') setTutoStage('removed')
		setExtended(!extended)
		setOpenedTheme(false)
	}

	const toggleTutorial = () => {
		setTutoStage(moreSettings.easy ? 'intro' : 'showBeats')
		if (isMobile) setExtended(false)
	}

	const resetToDefault = () => {
		setSettingsFromCode(importCode(createExportCode(21, defaultLayers, moreSettings)))
	}

	//
	//
	//

	const links = [
		{
			url: 'https://github.com/victrme/polytronome',
			title: 'Source code on github',
			icon: faCode,
			text: 'source & docs',
		},
		{
			url: 'https://victr.me',
			title: 'created by victr !',
			icon: faHandPeace,
			text: 'by victr',
		},
	]

	const statesTexts = {
		advanced: ['on', 'off'],
		fullscreen: ['off', 'on'],
		animations: ['reduced', 'on'],
		view: ['layers', 'segment', 'block'],
	}

	const options = [
		{
			icon: faSlidersH,
			text: 'advanced mode',
			title: `toggle advanced mode\nAdds note, wave type, note time, release & volume control`,
			func: () => handleMoreSettings({ cat: 'easy' }),
			css: isOn(!moreSettings.easy),
			state: statesTexts.advanced[+moreSettings.easy],
		},
		{
			icon: faStar,
			text: 'animations',
			title: `toggle animations\nunchecking this option will improve performances`,
			func: changeAnimations,
			css: isOn(moreSettings.animations),
			state: statesTexts.animations[+moreSettings.animations],
		},
		{
			icon: faPalette,
			text: 'themes',
			title: 'change theme\nCycles through themes when menu is closed,\nopens theme list when menu is open',
			func: () => (!extended ? changeTheme() : setOpenedTheme(!openedTheme)),
			css: isOn(openedTheme),
			state: Themes[moreSettings.theme].name,
		},
		{
			icon: faEye,
			text: 'click view',
			title: `change click view\nCycles through layers, segment & block`,
			func: () => handleMoreSettings({ cat: 'clickType' }),
			css: '',
			state: statesTexts.view[moreSettings.clickType],
		},
		{
			icon: faExpand,
			text: 'fullscreen',
			title: 'toggle fullscreen',
			func: toggleFullscreen,
			css: isOn(fullscreen),
			state: statesTexts.fullscreen[+fullscreen],
		},
		{
			icon: faHeadphones,
			text: 'sound offset',
			title: 'sound offset\nUseful for bluetooth devices with latency\n50ms increment, 500ms max',
			func: () => handleMoreSettings({ cat: 'offset' }),
			css: isOn(moreSettings.offset > 0),
			state: moreSettings.offset + 'ms',
		},
		{
			icon: faChalkboardTeacher,
			text: 'show tutorial',
			title: 'show tutorial',
			func: toggleTutorial,
			css: '',
			state: '',
		},
		{
			icon: faFire,
			text: 'reset to default',
			title: 'reset to default',
			func: resetToDefault,
			css: '',
			state: '',
		},
	]

	const [trail, api] = useTrail(Themes.length, () => ({
		opacity: 0,
		config: { mass: 0.1, friction: 8 },
	}))

	useEffect(() => {
		const style = { opacity: openedTheme ? 1 : 0 }
		moreSettings.animations ? api.start(style) : api.set(style)
	}, [openedTheme])

	useEffect(() => {
		if (tutoStage === 'clickMenu' && extended) setTutoStage('endEasy')
	}, [extended])

	return (
		<div className="menu">
			<button onClick={toggleMenu} title={(extended ? 'close' : 'open') + ' menu'}>
				<FontAwesomeIcon icon={faBars} />
				{isMobile ? '' : 'Menu'}
			</button>

			<aside className={extended ? 'extended' : 'closed'}>
				{extended ? (
					<div className={'theme-list' + (openedTheme ? ' opened' : '')}>
						{trail.map((styles, i) => (
							<animated.span
								key={i}
								style={{
									...styles,
									backgroundColor: Themes[i].background,
									color: Themes[i].accent,
									visibility: styles.opacity.to(o =>
										o === 0 ? 'hidden' : 'visible'
									),
								}}
								onClick={e => {
									e.stopPropagation()
									e.nativeEvent.stopImmediatePropagation()
									changeTheme(i)
								}}
							>
								{Themes[i].name}
							</animated.span>
						))}
					</div>
				) : (
					''
				)}

				{options.map(option => (
					<button
						key={option.text}
						title={option.title}
						onClick={option.func}
						className={option.css}
					>
						{extended ? (
							<p>
								<OptionIcon icon={option.icon} />
								<span className="option-text">{option.text}</span>
							</p>
						) : (
							<OptionIcon icon={option.icon} />
						)}
						{extended ? <span className="optionState">{option.state}</span> : ''}
					</button>
				))}

				<hr />

				{links.map(({ icon, text, url, title }) => (
					<a key={text} href={url} title={title}>
						<p>
							<OptionIcon icon={icon} />
							<span className="option-text">{text}</span>
						</p>
					</a>
				))}
			</aside>
		</div>
	)
}

export default Menu
