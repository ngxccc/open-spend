import Svg, { Circle, G, Polygon, SvgProps } from "react-native-svg";

interface OpenSpendEmblemProps extends SvgProps {
 size?: number;
}

/**
 * Official OpenSpend Facet Precision Emblem
 * ViewBox 0 0 200 260 with all positive coordinates.
 * High-contrast solid fills ensuring crisp rendering across all native engines and web.
 */
export function OpenSpendEmblem({
 size = 28,
 ...props
}: OpenSpendEmblemProps) {
 return (
  <Svg
   width={size}
   height={size}
   viewBox="0 0 200 260"
   fill="none"
   {...props}
  >
   <G>
    {/* Top-Left Inflow Wing (Pure Optical White) */}
    <Polygon
     points="100,2 4,98 68,162 100,98"
     fill="#FFFFFF"
    />

    {/* Top-Right Balance Facet (Titanium Silver) */}
    <Polygon
     points="100,2 196,98 132,162 100,98"
     fill="#C6C6CF"
    />

    {/* Bottom-Left Anchor Facet (Graphite Shadow) */}
    <Polygon
     points="4,98 100,258 100,194 68,162"
     fill="#2F3037"
     stroke="#3F3F46"
     strokeWidth={2}
    />

    {/* Bottom-Right Outflow Wing (Surgically Chiseled Silver) */}
    <Polygon
     points="196,98 100,258 100,194 132,162"
     fill="#8E9193"
     stroke="#27272A"
     strokeWidth={2}
    />

    {/* Inner Floating Precision Core (Diamond Horizon) */}
    <Polygon
     points="100,98 132,162 100,194 68,162"
     fill="#121214"
     stroke="#3F3F46"
     strokeWidth={3}
    />

    {/* Micro Precision Indicator (Optical White Center Dot) */}
    <Circle cx={100} cy={146} r={8} fill="#FFFFFF" />
   </G>
  </Svg>
 );
}

export default OpenSpendEmblem;
