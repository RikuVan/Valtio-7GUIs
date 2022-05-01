import * as React from "react"
import {proxy, useSnapshot} from "valtio"
import {proxyMap} from "valtio/utils"
import "./index.css"

type CellValue = {exp?: string}
type Cells = Record<string, CellValue>

const getColId = (col: number) => String.fromCharCode("A".charCodeAt(0) + col)

const COLUMNS = Array.from(Array(26).keys())
const ROWS = Array.from(Array(100).keys())

const cellState = proxyMap<string, string>()
const uiState = proxy<{active: string | undefined}>({active: undefined})
const setEditing = (id: string | undefined) => {
	uiState.active = id
}

// thanks to Jotai version :)
const evalCell = (exp: string) => {
	if (!exp.startsWith("=")) {
		return exp
	}
	try {
		const fn = Function(
			"get",
			`
      'use strict'; return ${exp
				.slice(1)
				.replace(/\b([A-Z]\d{1,2})\b/g, (m) => `get('${m}')`)};
      `
		)
		return fn((cellId: string) => {
			const val = evalCell(cellState.get(cellId) || ("" as string))
			const num = Number(val)
			return Number.isFinite(num) ? num : val
		})
	} catch (e) {
		return `#ERROR ${e}`
	}
}

// keyboard nav helpers
const findUp = (col: number, row: number) => {
	if (row === 0) {
		return `${getColId(col)}99`
	}
	return `${getColId(col)}${row - 1}`
}
const findDown = (col: number, row: number) => {
	if (row === 99) {
		return `${getColId(col)}0`
	}
	return `${getColId(col)}${row + 1}`
}
const findLeft = (col: number, row: number) => {
	console.log(col, row)
	if (col === 0) {
		if (row === 0) {
			return `${getColId(25)}99`
		}
		return `${getColId(25)}${row - 1}`
	}
	return `${getColId(col - 1)}${row}`
}
const findRight = (col: number, row: number) => {
	if (col === 25) {
		if (row === 99) {
			return `${getColId(0)}0`
		}
		return `${getColId(0)}${row + 1}`
	}
	return `${getColId(col + 1)}${row}`
}

type NavigationKey = "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight"
const navigateToCell = (id: String, key: NavigationKey) => {
	const col = id.charCodeAt(0) - "A".charCodeAt(0)
	const row = Number(id.slice(1))
	switch (key) {
		case "ArrowUp":
			return setEditing(findUp(col, row))
		case "ArrowDown":
			return setEditing(findDown(col, row))
		case "ArrowLeft":
			return setEditing(findLeft(col, row))
		case "ArrowRight":
			return setEditing(findRight(col, row))
	}
}

const Cell = React.memo(({id, exp}: {id: string; exp: string}) => {
	const uiSnap = useSnapshot(uiState)
	const ref = React.useRef<HTMLInputElement>(null)
	const active = uiSnap.active === id
	const value = evalCell(exp)

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			cellState.set(id, (e.target as HTMLInputElement).value)
		} else if (
			["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
		) {
			navigateToCell(id, e.key as NavigationKey)
			return
		}
	}

	return (
		<div
			className={uiSnap.active === id ? "cell active" : "cell"}
			ref={ref}
			id={id}
			tabIndex={-1}
			onClick={() => {
				setEditing(id)
			}}
		>
			{active ? (
				<input
					className="cell-input"
					defaultValue={exp}
					autoFocus
					onKeyDown={handleKeyDown}
					onBlur={(e) => {
						cellState.set(id, e.target.value)
					}}
				/>
			) : (
				<div className="read-only">{value}</div>
			)}
		</div>
	)
})

const Cells = () => {
	const cellSnap = useSnapshot(cellState)
	return (
		<div className="grid">
			{[-1, ...ROWS].map((row) => {
				return (
					<div key={String(row)} className="row">
						{[-1, ...COLUMNS].map((column) => {
							const key = `${column}${row}`
							const colId = getColId(column)
							if (row === -1 && column === -1) {
								return <div key={key} className="cell label-col" />
							}
							if (column === -1 && row > -1) {
								return (
									<div key={key} className="cell label-col">
										{row}
									</div>
								)
							}
							if (row === -1 && column > -1) {
								return (
									<div key={key} className="cell header">
										{colId}
									</div>
								)
							}
							return (
								<Cell
									key={key}
									id={`${colId}${row}`}
									exp={cellSnap.get(`${colId}${row}`) ?? ""}
								/>
							)
						})}
					</div>
				)
			})}
		</div>
	)
}

export default Cells
