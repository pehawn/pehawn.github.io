import * as React from "react";
import { Slider, Rail, Handles, Ticks, SliderItem } from "react-compound-slider";
import Handle, { MyRail, Tick } from "./Components"; // example render components

interface HSLProps {
	hue: number;
	saturation: number;
	lightness: number;
	onChange(value: number): void;
	onUpdate(value: number): void;
	domain: number[];
	name: string;
	orientation: boolean;
	hueValues: number[];
}

class HslSlider extends React.Component<HSLProps> {
	onChange = ([value]: readonly number[]): void => {
		if (this.props.onChange) {
			this.props.onChange(value);
		}
	};

	onUpdate = ([value]: readonly number[]): void => {
		if (this.props.onUpdate) {
			this.props.onUpdate(value);
		}
	};

	value = () => this.props.domain[0];

	background = () => "black";

	public render() {
		const { domain, onChange, onUpdate, name, orientation, hueValues, ...otherProps } = this.props;

		const sliderOrientation: boolean = orientation ? orientation : false;

		const renderTick = (tick: SliderItem, length: number): JSX.Element => {
			return (
				<Tick
					key={tick.id}
					tick={tick}
					count={length}
					format={(number) => {
						return "";
					}}
				/>
			);
		};

		return (
			<Slider
				vertical={sliderOrientation}
				mode={(curr, next) => {
					for (const value of hueValues) {
						if (next[0].val < value + 10 && next[0].val > value - 10) {
							if (next[0].val === value) {
								return next;
							} else {
								return curr;
							}
						}
					}

					return next;
				}}
				step={1}
				domain={domain}
				rootStyle={{ position: "relative" }}
				onChange={this.onChange}
				onUpdate={this.onUpdate}
				values={[this.value()]}
				{...otherProps}
			>
				<Rail>{({ getRailProps }) => <MyRail background={this.background()} {...getRailProps()} />}</Rail>
				<Handles>
					{({ handles, getHandleProps }) => (
						<React.Fragment>
							{handles.map((handle) => (
								<Handle divOrButton="button" name={name} key={handle.id} handle={handle} domain={domain} getHandleProps={getHandleProps} />
							))}
						</React.Fragment>
					)}
				</Handles>
				<Ticks values={hueValues}>{({ ticks }) => <div>{ticks.map((tick) => renderTick(tick, ticks.length))}</div>}</Ticks>
			</Slider>
		);
	}
}

export class HuePicker extends HslSlider {
	static defaultProps: any = {
		domain: [0, 360],
		hue: 0,
		lightness: 50,
		saturation: 100
	};

	value = () => this.props.hue || this.props.domain[0];

	background = () => {
		let {
			saturation,
			lightness,
			domain: [min, max]
		} = this.props;

		return `linear-gradient(to right, ${new Array(10)
			.fill(1)
			.map((_, i, a) => `hsl(${min + ((max - min) / a.length) * i}, ${saturation}%, ${lightness}%)`)
			.join(", ")})`;
	};
}
