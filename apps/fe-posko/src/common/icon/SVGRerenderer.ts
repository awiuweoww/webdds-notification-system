import React from "react";

/**
 * Converts a NamedNodeMap of attributes to a props object with camelCase keys.
 * @param attrs - NamedNodeMap from an SVG element.
 * @returns An object with camelCase keys and attribute values.
 */
function attrsToProps(attrs: NamedNodeMap): Record<string, string> {
	return Array.from(attrs).reduce(
		(props: Record<string, string>, attr: Attr) => {
			// attr is typed as Attr, so attr.name is a string

			const camelCaseName = attr.name.replace(
				/-([a-z])/g,
				(_: string, letter: string) => letter.toUpperCase()
			);
			props[camelCaseName] = attr.value;
			return props;
		},
		{}
	);
}

/**
 * Recursively creates React elements from SVG DOM nodes.
 * @param node - The SVG DOM node.
 * @param index - Optional index for React key.
 * @returns A React element, string (for text), or null.
 */
function createReactElementFromSVGNode(
	node: ChildNode,
	index?: number
): React.ReactNode {
	if (node.nodeType === Node.TEXT_NODE) {
		return node.nodeValue;
	}

	if (node.nodeType !== Node.ELEMENT_NODE) {
		return null;
	}

	const element = node as Element;
	let children = Array.from(element.childNodes).map((child, i) =>
		createReactElementFromSVGNode(child, i)
	);
	children = children.filter((child) => child !== null);

	return React.createElement(
		element.tagName,
		{ ...attrsToProps(element.attributes), key: index },
		children.length === 0 ? undefined : children
	);
}

export interface SVGRendererProps {
	svgString: string;
}

/**
 * Renders a React component from an SVG string.
 * Converts the SVG string into a DOM element, then recursively transforms it into React elements.
 * @param props - Component props.
 * @param props.svgString - The SVG content as a string.
 * @returns A React component representing the SVG.
 */
const SVGRenderer: React.FC<SVGRendererProps> = ({ svgString }) => {
	try {
		if (!svgString) return null;
		const parser = new DOMParser();
		const svgDocument = parser.parseFromString(svgString, "image/svg+xml");
		const svgElement = svgDocument.documentElement;

		if (svgElement.tagName.toLowerCase() !== "svg") {
			console.warn("SVGRenderer: Root element is not SVG", svgElement.tagName);
			return null;
		}

		const svgProps = attrsToProps(svgElement.attributes);
		const svgChildren = Array.from(svgElement.childNodes).map((node, i) =>
			createReactElementFromSVGNode(node, i)
		);

		return React.createElement("svg", svgProps, svgChildren);
	} catch (err) {
		console.error("SVGRenderer: Failed to parse/render SVG", err);
		return null;
	}
};

export default SVGRenderer;
