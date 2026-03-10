import React from "react";

/**
 * A React component for rendering an IFF icon in an SVG.
 *
 * @function IFFIcon
 * @param {React.SVGProps<SVGSVGElement>} props The props of the SVG element.
 * @returns {React.ReactElement} The rendered SVG element.
 */
const IFFIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
	<svg
		width="32"
		height="32"
		viewBox="0 0 32 32"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			d="M3 25.0001C3 14.8667 16 14.8669 16 25.0001C16 14.8666 29 14.8669 29 25.0001M6.25 22.4667L8.2 24.3666L12.1 20.5667M20.55 20.5667L22.5 22.4667M22.5 22.4667L24.45 24.3666M22.5 22.4667L24.45 20.5667M22.5 22.4667L20.55 24.3666M14.7 11.0667C14.7 13.8649 12.3719 16.1333 9.5 16.1333C6.62812 16.1333 4.3 13.8649 4.3 11.0667C4.3 8.26842 6.62812 6 9.5 6C12.3719 6 14.7 8.26842 14.7 11.0667ZM27.7 11.0667C27.7 13.8649 25.3719 16.1333 22.5 16.1333C19.6281 16.1333 17.3 13.8649 17.3 11.0667C17.3 8.26842 19.6281 6 22.5 6C25.3719 6 27.7 8.26842 27.7 11.0667Z"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
		/>
	</svg>
);

export default IFFIcon;
