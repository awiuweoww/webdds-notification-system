import React from "react";

/**
 * EngagementIcon component
 * @param {React.SVGProps<SVGSVGElement>} props - Props to pass to the SVG element
 * @returns {React.ReactElement} - The rendered SVG element representing an engagement icon
 */
const EngagementIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
	<svg
		width="32"
		height="32"
		viewBox="0 0 32 32"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			d="M16 20C18.2091 20 20 18.2091 20 16C20 13.7909 18.2091 12 16 12C13.7909 12 12 13.7909 12 16C12 18.2091 13.7909 20 16 20Z"
			fill="currentColor"
		/>
		<path
			d="M17.3332 5.42529V2.66663H14.6665V5.42529C12.3201 5.72443 10.1394 6.79427 8.46677 8.46689C6.79415 10.1395 5.72431 12.3202 5.42517 14.6666H2.6665V17.3333H5.42517C5.72409 19.6798 6.79386 21.8606 8.46652 23.5333C10.1392 25.2059 12.32 26.2757 14.6665 26.5746V29.3333H17.3332V26.5746C19.6797 26.2757 21.8605 25.2059 23.5332 23.5333C25.2058 21.8606 26.2756 19.6798 26.5745 17.3333H29.3332V14.6666H26.5745C26.2754 12.3202 25.2055 10.1395 23.5329 8.46689C21.8603 6.79427 19.6796 5.72443 17.3332 5.42529ZM15.9998 24C11.5878 24 7.99984 20.412 7.99984 16C7.99984 11.588 11.5878 7.99996 15.9998 7.99996C20.4118 7.99996 23.9998 11.588 23.9998 16C23.9998 20.412 20.4118 24 15.9998 24Z"
			fill="currentColor"
		/>
	</svg>
);

export default EngagementIcon;
