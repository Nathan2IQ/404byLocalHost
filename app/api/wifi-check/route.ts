import { headers } from "next/headers";
import { isOnLocalhostNetwork } from "@/lib/wifiNetwork";

// Vérifie si l'appareil qui appelle cette route est sur le même réseau que le WiFi Localhost,
// en comparant l'IP publique de la requête.
export async function GET() {
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");
  const clientIp = forwardedFor?.split(",")[0]?.trim() ?? realIp;

  return Response.json({ connected: isOnLocalhostNetwork(clientIp) });
}
