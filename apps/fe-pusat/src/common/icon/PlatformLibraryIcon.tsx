import React from "react";

/**
 * A React component for rendering a platform library icon in an SVG.
 *
 * @function PlatformLibraryIcon
 * @param {React.SVGProps<SVGSVGElement>} props The props of the SVG element.
 * @returns {React.ReactElement} The rendered SVG element.
 */
const PlatformLibraryIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
	props
) => (
	<svg
		width="32"
		height="32"
		viewBox="0 0 32 32"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			d="M5.33301 25.3333V6.66667C5.33301 5.19391 6.52691 4 7.99967 4H25.8663C26.3082 4 26.6663 4.35817 26.6663 4.8V22.2857"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
		/>
		<path
			d="M10.6665 4V14.6667L13.9998 12.5333L17.3332 14.6667V4"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M8 22.6666H26.6667"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
		/>
		<path
			d="M8 28H26.6667"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
		/>
		<path
			d="M7.99967 28C6.52691 28 5.33301 26.8061 5.33301 25.3333C5.33301 23.8605 6.52691 22.6666 7.99967 22.6666"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

export default PlatformLibraryIcon;
