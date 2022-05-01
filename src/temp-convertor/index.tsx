import {proxy, useSnapshot} from "valtio"

const c2f = (x: number) => x * (9 / 5) + 32
const f2c = (x: number) => (x - 32) * (5 / 9)

const state = proxy({
	celsius: Number(5).toFixed(1),
	fahrenheit: c2f(5).toFixed(1),
	convert: (e: React.ChangeEvent<HTMLInputElement>) => {
		const {name, value} = e.target
		const n = Number(value)
		if (!isFinite(n)) return
		if (name === "celsius") {
			state.celsius = value
			state.fahrenheit = c2f(n).toFixed(1)
		} else {
			state.fahrenheit = value
			state.celsius = f2c(n).toFixed(1)
		}
	}
})

const TempConvertor = () => {
	const snap = useSnapshot(state)

	return (
		<div>
			<label>Celsius</label>
			<input name="celsius" value={snap.celsius} onChange={snap.convert} />
			<label>Fahrenheit</label>
			<input
				name="fahrenheit"
				value={snap.fahrenheit}
				onChange={snap.convert}
			/>
		</div>
	)
}

export default TempConvertor
