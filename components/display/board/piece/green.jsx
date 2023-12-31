import clsx from "clsx";

import { colorClasses } from "@/utilities/client.js";

/**
 *
 * @param props
 * @param props.className
 */
const GreenPiece = ({ className }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 4000 4000"
		className={clsx(
			colorClasses.get("green"),
			className
		)}
	>
		<defs>
			<polygon id="greenShape" points="2000,0 4000,2000 2000,4000 0,2000" />
			<clipPath id="greenClip">
				<use href="#greenShape" />
			</clipPath>
		</defs>
		<use href="#greenShape" fill="currentColor" stroke="black" strokeOpacity={0.35} stroke-width={800} clip-path="url(#greenClip)" />
	</svg>
);

export default GreenPiece;
