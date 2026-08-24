/**
 * A quiet, abstract node-and-thread motif -- a nod to Ananse's web as a
 * network of connected knowledge, rendered as a technical diagram rather
 * than a literal spider. Used as a faint decorative layer, never as
 * foreground content.
 */
const NODES: [number, number][] = [
  [40, 60], [140, 30], [230, 90], [330, 40], [420, 100],
  [80, 160], [190, 190], [300, 170], [400, 210],
  [60, 280], [170, 300], [280, 300], [390, 320],
  [120, 400], [250, 420], [360, 400],
];

const EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [1, 5], [1, 6], [2, 6], [2, 7], [3, 7], [4, 8],
  [5, 6], [6, 7], [7, 8], [5, 9], [6, 10], [7, 11], [8, 12],
  [9, 10], [10, 11], [11, 12], [9, 13], [10, 13], [10, 14], [11, 14], [11, 15], [12, 15],
  [13, 14], [14, 15],
];

export default function NetworkMesh({
  className = "",
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <svg
      viewBox="0 0 460 460"
      aria-hidden="true"
      className={className}
      style={{
        maskImage: "radial-gradient(circle at center, black 0%, transparent 75%)",
        WebkitMaskImage:
          "radial-gradient(circle at center, black 0%, transparent 75%)",
      }}
    >
      <g
        stroke={tone === "dark" ? "#d3a355" : "#b3812f"}
        strokeWidth="1"
        strokeOpacity={tone === "dark" ? 0.35 : 0.25}
      >
        {EDGES.map(([a, b], i) => {
          const [x1, y1] = NODES[a];
          const [x2, y2] = NODES[b];
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </g>
      <g fill={tone === "dark" ? "#d3a355" : "#b3812f"} fillOpacity={tone === "dark" ? 0.6 : 0.5}>
        {NODES.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 3 : 2} />
        ))}
      </g>
    </svg>
  );
}
