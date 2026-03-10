/*
 * Copyright PT Len Innovation Technology
 * THIS SOFTWARE SOURCE CODE AND ANY EXECUTABLE DERIVED THEREOF ARE PROPRIETARY
 * TO PT LEN INNOVATION TECHNOLOGY, AS APPLICABLE, AND SHALL NOT BE USED IN ANY WAY
 * OTHER THAN BEFOREHAND AGREED ON BY PT LEN INNOVATION TECHNOLOGY, NOR BE REPRODUCED
 * OR DISCLOSED TO THIRD PARTIES WITHOUT PRIOR WRITTEN AUTHORIZATION BY
 * PT LEN INNOVATION TECHNOLOGY, AS APPLICABLE.
 *
 * Author             : Saeful AS
 * Version            : 0.1.0
 * Created Date       : 01-07-2025
 * Description        : Radio component to manage select track data features.
 *
 * Changelog:
 * - 0.1.0 (01-07-2025): Initial implementation of the Radio component.
 */
import React from "react";

type RadioProps = {
	checked: boolean;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	name: string;
	value: number | string;
	ariaLabel?: string;
	disabled?: boolean;
};

/**
 * A customizable radio button component.
 *
 * @param {RadioProps} props - The props for the radio button.
 * @returns {ReactElement} The radio button component.
 */
const Radio: React.FC<RadioProps> = ({
	checked,
	onChange,
	name,
	value,
	ariaLabel,
	disabled = false
}) => (
	<label
		className={`inline-flex items-center select-none ${
			disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
		}`}
	>
		<input
			type="radio"
			className="hidden"
			checked={checked}
			onChange={onChange}
			name={name}
			value={value}
			aria-label={ariaLabel}
			disabled={disabled}
		/>
		<span
			className={`
				flex items-center justify-center
				w-5 h-5 rounded-full border-2 bg-white border-accent-3
				transition
      		`}
		>
			<span
				className={`
				rounded-full
				transition
				w-1.5 h-1.5
				${checked ? "bg-accent-3 opacity-100" : "opacity-0"}
        	`}
			/>
		</span>
	</label>
);

export default Radio;
