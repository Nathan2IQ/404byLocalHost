import { describe, expect, it } from "vitest";
import {
  checkWifiPassword,
  isWifiChallengeSolved,
  markWifiChallengeSolved,
} from "./wifi";

describe("checkWifiPassword", () => {
  it("accepte le bon mot de passe", () => {
    expect(checkWifiPassword("127.0.0.1")).toBe(true);
  });

  it("ignore les espaces autour", () => {
    expect(checkWifiPassword("  127.0.0.1 ")).toBe(true);
  });

  it("refuse un mauvais mot de passe ou une saisie vide", () => {
    expect(checkWifiPassword("127.0.0.2")).toBe(false);
    expect(checkWifiPassword("")).toBe(false);
  });
});

describe("défi WiFi", () => {
  it("mémorise la résolution dans un cookie", () => {
    expect(isWifiChallengeSolved()).toBe(false);
    markWifiChallengeSolved();
    expect(isWifiChallengeSolved()).toBe(true);
  });
});
