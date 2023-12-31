import {
	useEffect, useRef, useState
} from "preact/hooks";
import clsx from "clsx";

import ColumnDisplay from "./column-display.jsx";

import { cssUnitUnitStrings, getCssUnit } from "@/utilities/client.js";
import useWindowSize from "@/hooks/use-window-size.js";

/**
 *
 * @param props
 * @param props.columns
 * @param props.user
 * @param props.handleBoardMove
 * @param props.handleAnimationEnd
 * @param props.boardStatesLeft
 * @param props.boardStates
 */
// eslint-disable-next-line max-lines-per-function
const ColumnsDisplay = ({
	columns,
	user,
	handleAnimationEnd,
	boardStatesLeft,
	boardStates
}) => {
	const gridRef = useRef();

	const { width: windowWidth, height: windowHeight } = useWindowSize();

	const [gridMeasurements, setGridMeasurements] = useState(null);
	const [handledColumnIndices, setHandledColumnIndices] = useState(new Set());

	const width = columns.length;
	const height = columns[0].length;

	const handleColumnAnimationEnd = (columnIndex) => {
		setHandledColumnIndices((currentHandledColumnIndices) => new Set(
			[...currentHandledColumnIndices, columnIndex]
		));
	};

	useEffect(() => {
		if (handledColumnIndices.size === width) {
			handleAnimationEnd(() => {
				setHandledColumnIndices(new Set());
			});
		}
	}, [handledColumnIndices]);

	useEffect(() => {
		if (gridRef.current) {
			try {
				const heightValue = gridRef.current.getBoundingClientRect().height;
				const heightUnit = "pixel";

				const gapString = getComputedStyle(gridRef.current).gap.split(" ")[0];
				const gapUnit = getCssUnit(gapString);
				const gapUnitString = cssUnitUnitStrings.get(gapUnit);
				const gapValue = Number(
					gapString.replace(
						new RegExp(`${gapUnitString}$`, "u"),
						""
					)
				);

				const tileHeightString = getComputedStyle(gridRef.current.querySelector("li")).height.split(" ")[0];
				const tileHeightUnit = getCssUnit(tileHeightString);
				const tileHeightUnitString = cssUnitUnitStrings.get(tileHeightUnit);
				const tileHeightValue = Number(
					tileHeightString.replace(
						new RegExp(`${tileHeightUnitString}$`, "u"),
						""
					)
				);

				setGridMeasurements({
					height: {
						value: heightValue,
						unit: heightUnit
					},
					gap: {
						value: gapValue,
						unit: gapUnit
					},
					tileHeight: {
						value: tileHeightValue,
						unit: tileHeightUnit
					}
				});
			}
			catch {
				// Do nothing
			}
		}
	}, [
		gridRef.current,
		windowWidth,
		windowHeight
	]);

	const gridWidthClass = `
		portrait-room:w-[
			calc(
				100vh -
				var(--header-height) -
				var(--footer-height) -
				(var(--main-padding) * 2) -
				var(--room-header-height) -
				(var(--board-padding) * 2)
			)
		]
	`
		.replace(/\s|\n/gu, "");

	return (
		<ul
			className={clsx(
				"relative grid grid-flow-col gap-2 p-[var(--board-padding)] w-[100vw] z-10",
				gridWidthClass,
				{
					"pointer-events-none": boardStatesLeft.length > 0
				}
			)}
			style={{
				gridTemplateColumns: `repeat(${width}, 1fr)`,
				gridTemplateRows: `repeat(${height}, 1fr)`,
				aspectRatio: `${width}/${height}`
			}}
			ref={gridRef}
		>
			<div
				className={clsx(
					"absolute w-[100vw]",
					gridWidthClass
				)}
			>
				<ul
					className="relative z-0 grid w-full grid-flow-col gap-2 p-2"
					style={{
						gridTemplateColumns: `repeat(${width}, 1fr)`,
						gridTemplateRows: `repeat(${height}, 1fr)`,
						aspectRatio: `${width}/${height}`
					}}
				>
					{
						columns
							.map((column, columnIndex) => column
								.map(({ parity }, tileIndex) => (
									<li
										key={`${columnIndex}-${tileIndex}`}
										className={clsx(
											"aspect-square relative w-full",
											{
												"backdrop-brightness-75": parity === 0,
												"backdrop-brightness-50": parity === 1
											}
										)}
									>
										<div
											className="w-[60%] h-[60%]"
										></div>
									</li>
								)))
					}
				</ul>
			</div>
			{
				columns
					.map((column, columnIndex) => (
						<ColumnDisplay
							key={columnIndex}
							{...{
								column,
								columnIndex,
								user,
								handleColumnAnimationEnd,
								handled: handledColumnIndices.has(columnIndex),
								gridMeasurements,
								nextColumn: boardStatesLeft.map((boardState) => boardState.columns[columnIndex])?.[0],
								boardStatesLeft,
								boardStates
							}}
						/>
					))
			}
		</ul>
	);
};

export default ColumnsDisplay;
