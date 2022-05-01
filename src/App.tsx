import Counter from "./counter"
import TempConvertor from "./temp-convertor"
import Timer from "./timer"
import FlightBooker from "./flight-booker"
import CRUD from "./CRUD"
import CircleDrawer from "./circle-drawer"
import Cells from "./cells"
import {GuiSection} from "./GuiSection"

function App() {
	return (
		<main>
			<h1>7GUIs with Valtio</h1>
			<a href="https://eugenkiss.github.io/7guis/">
				7 GUIs a Programming Benchmark
			</a>
			{" | "}
			<a href="https://valtio.pmnd.rs/">Valtio</a>
			{" | "}
			<a href="https://blog.axlight.com/posts/learning-react-state-manager-jotai-with-7guis-tasks/">
				Jotai 7GUIs
			</a>
			<hr />
			<GuiSection title="1. Counter" dir="counter">
				<Counter />
			</GuiSection>
			<hr />
			<GuiSection title="2. Temperature Converter" dir="temp-convertor">
				<TempConvertor />
			</GuiSection>
			<hr />
			<GuiSection title="3. Flight Booker" dir="flight-booker">
				<FlightBooker />
			</GuiSection>
			<hr />
			<GuiSection title="4. Timer" dir="timer">
				<Timer />
			</GuiSection>
			<hr />
			<GuiSection title="5. CRUD" dir="CRUD">
				<CRUD />
			</GuiSection>
			<hr />
			<GuiSection title="6. Circle Drawer" dir="circle-drawer">
				<CircleDrawer />
			</GuiSection>
			<hr />
			<GuiSection title="7. Cells" dir="cells">
				<Cells />
			</GuiSection>
		</main>
	)
}

export default App
