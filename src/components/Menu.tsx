import Themes from '../assets/themes.json'
import propTypes from 'prop-types'
import Button from './Button'

const Menu = ({
	moreSettings,
	segment,
	setSegment,
	setMoreSettings,
	easy,
	setEasy,
	menuShown,
	menuHovered,
}) => {
	const changeAnimations = () => {
		const appDOM = document.querySelector('.polytronome') as HTMLDivElement

		moreSettings.animations
			? appDOM.classList.add('performance')
			: appDOM.classList.remove('performance')

		setMoreSettings(prev => ({
			...prev,
			animations: moreSettings.animations ? false : true,
		}))
	}

	const changeFullscreen = () => {
		if (!moreSettings.fullscreen && document.fullscreenElement === null) {
			document.body!.requestFullscreen()
		} else if (document.fullscreenElement !== null) {
			document.exitFullscreen()
		}

		setMoreSettings(prev => ({
			...prev,
			fullscreen: moreSettings.fullscreen,
		}))
	}

	const changeTheme = () => {
		const selected = (moreSettings.theme + 1) % Themes.length
		const root = document.querySelector(':root')! as HTMLBodyElement

		Object.entries(Themes[selected]).forEach(([key, val]) =>
			val !== undefined ? root.style.setProperty('--' + key, val) : ''
		)

		setMoreSettings(prev => ({ ...prev, theme: selected }))
		localStorage.theme = selected
	}

	const changeSegment = () => {
		setSegment({
			...segment,
			on: !segment.on,
		})
	}

	// const overlayRef = useRef(document.createElement('div'))

	return (
		<div className={'menu' + (menuShown ? ' shown' : menuHovered ? ' hovered' : '')}>
			<div className={'overlay'}></div>

			<div className="inner">
				<Button
					name="show all settings"
					on={!easy}
					func={() => setEasy(!easy)}
				></Button>

				<Button name="segmented clicks" on={segment.on} func={changeSegment}></Button>

				<Button
					name="performance mode"
					on={!moreSettings.animations}
					func={changeAnimations}
				></Button>

				<Button
					name="fullscreen"
					on={moreSettings.fullscreen}
					func={changeFullscreen}
				></Button>

				<Button name="theme" on={true} func={changeTheme}></Button>

				<p className="credit">
					<a href="https://victr.me">created by victr</a>
				</p>
			</div>
		</div>
	)
}

Menu.propTypes = {
	moreSettings: propTypes.object.isRequired,
	segment: propTypes.object.isRequired,
	setSegment: propTypes.func.isRequired,
	setMoreSettings: propTypes.func.isRequired,
	easy: propTypes.bool.isRequired,
	setEasy: propTypes.func.isRequired,
	menuShown: propTypes.bool.isRequired,
	menuHovered: propTypes.bool.isRequired,
}

export default Menu
