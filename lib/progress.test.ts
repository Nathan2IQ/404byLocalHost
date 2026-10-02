import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getProgress,
  isComplete,
  isImpression3dQuizSolved,
  markImpression3dQuizSolved,
  markRoomSolved,
  resetProgress,
  setRoomSolved,
  solvedCount,
  subscribeToImpression3dQuiz,
} from "./progress";

beforeEach(() => {
  resetProgress();
});

describe("progress", () => {
  it("démarre sans aucune salle résolue", () => {
    expect(getProgress()).toEqual({
      salon: false,
      coworking: false,
      "impression-3d": false,
      hub: false,
      impression3dQuiz: false,
    });
    expect(solvedCount()).toBe(0);
    expect(isComplete()).toBe(false);
  });

  it("persiste une salle résolue dans le cookie", () => {
    markRoomSolved("salon");
    expect(getProgress().salon).toBe(true);
    expect(solvedCount()).toBe(1);
  });

  it("peut annuler une salle résolue", () => {
    markRoomSolved("hub");
    setRoomSolved("hub", false);
    expect(getProgress().hub).toBe(false);
  });

  it("est complet seulement quand les 4 salles sont résolues", () => {
    markRoomSolved("salon");
    markRoomSolved("coworking");
    markRoomSolved("impression-3d");
    expect(isComplete()).toBe(false);
    markRoomSolved("hub");
    expect(isComplete()).toBe(true);
  });

  it("le quiz imprimante ne valide pas la salle", () => {
    markImpression3dQuizSolved();
    expect(isImpression3dQuizSolved()).toBe(true);
    expect(getProgress()["impression-3d"]).toBe(false);
    expect(solvedCount()).toBe(0);
  });

  it("notifie les abonnés du quiz et permet de se désabonner", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeToImpression3dQuiz(listener);
    markImpression3dQuizSolved();
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
    markImpression3dQuizSolved();
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("repart de zéro après reset", () => {
    markRoomSolved("salon");
    resetProgress();
    expect(solvedCount()).toBe(0);
  });

  it("ignore un cookie corrompu", () => {
    document.cookie = "localhost_progress=%7Bpas-du-json; path=/";
    expect(solvedCount()).toBe(0);
  });
});
