import {proxy, useSnapshot} from "valtio"
const state = proxy({count: 0, inc: () => ++state.count})

const Counter = () => {
	const snap = useSnapshot(state)

	return (
		<div className="row">
			<input readOnly value={snap.count} />{" "}
			<button onClick={snap.inc}>+</button>
		</div>
	)
}

export default Counter
