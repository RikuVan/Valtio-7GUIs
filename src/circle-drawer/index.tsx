import * as React from 'react'
import { proxy, useSnapshot } from 'valtio'
import { proxyWithHistory } from 'valtio/utils'
import './index.css'

type Circle = {
  cx: number
  cy: number
  r: number
  id: number
}

const historyState = proxyWithHistory<Array<Circle>>([])

const state = proxy<{
  selected: number | undefined
  circleHistory: typeof historyState
}>({
  circleHistory: historyState,
  selected: undefined,
})

const selectCircle = (e: React.MouseEvent<HTMLOrSVGElement>, index: number) => {
  e.preventDefault()
  e.stopPropagation()
  if (state.selected === index) {
    state.selected = undefined
  } else {
    state.selected = index
  }
}

const unselectCircle = () => {
  state.selected = undefined
}

const addCircle = (e: React.MouseEvent<HTMLOrSVGElement>) => {
  e.preventDefault()
  if (state.selected !== undefined) return
  const { x, y } = (e.currentTarget as any).getBoundingClientRect()
  historyState.value.push({
    r: 20,
    cx: e.clientX - x,
    cy: e.clientY - y,
    id: performance.now(),
  })
}

const adjustRadius = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (state.selected === undefined) return
  historyState.value[state.selected].r = Number(e.target.value)
}

const CircleDrawer = () => {
  const snap = useSnapshot(state)

  return (
    <div>
      <div className="controls">
        <div>
          <button
            onClick={() => {
              unselectCircle()
              snap.circleHistory.undo()
            }}
          >
            Undo
          </button>
          <button
            onClick={() => {
              unselectCircle()
              snap.circleHistory.redo()
            }}
          >
            Redo
          </button>
        </div>
        {snap.selected !== undefined && snap.circleHistory.value[snap.selected] && (
          <div className="adjuster">
            Adjust circle at ({snap.circleHistory.value[snap.selected].cx.toFixed(1)},
            {snap.circleHistory.value[snap.selected].cy.toFixed(1)})
            <span className="closer" onClick={unselectCircle}>
              X
            </span>
            <input
              type="range"
              min={5}
              max={100}
              value={snap.circleHistory.value[snap.selected].r}
              onChange={adjustRadius}
            />
          </div>
        )}
      </div>
      <svg onClick={addCircle} key={JSON.stringify(snap.circleHistory.value)}>
        {state.circleHistory.value.map((circle, index) => (
          <circle
            key={circle.id.toString()}
            cx={circle.cx}
            cy={circle.cy}
            r={circle.r}
            onClick={(e) => selectCircle(e, index)}
            fill={index === snap.selected ? 'var(--highlight)' : 'var(--background-alt)'}
          />
        ))}
      </svg>
    </div>
  )
}

export default CircleDrawer
