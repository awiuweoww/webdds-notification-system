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
 * Created Date       : 24-08-2025
 * Description        : FieldGroup component to display label–value pairs
 *                      with optional unit and adornment support.
 *
 * Changelog:
 * - 0.1.0 (24-08-2025): Initial implementation of the FieldGroup component.
 */

type FieldGroupProps = {
	label: string;
	value?: React.ReactNode;
	unit?: string;
	adornment?: React.ReactNode;
};

/**
 * FieldGroup Component
 *
 * Renders a label–value pair with optional unit and adornment.
 * Useful for displaying structured information in a single row format.
 *
 * @param {FieldGroupProps} props - The props for the component.
 * @returns {JSX.Element} JSX element rendering the label and value pair.
 */
export const FieldGroup: React.FC<FieldGroupProps> = ({
	label,
	value,
	unit,
	adornment
}) => {
	const showValue = value !== undefined && value !== null && value !== "";
	return (
		<div className="flex items-center">
			<span className="w-[120px] text-xs text-white/80 truncate">{label}</span>
			<span className="text-xs text-white/80">:</span>
			<span className="text-xs text-white/80 ml-2 inline-flex items-center">
				{showValue ? (
					<>
						{value}
						{unit ? <span className="ml-1">{unit}</span> : null}
						{adornment ? <span className="ml-1">{adornment}</span> : null}
					</>
				) : (
					""
				)}
			</span>
		</div>
	);
};
