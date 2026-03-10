import React from "react";

/**
 * DataLinkIcon component
 * @param {React.SVGProps<SVGSVGElement>} [props] - props to pass through to the SVG element
 * @returns {React.ReactElement} - the rendered SVG element
 */
const DataLinkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
	<svg
		width="32"
		height="32"
		viewBox="0 0 32 32"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			d="M16.5005 4.5V6.5C21.4849 6.5 25.5005 10.5156 25.5005 15.5H27.5005C27.5005 9.4375 22.563 4.5 16.5005 4.5ZM16.5005 8.5V10.5C19.2739 10.5 21.5005 12.7266 21.5005 15.5H23.5005C23.5005 11.6445 20.356 8.5 16.5005 8.5ZM7.90674 8.59375L7.21924 9.28125C2.94971 13.5508 2.94971 20.5117 7.21924 24.7812C11.4888 29.0508 18.4497 29.0508 22.7192 24.7812L23.4067 24.0938L22.7192 23.375L17.2192 17.875C18.2427 17.5625 19.0005 16.6289 19.0005 15.5C19.0005 14.1211 17.8794 13 16.5005 13C15.3716 13 14.438 13.7578 14.1255 14.7812L8.62549 9.28125L7.90674 8.59375ZM8.06299 11.5625L20.438 23.9375C16.9185 26.7305 11.8833 26.6328 8.62549 23.375C5.36768 20.1172 5.27002 15.082 8.06299 11.5625Z"
			fill="currentColor"
		/>
	</svg>
);

export default DataLinkIcon;
