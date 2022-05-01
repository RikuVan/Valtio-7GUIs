import code from "./code.svg"

type Props = {
	children: React.ReactNode
	title: string
	dir: string
}
export const GuiSection = ({children, title, dir}: Props) => {
	return (
		<section>
			<div className="section-title">
				<h2>{title}</h2>
				<a
					href={`https://github.com/RikuVan/Valtio-7GUIs/blob/main/src/${dir}/index.tsx`}
				>
					<img src={code} className="code" style={{marginBottom: "-5px"}} />
				</a>
			</div>
			{children}
		</section>
	)
}
