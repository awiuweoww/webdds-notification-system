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
 * Description        : Type definition and props for TooltipHover component.
 *
 * Changelog:
 * - 0.1.0 (01-07-2025): Initial implementation of TooltipHoverProps type.
 */
import React from "react";

export type TooltipHoverProps = {
	children: React.ReactNode;
	tooltipsText: string;
	position?: "top" | "bottom" | "left" | "right";
	className?: string;
	arrowClassName?: string;
};
