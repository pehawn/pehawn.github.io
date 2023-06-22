import * as React from "react";
import { SliderItem, GetHandleProps } from "react-compound-slider";
import { AppContext } from "../../context/AppContext";

interface IHandleProps {
	divOrButton: string;
	name: string;
	domain: number[];
	handle: SliderItem;
	getHandleProps: GetHandleProps;
}

const size: number = 30;

const Handle: React.FunctionComponent<IHandleProps> = ({ divOrButton: Comp, domain: [min, max], handle: { id, value, percent }, name, getHandleProps }): JSX.Element => {
	const appContext = React.useContext(AppContext);
	const borderColor: string = appContext.SelectedSwatch ? appContext.SelectedSwatch.HexValue : "brown";

	return (
		<Comp
			role="slider"
			aria-valuemin={min}
			aria-valuemax={max}
			aria-valuenow={value}
			name={name}
			title={name}
			style={{
				left: `${percent}%`,
				position: "absolute",
				transform: "translate3d(-50%,-50%,0)",
				top: "50%",
				zIndex: 2,
				width: size,
				height: size,
				cursor: "pointer",
				borderRadius: "50%",
				border: "none",
				boxShadow: "0 4px 8px rgba(0,0,0,.16)",
				backgroundColor: "#f8f9fa",
				outline: "none"
			}}
			{...getHandleProps(id)}
		/>
	);
};

export default Handle;

interface IMyRailProps {
	background: string;
}

export const MyRail: React.FunctionComponent<IMyRailProps> = ({ background, ...props }) => (
	<div
		style={{
			background,
			height: 14,
			borderRadius: 7,
			cursor: "pointer",
			boxShadow: "inset 0 1px 3px rgba(0,0,0,.4)"
		}}
		{...props}
	/>
);

interface ITick {
	id: string;
	value: number;
	percent: number;
}

interface IMyTickProps {
	tick: ITick;
	count: number;
	format(value: number): string;
}

export const Tick: React.FunctionComponent<IMyTickProps> = ({ tick, count, format }) => {
	return (
		<div>
			<div
				style={{
					position: "absolute",
					marginTop: 14,
					width: 1,
					height: 5,
					backgroundColor: "rgb(200,200,200)",
					left: `${tick.percent}%`
				}}
			/>
			<div
				style={{
					position: "absolute",
					marginTop: 22,
					fontSize: 10,
					textAlign: "center",
					marginLeft: `${-(100 / count) / 2}%`,
					width: `${100 / count}%`,
					left: `${tick.percent}%`
				}}
			>
				{format(tick.value)}
			</div>
		</div>
	);
};
