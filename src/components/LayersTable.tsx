import Wheel from './Wheel'
import Range from './Range'
import { useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVolumeMute, faVolumeUp } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'

const EffectIcon = ({ type }): JSX.Element => {
	const props = {
		release: { view: '1 1 8 6', path: 'M 2 2 V 6 M 2 2 Q 3 6 8 6' },
		duration: { view: '1 1 10 6', path: 'M 2 2 V 6 M 2 4 H 10' },
	}
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox={props[type].view}>
			<path
				d={props[type].path}
				stroke="var(--accent)"
				strokeWidth="1"
				strokeLinecap="round"
				fill="none"
			/>
		</svg>
	)
}

const LayersTable = ({ easy, layers, setLayers, toggleMetronome }) => {
	//

	const release = ['off', 'short', 'long']
	const wavetypes = {
		sine: 'M 10 10 Q 20 -6 30 10 V 10 Q 40 26 50 10',
		triangle: 'M 10 10 L 20 2 L 40 18 L 50 10',
		sawtooth: 'M 10 10 L 30 2 V 18 L 50 10',
		square: 'M 10 2 H 30 V 18 H 50',
	}

	const handleNote = (which: string, i: number) => {
		const newLayers = [...layers]

		if (which === 'release') newLayers[i].release = (newLayers[i].release + 1) % 3
		else newLayers[i].duration = !newLayers[i].duration

		setLayers([...newLayers])
	}

	const handleLayerChange = useCallback(
		(cat: string, result: any, index: number) => {
			let newLayers = [...layers]

			if (newLayers[index]) {
				switch (cat) {
					case 'wave': {
						const clickTypeList = ['triangle', 'sawtooth', 'square', 'sine']
						clickTypeList.forEach((x, _i) => {
							if (x === result.type) {
								const nextIndex = {
									neg: _i === 0 ? clickTypeList.length - 1 : _i - 1,
									pos: _i === clickTypeList.length - 1 ? 0 : _i + 1,
								}

								newLayers[index].type =
									clickTypeList[
										result.sign === -1 ? nextIndex.neg : nextIndex.pos
									]
							}
						})
						break
					}

					case 'beats': {
						newLayers[index].beats = result + 1
						break
					}

					case 'freq':
						newLayers[index].freq = result + 1
						break

					case 'mute':
						newLayers[index].muted = !newLayers[index].muted
						break

					case 'vol':
						newLayers[index].volume = result
						break
				}

				setLayers(newLayers)
				if (cat === 'beats') toggleMetronome(true)
			}
		},
		[toggleMetronome, layers, setLayers]
	)

	//
	// Keymaps
	//

	const [selected, setSelected] = useState(-1)

	useEffect(() => {
		function handleKeyMapping(e: KeyboardEvent) {
			if (document.activeElement) {
				// Lose focus before firing
				const el = document.activeElement as HTMLButtonElement
				el.blur()
			}

			const mappings = [
				{ key: 'Escape', cat: 'select', val: -1 },
				{ key: 'Digit1', cat: 'select', val: 0 },
				{ key: 'Digit2', cat: 'select', val: 1 },
				{ key: 'Digit3', cat: 'select', val: 2 },
				{ key: 'Digit4', cat: 'select', val: 3 },
				{ key: 'Digit5', cat: 'select', val: 4 },
				{ key: 'KeyA', cat: 'freq', val: 0 },
				{ key: 'KeyW', cat: 'freq', val: 1 },
				{ key: 'KeyS', cat: 'freq', val: 2 },
				{ key: 'KeyE', cat: 'freq', val: 3 },
				{ key: 'KeyD', cat: 'freq', val: 4 },
				{ key: 'KeyF', cat: 'freq', val: 5 },
				{ key: 'KeyT', cat: 'freq', val: 6 },
				{ key: 'KeyG', cat: 'freq', val: 7 },
				{ key: 'KeyY', cat: 'freq', val: 8 },
				{ key: 'KeyH', cat: 'freq', val: 9 },
				{ key: 'KeyU', cat: 'freq', val: 10 },
				{ key: 'KeyJ', cat: 'freq', val: 11 },
				{ key: 'KeyK', cat: 'freq', val: 12 },
				{ key: 'KeyO', cat: 'freq', val: 13 },
				{ key: 'KeyL', cat: 'freq', val: 14 },
				{ key: 'KeyZ', cat: 'octave', val: -1 },
				{ key: 'KeyX', cat: 'octave', val: 1 },
			]

			const hitKey = mappings.filter(elem => elem.key === e.code)[0]

			if (hitKey !== undefined && selected > -1) {
				switch (hitKey.cat) {
					case 'freq':
						handleLayerChange('freq', hitKey.val, selected)
						break

					case 'select':
						setSelected(hitKey.val)
						break

					case 'octave': {
						handleLayerChange(
							'freq',
							11 * hitKey.val + layers[selected].freq,
							selected
						)
						break
					}
				}

				console.log(
					hitKey.val,
					Math.floor(layers[selected].freq / 12) * 12 + hitKey.val
				)
			}
		}

		const removeEvent = () => window.removeEventListener('keydown', handleKeyMapping)
		window.addEventListener('keydown', handleKeyMapping)
		return removeEvent

		// eslint-disable-next-line
	}, [selected, layers])

	return (
		<div className="layers-table-wrap">
			<div className="layers-table">
				{layers.map((layer, i) => (
					<div
						className={
							'ls-row' +
							(selected === i ? ' selected ' : ' ') +
							(layer.beats === 1 ? ' off' : '')
						}
						key={layer.id}
					>
						<Wheel
							type="beats"
							state={layer.beats}
							update={(res: number) => handleLayerChange('beats', res, i)}
						></Wheel>

						{easy ? (
							''
						) : (
							<div className="ls-note">
								<div className="notes-wrap">
									<Wheel
										type="freq"
										state={layer.freq}
										update={res => handleLayerChange('freq', res, i)}
									></Wheel>
									<pre className="octave">
										{Math.floor(layer.freq / 12) + 1}
									</pre>
								</div>
							</div>
						)}

						{easy ? (
							''
						) : (
							<div
								title={'sound type'}
								className="ls-type"
								onClick={() =>
									handleLayerChange('wave', { type: layer.type, sign: 1 }, i)
								}
								onContextMenu={e => {
									e.preventDefault()
									handleLayerChange('wave', { type: layer.type, sign: -1 }, i)
								}}
							>
								<svg
									type="svg"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="8 0 44 20"
								>
									<path
										d={wavetypes[layer.type]}
										fill="none"
										stroke="var(--accent)"
										strokeWidth="4"
										strokeLinecap="round"
									/>
								</svg>
							</div>
						)}

						{easy ? (
							''
						) : (
							<div className="note-length">
								<button
									title="sound duration"
									onClick={() => handleNote('duration', i)}
								>
									<EffectIcon type={'duration'} />
									{layer.duration ? '⅓ bpm' : '50ms'}
								</button>
								<button
									title="sound release"
									onClick={() => handleNote('release', i)}
								>
									<EffectIcon type={'release'} />
									{release[layer.release]}
								</button>
							</div>
						)}

						{easy ? (
							''
						) : (
							<div title={'volume: ' + layer.volume} className="note-volume">
								<span
									title="mute"
									className="mute"
									onClick={() => handleLayerChange('mute', null, i)}
								>
									<FontAwesomeIcon
										icon={layer.muted ? faVolumeMute : faVolumeUp}
									/>
								</span>
								<Range
									volume={layer.volume}
									muted={layer.muted}
									update={res => handleLayerChange('vol', res, i)}
								></Range>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	)
}

export default LayersTable
