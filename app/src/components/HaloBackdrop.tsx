import { StyleSheet } from 'react-native';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';

/**
 * The white that the welcome screen's words sit on: two overlapping soft
 * blobs of light over the illustration, instead of a card with an edge.
 *
 * The two blobs are shaped around what they carry — a small one over the
 * logo, a wide one over the text and the buttons — and they overlap into
 * a single patch of white.
 *
 * Every stop is opaque white out to `SOLID`, so anything laid over the
 * middle of the screen is read against plain white, never against a
 * half-transparent veil with a figure showing through. Only past that
 * does it fade, and the fade is short so the illustration comes back
 * quickly rather than washing out the whole screen.
 */
const SOLID = 0.77;

export function HaloBackdrop({ width, height }: { width: number; height: number }) {
  return (
    // The viewBox is read as percentages of the screen: the blobs are
    // meant to stretch with it, so nothing here preserves the aspect
    // ratio.
    <Svg
      style={StyleSheet.absoluteFill}
      width={width}
      height={height}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      pointerEvents="none"
    >
      <Defs>
        {/* Measured against each ellipse's own box, so one definition
            serves both however differently they are shaped. */}
        <RadialGradient id="halo">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity="1" />
          <Stop offset={SOLID} stopColor="#FFFFFF" stopOpacity="1" />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </RadialGradient>
      </Defs>

      <Ellipse cx="50" cy="26" rx="40" ry="21" fill="url(#halo)" />
      <Ellipse cx="50" cy="57" rx="70" ry="33" fill="url(#halo)" />
    </Svg>
  );
}
