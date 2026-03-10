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
 * Description        : SkeletonStatus component that displays a loading placeholder
 *                      for status indicators using animated gray blocks.
 *
 * Changelog:
 * - 0.1.0 (01-07-2025): Initial implementation of the SkeletonStatus component.
 */
import React from "react";

/**
 * SkeletonStatus is a placeholder component to display a skeleton of a status
 * component until the actual data is loaded. It displays a row of gray blocks
 * to indicate that the status is loading.
 * @returns A JSX element representing the SkeletonStatus component.
 */
const SkeletonStatus: React.FC = () => {
	return (
		<div className="animate-pulse flex space-x-4" data-testid="skeleton-status">
			<div className="flex-1 space-y-6 py-1">
				<div className="space-y-3">
					<div className="grid grid-cols-3 gap-4">
						<div className="h-4 w-24 bg-[#3c3f3e] rounded-md col-span-2"></div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SkeletonStatus;
