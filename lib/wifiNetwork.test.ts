import { describe, expect, it } from "vitest";
import { isOnLocalhostNetwork } from "./wifiNetwork";

// Valeurs alignées sur KNOWN_WIFI_IPV4 / KNOWN_WIFI_IPV6 : à mettre à jour avec elles.
const IPV4 = "176.149.210.12";
const IPV6 = "2001:861:3dc6:7a70:7cb1:4a1f:b052:d544";

describe("isOnLocalhostNetwork", () => {
  it("refuse les valeurs vides", () => {
    expect(isOnLocalhostNetwork(null)).toBe(false);
    expect(isOnLocalhostNetwork(undefined)).toBe(false);
    expect(isOnLocalhostNetwork("")).toBe(false);
  });

  it("accepte l'IPv4 exacte, même avec des espaces", () => {
    expect(isOnLocalhostNetwork(IPV4)).toBe(true);
    expect(isOnLocalhostNetwork(` ${IPV4} `)).toBe(true);
  });

  it("refuse une autre IPv4", () => {
    expect(isOnLocalhostNetwork("176.149.210.13")).toBe(false);
  });

  it("accepte une IPv6 du même préfixe /64", () => {
    expect(isOnLocalhostNetwork(IPV6)).toBe(true);
    expect(isOnLocalhostNetwork("2001:861:3dc6:7a70::1")).toBe(true);
    expect(isOnLocalhostNetwork("2001:0861:3DC6:7A70:1:2:3:4")).toBe(true);
  });

  it("refuse une IPv6 d'un autre préfixe", () => {
    expect(isOnLocalhostNetwork("2001:861:3dc6:7a71::1")).toBe(false);
    expect(isOnLocalhostNetwork("::1")).toBe(false);
  });

  it("refuse les entrées invalides", () => {
    expect(isOnLocalhostNetwork("pas-une-ip")).toBe(false);
    expect(isOnLocalhostNetwork("1:2:3:4:5:6:7:8:9")).toBe(false);
  });
});
