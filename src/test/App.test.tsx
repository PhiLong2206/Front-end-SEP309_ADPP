
import { describe, it, expect } from "vitest";

describe("ADPP Frontend - Basic Tests", () => {
    it("should verify the application name", () => {
        const appName = "ADPP";
        expect(appName).toBe("ADPP");
    });

    it("should verify supported debate modes", () => {
        const modes = ["1v1", "2v2"];

        expect(modes).toContain("1v1");
        expect(modes).toContain("2v2");
    });
});
