import { proxy, useSnapshot } from 'valtio'
import './index.css'

const validDate = (dateString: string) => {
  const date = new Date(dateString)
  if (isNaN(+date)) {
    return false
  }
  return true
}

const beforeReturn = (departureStr: string, returnStr: string) =>
  new Date(departureStr).getTime() >= new Date(returnStr).getTime()

// each date has validation but it is really not possible to create an invalid date with the date input
const departureState = proxy({
  value: new Date().toISOString().slice(0, 10),
  invalid: false,
  set(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault()
    const str = e.target.value
    departureState.value = str
    if (validDate(str)) {
      departureState.invalid = false
    } else {
      departureState.invalid = true
    }
  },
})

const returnState = proxy({
  value: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
  invalid: false,
  set(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault()
    const str = e.target.value
    returnState.value = str
    if (validDate(str)) {
      returnState.invalid = false
    } else {
      returnState.invalid = true
    }
  },
})

const state = proxy({
  departure: departureState,
  return: returnState,
  isReturn: false,
  setIsReturn(e: React.ChangeEvent<HTMLSelectElement>) {
    e.preventDefault()
    state.isReturn = e.target.value === 'true'
  },
})

type DateKeys = keyof Pick<typeof state, 'departure' | 'return'>

function useDurationValidation() {
  const snap = useSnapshot(state)
  return !snap.isReturn || !beforeReturn(snap.departure.value, snap.return.value)
}

const DateInput = ({
  name,
  disabled,
  invalid,
}: {
  name: DateKeys
  disabled?: boolean
  invalid?: boolean
}) => {
  const snap = useSnapshot(state[name])
  return (
    <input
      name={name}
      type="date"
      value={snap.value}
      onChange={snap.set}
      disabled={disabled}
      className={!disabled && (invalid || snap.invalid) ? 'invalid' : ''}
    />
  )
}

const handleBooking = () => {
  let msg = `Flight booked form ${state.departure.value}`
  if (state.isReturn) {
    msg += ` to ${state.return.value}`
  }
  alert(msg)
}

const FlightBooker = () => {
  const snap = useSnapshot(state)
  const isValidDuration = useDurationValidation()
  return (
    <div>
      <select name="is-return" onChange={snap.setIsReturn} value={snap.isReturn.toString()}>
        <option value="false">one-way flight</option>
        <option value="true">return flight</option>
      </select>
      <DateInput name="departure" invalid={!isValidDuration} />
      <DateInput name="return" disabled={!snap.isReturn} />
      <button
        onClick={() => {
          isValidDuration && handleBooking()
        }}
      >
        book
      </button>
    </div>
  )
}

export default FlightBooker
