/*
 * Copyright PT Len Innovation Technology
 * THIS SOFTWARE SOURCE CODE AND ANY EXECUTABLE DERIVED THEREOF ARE PROPRIETARY
 * TO PT LEN INNOVATION TECHNOLOGY, AS APPLICABLE, AND SHALL NOT BE USED IN ANY WAY
 * OTHER THAN BEFOREHAND AGREED ON BY PT LEN INNOVATION TECHNOLOGY, NOR BE REPRODUCED
 * OR DISCLOSED TO THIRD PARTIES WITHOUT PRIOR WRITTEN AUTHORIZATION BY
 * PT LEN INNOVATION TECHNOLOGY, AS APPLICABLE.
 *
 * Author             : Saeful AS
 * Version, Date      : 1.0.0, 27 March 2025
 * Description        : Tabs component to switch between views using a list of tab buttons.
 *
 * Changelog:
 * - 1.0.0 (27 Mar 2025): Initial implementation of generic Tabs component with active state and optional bottom border.
 */
import { memo } from "react";

import { cn } from "@utils/cn";

import Card from "../card/Card";

export type TabsProps<
	T extends {
		title: React.ReactNode;
		value: string;
	}
> = {
	tabsData: Readonly<T[]>;
	onTabChange: (tab: T["value"]) => void;
	currentTab: T["value"];
	tabContentClassName?: string;
	showBottomBorder?: boolean;
	tabFontSize?: string;
};

/**
 * A reusable tab component that renders a set of selectable tabs with custom styling and behavior.
 *
 * @template T - A type that must include `title` and `value` properties for each tab item.
 *
 * @param {Object} props - Props for the Tabs component.
 * @param {Readonly<T[]>} props.tabsData - The list of tab items to render.
 * @param {(value: T["value"]) => void} props.onTabChange - Callback triggered when a tab is selected.
 * @param {T["value"]} props.currentTab - The currently selected tab value.
 * @param {string} [props.tabContentClassName] - Optional class name for additional styling on each tab button.
 * @param {string} [props.tabFontSize] - Optional Tailwind font size class (e.g., "text-sm", "text-lg", "text-[18px]") for customizing tab title size.
 * @param {boolean} [props.showBottomBorder=false] - Whether to show a bottom border under the tab section.
 *
 * @returns {JSX.Element} The rendered tab navigation component.
 */
function TabsComponent<
	T extends {
		title: React.ReactNode;
		value: string;
	}
>({
	tabsData,
	onTabChange,
	currentTab,
	tabContentClassName,
	showBottomBorder = false,
	tabFontSize
}: Readonly<TabsProps<T>>) {
	return (
		<div>
			<Card className="p-0 rounded-lg">
				<div className="flex flex-row w-full gap-2 py-1 px-1">
					{tabsData.map((tab) => (
						<button
							key={tab.value}
							className={cn(
								"rounded-lg bg-transparent px-2 py-2 font-semibold text-white",
								tab.value === currentTab
									? "bg-background-100-2"
									: "text-white/50 hover:text-white/100",
								tabFontSize,
								tabContentClassName
							)}
							onClick={() => {
								onTabChange(tab.value);
							}}
							data-testid={`tab-${tab.value}`}
						>
							{tab.title}
						</button>
					))}
				</div>
			</Card>
			{showBottomBorder && (
				<div className="w-1/2 my-1 border-b border-white/20" />
			)}
		</div>
	);
}

const Tabs = memo(TabsComponent) as typeof TabsComponent;
export default Tabs;
