import React from "react";

export default function GlobalDonut({ percent=0, size=140, stroke=16 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - percent/100);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} stroke="#eef2f7" strokeWidth={stroke} fill="none" />
      <circle cx={size/2} cy={size/2} r={r} stroke="#10b981" strokeWidth={stroke} fill="none"
              strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
              transform={`rotate(-90 ${size/2} ${size/2})`} />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
            style={{fontSize: "18px", fill:"#0f172a", fontWeight:600}}>
        {percent}%
      </text>
    </svg>
  );
}
