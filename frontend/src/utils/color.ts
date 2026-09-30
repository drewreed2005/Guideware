/* 
 * src/utils/color.ts
 * 
 * Defines color-handling utilities for Guideware guide displays, such as:
 * hexToRgb function: self-explanatory
 * lightenColor function: blends hex color toward white by a given factor (0 = no change,
 *                        1 = white) for automatic task coloring by section color
 * sectionBorderColor function: returns a CSS border color for a subsection according to its
 *                              nesting depth, where each level of depth decreases opacity
 */


function hexToRgb(hex: string): { r: number; g: number; b: number } {
    // cleaning the given hexadecimal representation of its "#"
    const cleaned = hex.replace("#", "");

    return {
        r: parseInt(cleaned.substring(0, 2), 16),
        g: parseInt(cleaned.substring(2, 4), 16),
        b: parseInt(cleaned.substring(4, 6), 16)
    };
    // (parsing for int with radix 16 to recognize hexadecimal values as integers)
}


export function lightenColor(hex: string, factor: number = 0.85): string {
    const { r, g, b } = hexToRgb(hex);
    const blend = (channel: number) =>
        Math.round(channel + (255 - channel) * factor);
    return `rgb(${blend(r)}, ${blend(g)}, ${blend(b)})`;
}


export function sectionBorderColor(hex: string, depth: number): string {
    const opacity = Math.max(0.4, 1 - depth * 0.15);
    const { r, g, b } = hexToRgb(hex);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}