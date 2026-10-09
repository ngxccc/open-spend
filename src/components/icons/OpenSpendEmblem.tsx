import Svg, {
 Circle,
 Defs,
 G,
 LinearGradient,
 Polygon,
 Stop,
 SvgProps,
} from "react-native-svg";

interface OpenSpendEmblemProps extends SvgProps {
 size?: number;
}

/**
 * Official OpenSpend Facet Precision Emblem
 * Tight bounding box: [-105, -135, 210, 270] ensures the emblem
 * completely fills the allocated space without wasted padding.
 */
export function OpenSpendEmblem({
 size = 28,
 ...props
}: OpenSpendEmblemProps) {
 return (
  <Svg
   width={size}
   height={size}
   viewBox="-105 -135 210 270"
   fill="none"
   {...props}
  >
   <Defs>
    <LinearGradient id="facetWhite" x1="0%" y1="0%" x2="100%" y2="100%">
     <Stop offset="0%" stopColor="#FFFFFF" />
     <Stop offset="100%" stopColor="#E5E1E4" />
    </LinearGradient>
    <LinearGradient id="facetSilver" x1="0%" y1="0%" x2="100%" y2="100%">
     <Stop offset="0%" stopColor="#C6C6CF" />
     <Stop offset="100%" stopColor="#8E9193" />
    </LinearGradient>
    <LinearGradient id="facetGraphite" x1="0%" y1="0%" x2="100%" y2="100%">
     <Stop offset="0%" stopColor="#2F3037" />
     <Stop offset="100%" stopColor="#1F1F23" />
    </LinearGradient>
   </Defs>
   <G>
    <Polygon
     points="0,-128 -96,-32 -32,32 0,-32"
     fill="url(#facetWhite)"
    />
    <Polygon
     points="0,-128 96,-32 32,32 0,-32"
     fill="url(#facetSilver)"
    />
    <Polygon
     points="-96,-32 0,128 0,64 -32,32"
     fill="url(#facetGraphite)"
     stroke="#3F3F46"
     strokeWidth={2}
    />
    <Polygon
     points="96,-32 0,128 0,64 32,32"
     fill="url(#facetSilver)"
     stroke="#27272A"
     strokeWidth={2}
    />
    <Polygon
     points="0,-32 32,32 0,64 -32,32"
     fill="#121214"
     stroke="#3F3F46"
     strokeWidth={3}
    />
    <Circle cx={0} cy={16} r={7} fill="#FFFFFF" />
   </G>
  </Svg>
 );
}

export default OpenSpendEmblem;
