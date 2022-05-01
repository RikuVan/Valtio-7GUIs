import * as React from "react"
import {proxy, useSnapshot} from "valtio"
import "./index.css"

type Person = {
	first: string
	last: string
	id: number
}

type State = {
	people: Array<Person>
	query: string
	first: string
	last: string
	selected: number | undefined
}

const state = proxy<State>({
	people: [],
	query: "",
	first: "",
	last: "",
	selected: undefined
})

const setQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
	state.query = e.target.value
}
const reset = () => {
	state.first = ""
	state.last = ""
	state.selected = undefined
}
const create = () => {
	state.people.push({
		first: state.first,
		last: state.last,
		id: performance.now()
	})
	reset()
}
const remove = () => {
	if (state.selected === undefined) return
	const index = state.people.findIndex((p) => p.id === state.selected)
	if (index === -1) return
	state.people.splice(index, 1)
}
const update = () => {
	if (state.selected === undefined) return
	const person = state.people.find((p) => p.id === state.selected)
	if (!person) return
	if (state.first.length) person.first = state.first
	if (state.last.length) person.last = state.last
	reset()
}
const setSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
	e.preventDefault()
	state.selected = Number(e.target.value)
}
type NameKey = keyof Pick<State, "first" | "last">
const setName = (e: React.ChangeEvent<HTMLInputElement>) => {
	const {name, value} = e.target
	state[name as NameKey] = value
}

function usePeople() {
	const snap = useSnapshot(state)
	const people = snap.people
	const query = snap.query
	return {
		people: people.filter(
			(person) =>
				!query ||
				person.first.startsWith(query) ||
				person.last.startsWith(query)
		),
		selected: snap.selected
	}
}

const Select = () => {
	const selectRef = React.useRef<HTMLSelectElement | null>(null)
	const {people, selected} = usePeople()
	return (
		<select
			ref={selectRef}
			value={selected?.toString()}
			onChange={setSelected}
			size={5}
			onFocus={() => {
				if (selectRef.current) selectRef.current.selectedIndex = -1
			}}
		>
			{people.map((person) => (
				<option key={person.first} value={person.id}>
					{person.last}, {person.first}
				</option>
			))}
		</select>
	)
}

const CRUD = () => {
	const snap = useSnapshot(state)

	const hasName = snap.first.length > 0 && snap.last.length > 0
	const hasPartOfName = snap.first.length + snap.last.length > 0
	const hasSelected = snap.selected !== undefined

	return (
		<div>
			<input
				name="filter"
				placeholder="filter..."
				value={snap.query}
				onChange={setQuery}
			/>
			<Select />
			<label>
				<input
					name="last"
					value={snap.last}
					placeholder="last"
					onChange={setName}
				/>
			</label>
			<label>
				<input
					name="first"
					value={snap.first}
					placeholder="first"
					onChange={setName}
				/>
			</label>
			<div className="buttons">
				<button onClick={create} disabled={!hasName && hasSelected}>
					create
				</button>
				<button onClick={update} disabled={!hasPartOfName || !hasSelected}>
					update
				</button>
				<button onClick={remove} disabled={!hasSelected}>
					delete
				</button>
			</div>
		</div>
	)
}

export default CRUD
