// Plan de Localhost : les salles découvertes en couleur, le reste en gris.
// Mettre plan.svg dans /public. Coordonnées dans le repère du viewBox (2099 x 1339).

export const ZONES: Record<string, { name: string; pts: [number, number][] }> = {
  coworking: { name: "Flex office", pts: [[58,798],[100,651],[184,551],[593,347],[698,415],[851,446],[861,478],[861,630],[772,646],[181,1040],[105,982],[58,893]] },
  salon: { name: "Salle détente et bibliotech", pts: [[593,347],[798,215],[1050,373],[945,430],[851,446],[698,415]] },
  impression: { name: "Sandbox", pts: [[798,152],[966,40],[1218,189],[1103,294],[1097,341]] },
  hub: { name: "Hub / salle de réunion", pts: [[181,1040],[772,646],[830,701],[893,853],[483,1150],[268,1103]] },
  repos: { name: "Salle de restauration / cafétéria", pts: [[1302,538],[1512,380],[1801,567],[1596,735],[1470,672],[1397,620]] },
};

const toPoints = (pts: [number, number][]) => pts.map((p) => p.join(",")).join(" ");

// Composant partagé ("as-is" avec l'auteur du fichier) : reçoit la liste des zones déjà
// découvertes et révèle le plan en couleur uniquement à ces endroits-là.
export default function PlanRevele({ discovered }: { discovered: string[] }) {
  return (
    <svg
      viewBox="0 0 2099 1339"
      style={{ width: "100%", height: "auto" }}
      role="img"
      aria-label="Plan de Localhost"
    >
      <defs>
        <filter id="gris" colorInterpolationFilters="sRGB">
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncR type="linear" slope={0.55} intercept={0.38} />
            <feFuncG type="linear" slope={0.55} intercept={0.38} />
            <feFuncB type="linear" slope={0.55} intercept={0.38} />
          </feComponentTransfer>
        </filter>
        <filter id="flou" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
        <mask id="revele" maskUnits="userSpaceOnUse" x="0" y="0" width="2099" height="1339">
          <rect width="2099" height="1339" fill="#000" />
          <g filter="url(#flou)" fill="#fff">
            {Object.entries(ZONES).map(([id, z]) => (
              <polygon
                key={id}
                points={toPoints(z.pts)}
                style={{ opacity: discovered.includes(id) ? 1 : 0, transition: "opacity .9s ease" }}
              />
            ))}
          </g>
        </mask>
      </defs>

      {/* 1. le plan entier, en gris */}
      <image href="/pictures/plan_locaux_isometrique.png" width="2099" height="1339" filter="url(#gris)" />
      {/* 2. le plan en couleur, visible seulement dans les salles découvertes */}
      <image href="/pictures/plan_locaux_isometrique.png" width="2099" height="1339" mask="url(#revele)" />
      {/* 3. contour vert autour des salles découvertes */}
      {Object.entries(ZONES).map(([id, z]) => (
        <polygon
          key={id}
          points={toPoints(z.pts)}
          fill="none"
          stroke="#5a9e1f"
          strokeWidth={5}
          strokeLinejoin="round"
          style={{ opacity: discovered.includes(id) ? 0.9 : 0, transition: "opacity .9s ease .2s" }}
        />
      ))}
    </svg>
  );
}
