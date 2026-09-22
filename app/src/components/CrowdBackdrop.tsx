import Svg, { Circle, G, Path, Rect } from 'react-native-svg';
import { StyleSheet } from 'react-native';

// The brand's warm range. Figures take their colour from this list, so
// the crowd stays on-palette however it is laid out.
const TONES = ['#EFD9BE', '#E0A458', '#D98A5A', '#C9703F', '#A9532C', '#E8C6A8', '#B9603A'];

const BACKDROP = '#F7F1E7';

// Laid out in this space and scaled to fill whatever shape the phone is.
const W = 100;
const H = 200;

/**
 * A fixed-seed generator, so the crowd is organic to look at but identical
 * on every launch. A background that reshuffled itself each time would be
 * unsettling on an app people open every day.
 */
function makeRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

type Person = { x: number; y: number; size: number; tone: string };

function crowd(): Person[] {
  const random = makeRandom(20260922);
  const people: Person[] = [];

  // Back to front: later rows are drawn over earlier ones and are bigger,
  // which is what makes a flat pattern read as a crowd with depth.
  const rows = 13;
  for (let row = 0; row < rows; row += 1) {
    const depth = row / (rows - 1);
    const size = 11 + depth * 9;
    const y = -6 + (H + 24) * depth;
    // Big figures need fewer of them to fill the same width.
    const across = Math.round(W / (size * 0.62));
    for (let i = 0; i <= across; i += 1) {
      const jitterX = (random() - 0.5) * size * 0.5;
      const jitterY = (random() - 0.5) * size * 0.35;
      people.push({
        x: (i / across) * (W + size) - size / 2 + jitterX,
        y: y + jitterY,
        size: size * (0.88 + random() * 0.24),
        tone: TONES[Math.floor(random() * TONES.length)],
      });
    }
  }
  return people;
}

const PEOPLE = crowd();

/**
 * One figure: a head and a pair of shoulders. Deliberately faceless and
 * simplified — it stands for "people", not for anybody in particular.
 */
function Figure({ x, y, size, tone }: Person) {
  const head = size * 0.27;
  const halfWidth = size * 0.5;
  const shoulders = y - size * 0.62;
  // The torso runs well past the row in front, which covers its flat
  // bottom edge. Cutting it off at the shoulders instead leaves a ledge
  // of background showing between every row.
  const bottom = y + size * 1.8;

  return (
    <G>
      <Circle cx={x} cy={shoulders - head * 0.75} r={head} fill={tone} />
      <Path
        d={`M${x - halfWidth} ${bottom}
            C${x - halfWidth} ${shoulders} ${x - halfWidth * 0.55} ${shoulders - size * 0.12} ${x} ${shoulders - size * 0.12}
            C${x + halfWidth * 0.55} ${shoulders - size * 0.12} ${x + halfWidth} ${shoulders} ${x + halfWidth} ${bottom}
            Z`}
        fill={tone}
      />
    </G>
  );
}

/**
 * The illustrated background behind the welcome screen: a crowd of simple
 * figures in the brand's warm colours.
 *
 * Drawn rather than shipped as an image, so it stays sharp on every screen
 * and costs nothing to download.
 */
export function CrowdBackdrop({ width, height }: { width: number; height: number }) {
  return (
    <Svg
      style={StyleSheet.absoluteFill}
      width={width}
      height={height}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <Rect x={0} y={0} width={W} height={H} fill={BACKDROP} />
      {PEOPLE.map((person, index) => (
        <Figure key={index} {...person} />
      ))}
    </Svg>
  );
}
