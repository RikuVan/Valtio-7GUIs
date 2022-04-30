import { proxy, useSnapshot } from 'valtio'
import { subscribeKey } from 'valtio/utils'
import './index.css'

const tick = () => {
  state.elapsed = window.performance.now() - state.start
}

const state = proxy({
  start: window.performance.now(),
  duration: 10000,
  elapsed: 0,
  setDuration(e: React.ChangeEvent<HTMLInputElement>) {
    state.duration = Number(e.target.value)
    setTimeout(() => state.reset())
  },
  reset() {
    state.elapsed = 0
    state.start = window.performance.now()
    tick()
  },
})

let raf: number

subscribeKey(state, 'elapsed', () => {
  if (state.elapsed < state.duration) {
    raf = requestAnimationFrame(tick)
  }
  return () => {
    cancelAnimationFrame(raf)
  }
})

raf = requestAnimationFrame(tick)

const Progress = () => {
  const snap = useSnapshot(state)
  const progress = snap.elapsed / snap.duration
  return (
    <div className="progress-container">
      <progress value={progress} /> <label>{((progress * snap.duration) / 1000).toFixed(1)}s</label>
    </div>
  )
}

const Duration = () => {
  const snap = useSnapshot(state)

  return (
    <input type="range" min="1" max="10000" value={snap.duration} onChange={snap.setDuration} />
  )
}

const Timer = () => {
  const snap = useSnapshot(state)

  return (
    <div className="timer">
      <Progress />
      <Duration />
      <button onClick={snap.reset}>Reset</button>
    </div>
  )
}

export default Timer
