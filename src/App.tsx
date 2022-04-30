import Counter from './counter'
import TempConvertor from './temp-convertor'
import Timer from './timer'
import FlightBooker from './flight-booker'
import CRUD from './CRUD'
import CircleDrawer from './circle-drawer'

function App() {
  return (
    <main>
      <h1>7GUIs with Valtio</h1>
      <a href="https://eugenkiss.github.io/7guis/">7 GUIs a Programming Benchmark</a>
      {' | '}
      <a href="https://valtio.pmnd.rs/">Valtio</a>
      <section>
        <h2>1. Counter</h2>
        <Counter />
      </section>
      <hr />
      <section>
        <h2>2. Temperature Converter</h2>
        <TempConvertor />
      </section>
      <hr />
      <section>
        <h2>3. Flight Booker</h2>
        <FlightBooker />
      </section>
      <section>
        <h2>4. Timer</h2>
        <Timer />
      </section>
      <section>
        <h2>5. CRUD</h2>
        <CRUD />
      </section>
      <section>
        <h2>6. Circle Drawer</h2>
        <CircleDrawer />
      </section>
    </main>
  )
}

export default App
