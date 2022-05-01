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

const Cell = React.memo(({id, exp}: {id: string; exp: string}) => {
	const uiSnap = useSnapshot(uiState)
	const active = uiSnap.active === id
	const value = evalCell(exp)
	return (
		<div
			className={uiSnap.active ? "cell active" : "cell"}
			data-id={id}
			onClick={() => {
				setEditing(id)
			}}
		>
			{active ? (
				<input
					className="cell-input"
					defaultValue={exp}
					autoFocus
					onKeyDown={(e: any) => {
						if (e.key === "Enter") {
							cellState.set(id, e.target.value)
						}
					}}
					onBlur={(e) => {
						cellState.set(id, e.target.value)
						setEditing(undefined)
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
								return <div key={key} className="cell init-col" />
							}
							if (column === -1 && row > -1) {
								return (
									<div key={key} className="cell init-col">
										{row}
									</div>
								)
							}
							if (row === -1 && column > -1) {
								return (
									<div key={key} className="cell init-row">
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
