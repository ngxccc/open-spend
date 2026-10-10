import Svg, { Circle, Path, Rect, SvgProps } from "react-native-svg";

interface WalletEmblemProps extends SvgProps {
  size?: number;
  color?: string;
}

/**
 * Clean Wallet Emblem matching modern fintech iconography
 */
export function WalletEmblem({ size = 20, color = "#121214", ...props }: WalletEmblemProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Rect x="2" y="5" width="20" height="14" rx="3" fill="currentColor" color={color} />
      <Path
        d="M17 10C15.8954 10 15 10.8954 15 12C15 13.1046 15.8954 14 17 14H22V10H17Z"
        fill="#FFFFFF"
      />
      <Circle cx="18" cy="12" r="1" fill="#121214" />
    </Svg>
  );
}

export default WalletEmblem;
