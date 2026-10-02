import { beforeEach, describe, expect, it } from "vitest";
import {
  getPlacedPieces,
  isPuzzleSolved,
  PIECE_COUNT,
  placePiece,
  resetPuzzle,
} from "./puzzle";

beforeEach(() => {
  resetPuzzle();
});

describe("puzzle", () => {
  it("démarre avec 16 pièces non placées", () => {
    const placed = getPlacedPieces();
    expect(placed).toHaveLength(PIECE_COUNT);
    expect(placed.every((p) => p === false)).toBe(true);
    expect(isPuzzleSolved()).toBe(false);
  });

  it("persiste les pièces placées", () => {
    placePiece(3);
    placePiece(7);
    const placed = getPlacedPieces();
    expect(placed[3]).toBe(true);
    expect(placed[7]).toBe(true);
    expect(placed.filter(Boolean)).toHaveLength(2);
  });

  it("est résolu quand les 16 pièces sont placées", () => {
    for (let i = 0; i < PIECE_COUNT - 1; i++) placePiece(i);
    expect(isPuzzleSolved()).toBe(false);
    placePiece(PIECE_COUNT - 1);
    expect(isPuzzleSolved()).toBe(true);
  });

  it("reset remet le puzzle à zéro", () => {
    placePiece(0);
    resetPuzzle();
    expect(getPlacedPieces()[0]).toBe(false);
  });

  it("ignore un cookie de mauvaise taille ou corrompu", () => {
    document.cookie = `localhost_puzzle=${encodeURIComponent("[true]")}; path=/`;
    expect(getPlacedPieces()).toHaveLength(PIECE_COUNT);
    expect(isPuzzleSolved()).toBe(false);
    document.cookie = "localhost_puzzle=%7Bpas-du-json; path=/";
    expect(getPlacedPieces().some(Boolean)).toBe(false);
  });
});
