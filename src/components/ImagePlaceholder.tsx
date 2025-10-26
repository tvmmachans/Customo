import React from "react";

type Props = {
  src?: string;
  alt?: string;
  name?: string;
  className?: string;
};

function textToColor(s: string) {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = s.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}deg 60% 40%)`;
}

const generateSvgDataUri = (label: string, width = 800, height = 600) => {
  const bg = textToColor(label || "robot");
  const escaped = label.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const svg = `<?xml version='1.0' encoding='UTF-8'?>\n<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'>\n  <rect width='100%' height='100%' fill='${bg}'/>\n  <text x='50%' y='50%' font-family='Inter, system-ui, -apple-system, Roboto, "Helvetica Neue", Arial' font-size='36' fill='white' dominant-baseline='middle' text-anchor='middle'>${escaped}</text>\n</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const ImagePlaceholder: React.FC<Props> = ({ src, alt, name, className }) => {
  const isPlaceholder = !src || src === "/placeholder.svg" || src.endsWith("placeholder.svg");
  const imgSrc = isPlaceholder ? generateSvgDataUri(name || (alt || "Product")) : src;
  return <img src={imgSrc} alt={alt} className={className} />;
};

export default ImagePlaceholder;
