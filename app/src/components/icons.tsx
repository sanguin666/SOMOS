import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

type IconProps = {
  size?: number;
  color?: string;
};

export function BackChevronIcon({ size = 20, color = '#111111' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 5l-7 7 7 7"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ChevronRightIcon({ size = 20, color = '#3D3D3D' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 5l7 7-7 7"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function BellIcon({ size = 20, color = '#111111', filled = false }: IconProps & { filled?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={filled ? color : 'none'}
      />
      <Path
        d="M13.73 21a2 2 0 0 1-3.46 0"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function CalendarIcon({ size = 24, color = '#FFFFFF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={4} width={18} height={18} rx={2} stroke={color} strokeWidth={2} />
      <Line x1={16} y1={2} x2={16} y2={6} stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Line x1={8} y1={2} x2={8} y2={6} stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Line x1={3} y1={10} x2={21} y2={10} stroke={color} strokeWidth={2} />
    </Svg>
  );
}

export function HeartIcon({ size = 24, color = '#FFFFFF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8Z" />
    </Svg>
  );
}

export function CloseIcon({ size = 20, color = '#111111' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 6 6 18M6 6l12 12"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function QrIcon({ size = 26, color = '#FFFFFF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Rect x={6} y={6} width={28} height={28} rx={6} stroke={color} strokeWidth={7} />
      <Rect x={16} y={16} width={8} height={8} rx={2} fill={color} />
      <Rect x={66} y={6} width={28} height={28} rx={6} stroke={color} strokeWidth={7} />
      <Rect x={76} y={16} width={8} height={8} rx={2} fill={color} />
      <Rect x={6} y={66} width={28} height={28} rx={6} stroke={color} strokeWidth={7} />
      <Rect x={16} y={76} width={8} height={8} rx={2} fill={color} />
      <Rect x={66} y={66} width={10} height={10} rx={2} fill={color} />
      <Rect x={82} y={66} width={10} height={10} rx={2} fill={color} />
      <Rect x={66} y={82} width={10} height={10} rx={2} fill={color} />
      <Rect x={46} y={46} width={10} height={10} rx={2} fill={color} />
      <Rect x={46} y={6} width={10} height={10} rx={2} fill={color} />
      <Rect x={6} y={46} width={10} height={10} rx={2} fill={color} />
    </Svg>
  );
}

export function PinIcon({ size = 24, color = '#111111' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22s7-7.58 7-12.5A7 7 0 0 0 5 9.5C5 14.42 12 22 12 22Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={12} cy={9.5} r={2.5} stroke={color} strokeWidth={2} />
    </Svg>
  );
}
