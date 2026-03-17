import { useEffect, useRef } from "react";

type VoiceBarsProps = {
  analyser: AnalyserNode | null
  width: number
  height: number
}

export default function VoiceBars({ analyser, width, height }: VoiceBarsProps) {
  const barsRef = useRef<SVGPathElement[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!analyser) return;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const animate = () => {
      analyser.getByteFrequencyData(dataArray);
      barsRef.current.forEach((bar, i) => {
        const value = dataArray[i * 2] || 0;
        const scaleY = 0.5 + (value / 255) * 2;
        bar.setAttribute(
          "transform",
          `translate(0, 12) scale(1, ${scaleY}) translate(0, -12)`
        );
      });
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, [analyser]);

  const setBarRef = (i: number) => (el: SVGPathElement | null) => {
    if (el) barsRef.current[i] = el;
  };

  return (
    <svg width={width} height={height} viewBox="0 0 24 24" stroke="var(--font-color)">
      <path ref={setBarRef(0)} d="M4 10L4 14"  strokeWidth="1.5" strokeLinecap="round" />
      <path ref={setBarRef(1)} d="M8 9L8 15"   strokeWidth="1.5" strokeLinecap="round" />
      <path ref={setBarRef(2)} d="M12 4L12 20"  strokeWidth="1.5" strokeLinecap="round" />
      <path ref={setBarRef(3)} d="M16 7L16 17"  strokeWidth="1.5" strokeLinecap="round" />
      <path ref={setBarRef(4)} d="M20 10L20 14" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}