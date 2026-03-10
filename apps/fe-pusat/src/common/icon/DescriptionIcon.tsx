import React from "react";

/**
 * A React component for rendering an icon for a track description.
 *
 * @function DescriptionIcon
 * @param {React.SVGProps<SVGSVGElement>} props The props to pass to the
 *   underlying SVG element.
 * @returns {React.ReactElement} An SVG element representing the description icon.
 */
const DescriptionIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
	<svg
		width="32"
		height="32"
		viewBox="0 0 32 32"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			d="M18.6665 4V9.33333C18.6665 9.68696 18.807 10.0261 19.057 10.2761C19.3071 10.5262 19.6462 10.6667 19.9998 10.6667H25.3332M18.6665 4H9.33317C8.62593 4 7.94765 4.28095 7.44755 4.78105C6.94746 5.28115 6.6665 5.95942 6.6665 6.66667V25.3333C6.6665 26.0406 6.94746 26.7189 7.44755 27.219C7.94765 27.719 8.62593 28 9.33317 28H22.6665C23.3737 28 24.052 27.719 24.5521 27.219C25.0522 26.7189 25.3332 26.0406 25.3332 25.3333V10.6667M18.6665 4L25.3332 10.6667M12 22.6666H20M12 17.3334H20"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

export default DescriptionIcon;
