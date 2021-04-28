export type MoreSettings = {
	theme: number
	segment: {
		on: boolean
		count: number
		ratios: number[]
		duplicates: number[]
		dupCount: number
	}
	fullscreen: boolean
	unlimited: boolean
	animations: boolean
}

export type Layer = {
	id: string
	beats: number
	time: number
	frequency: number
	type: string
	volume: number
}

export type Metronome = {
	layers: Layer[]
	startTime: number
	isRunning: boolean
	tempo: number
	tap: {
		date: number
		wait: number
	}[]
}