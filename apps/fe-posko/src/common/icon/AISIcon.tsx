import React from "react";

/**
 * A simple icon for an Automatic Identification System (AIS) track.
 *
 * @param {React.SVGProps<SVGSVGElement>} props - The props to pass to the
 *   underlying SVG element.
 * @returns {React.ReactElement} An SVG element representing the AIS icon.
 */
const AISIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
	<svg
		width="32"
		height="32"
		viewBox="0 0 32 32"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			d="M2.6665 28C3.4665 28.6666 4.2665 29.3333 5.99984 29.3333C9.33317 29.3333 9.33317 26.6666 12.6665 26.6666C14.3998 26.6666 15.1998 27.3333 15.9998 28C16.7998 28.6666 17.5998 29.3333 19.3332 29.3333C22.6665 29.3333 22.6665 26.6666 25.9998 26.6666C27.7332 26.6666 28.5332 27.3333 29.3332 28"
			stroke="currentColor"
			strokeWidth="2.66667"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M25.84 26.6667C27.2742 24.2461 28.0211 21.4802 28 18.6667L16 13.3334L4 18.6667C4 22.5334 5.25333 25.7867 7.74667 29.0134"
			stroke="currentColor"
			strokeWidth="2.66667"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M25.3332 17.3333V9.33329C25.3332 8.62605 25.0522 7.94777 24.5521 7.44767C24.052 6.94758 23.3737 6.66663 22.6665 6.66663H9.33317C8.62593 6.66663 7.94765 6.94758 7.44755 7.44767C6.94746 7.94777 6.6665 8.62605 6.6665 9.33329V17.3333"
			stroke="currentColor"
			strokeWidth="2.66667"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M16 13.3334V18.6667"
			stroke="currentColor"
			strokeWidth="2.66667"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M16 2.66663V6.66663"
			stroke="currentColor"
			strokeWidth="2.66667"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

export default AISIcon;
