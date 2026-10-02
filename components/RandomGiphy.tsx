"use client";

import { useEffect, useState } from "react";

// Remplacer par les IDs des GIFs (giphy.com > Embed > src="https://giphy.com/embed/<ID>")
const GIPHY_IDS = ["zNWmrPRvrC1LW", "i0xGuo4o5PutVo0imJ", "Sy2lziCOPymAbNA1NW"];

export default function RandomGiphy() {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    setId(GIPHY_IDS[Math.floor(Math.random() * GIPHY_IDS.length)]);
  }, []);

  if (!id) return <div style={{ height: 240 }} />;

  return (
    <iframe
      src={`https://giphy.com/embed/${id}`}
      width="240"
      height="240"
      style={{ border: 0 }}
      allowFullScreen
      title="Accès refusé"
    />
  );
}
