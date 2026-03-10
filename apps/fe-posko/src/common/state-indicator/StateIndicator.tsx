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
 * Description        : StateIndicator component that renders a status indicator as a
 *                      styled button with icon and label, or a skeleton placeholder
 *                      when loading.
 *
 * Changelog:
 * - 0.1.0 (01-07-2025): Initial implementation of the StateIndicator component
 *                       with support for success, warning, danger, off, and neutral states.
 */
import { useMemo } from "react";
import {
	PiCheckCircleLight,
	PiWarning,
	PiWarningDiamond
} from "react-icons/pi";

import { outlineColor, textColor } from "@constants/colors.constant";

import SkeletonStatus from "../skeleton-status/SekeletonStatus";

export type IndicatorType =
	| "success"
	| "warning"
	| "danger"
	| "off"
	| "neutral";

export interface Indicator {
	type: IndicatorType;
	title: string;
}

export interface StateIndicatorProps<T> {
	item: keyof T;
	fn: (statusValue: T[keyof T], item: keyof T) => Indicator;
	status: T;
	isLoading?: boolean;
}

/**
 * A StateIndicator is a small button-like badge that shows a status with an indicator type
 * (drives color/icon) and a title. When `isLoading` is true, it shows a skeleton placeholder.
 *
 * @template {Record<string, unknown>} T
 *
 * @param {Object} root0 - Component props.
 * @param {keyof T} root0.item - Key inside the `status` object whose value will be mapped to an indicator.
 * @param {(value: T[keyof T], key: keyof T) => Indicator} root0.fn - Maps a status value (and its key) to an `Indicator`.
 * @param {Readonly<T>} root0.status - Object that holds the current status values.
 * @param {boolean} [root0.isLoading=false] - If true, renders a skeleton instead of the button.
 *
 * @returns {JSX.Element} The StateIndicator component.
 */
function StateIndicator<T extends Record<string, unknown>>({
	item,
	fn,
	status,
	isLoading = false
}: Readonly<StateIndicatorProps<T>>) {
	const current = status[item];

	const indicator = useMemo<Indicator>(() => {
		return fn(current, item);
	}, [current, item, fn]);

	const iconElement = useMemo(() => {
		switch (indicator.type) {
			case "success":
				return <PiCheckCircleLight className="outline-primary-green-4" />;
			case "warning":
				return <PiWarningDiamond className="text-warning-1" />;
			case "danger":
				return <PiWarning className="text-danger-200" />;
			case "off":
				return <PiWarning className="text-neutral-3" />;
			case "neutral":
			default:
				return null;
		}
	}, [indicator.type]);

	return (
		<div>
			{isLoading ? (
				<SkeletonStatus />
			) : (
				<button
					className={`flex w-[123px] px-2 py-0.5 outline outline-1 rounded-xl bg-transparent
            ${indicator.type ? outlineColor[indicator.type] : ""}
            ${indicator.type === "neutral" ? "justify-center" : "items-center gap-1"}`}
					data-testid={`button-indicator-${String(item)}`}
				>
					{indicator.type !== "neutral" && iconElement}
					<span
						className={`text-xs ${indicator.type ? textColor[indicator.type] : ""}`}
					>
						{indicator.title}
					</span>
				</button>
			)}
		</div>
	);
}

export default StateIndicator;
