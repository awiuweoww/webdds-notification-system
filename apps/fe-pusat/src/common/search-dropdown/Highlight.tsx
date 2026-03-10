/*
 * Copyright (c) PT Len Innovation Technology
 * Author       : Saeful AS
 * Version      : 0.1.0
 * Created Date : 22-08-2025
 * Description  : Utility to highlight query matches inside a label string.
 *                - Escapes regex metacharacters in `query`
 *                - Case-insensitive, global matching
 *                - Wraps matches in <strong class="font-semibold">
 *                - Returns a React Fragment mixing plain text and <strong> parts
 *
 * Changelog:
 * - 0.1.0 (28-08-2025): Initial implementation of highlightMatches utility.
 */
import React from "react";

/**
 * Highlights parts of a label string that match a given query.
 *
 * @param {string} label - The string to highlight matches in.
 * @param {string} query - The query string to highlight matches of.
 *
 * @returns {React.ReactNode} A React node containing the original label string with matching parts highlighted.
 */
export function highlightMatches(label: string, query: string) {
	if (!query) return label;
	const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const re = new RegExp(escaped, "gi");

	const parts: React.ReactNode[] = [];
	let last = 0;
	let m: RegExpExecArray | null;

	while ((m = re.exec(label)) !== null) {
		if (m.index > last) parts.push(label.slice(last, m.index));
		parts.push(
			<strong key={m.index} className="font-semibold">
				{m[0]}
			</strong>
		);
		last = re.lastIndex;
	}
	if (last < label.length) parts.push(label.slice(last));
	return <>{parts}</>;
}
