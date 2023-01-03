import { jest } from '@jest/globals';
import { Countdown } from "./countdown.mjs";

describe("countdown", () => {
    describe("when no time left", () => {
        test("shows nothing", () => {
            const onData = jest.fn();
            const onNothing = jest.fn();
            const from = Date.UTC(2030, 1, 1, 1, 1, 1, 0);
            const to = Date.UTC(2030, 1, 1, 1, 1, 1, 0)
            const countdown = new Countdown(to, onData, onNothing);

            countdown.tick(from)
            expect(onData).not.toHaveBeenCalled();
            expect(onNothing).toHaveBeenCalled()
        });
    })
    describe("when some time is left", () => {
        test("shows days, hours, minutes, and seconds (plural)", () => {
            const mockWrite = jest.fn();
            const from = Date.UTC(2030, 1, 1, 1, 1, 1, 1);
            const to = Date.UTC(2030, 1, 11, 11, 11, 11, 999)
            const countdown = new Countdown(to, mockWrite);

            countdown.tick(from)
            expect(mockWrite).toHaveBeenCalledWith("10 days, 10 hours, 10 minutes, 10 seconds");
        });

        test("shows days, hours, minutes, and seconds (singular)", () => {
            const mockWrite = jest.fn();
            const from = Date.UTC(2030, 1, 1, 1, 1, 1, 1);
            const to = Date.UTC(2030, 1, 2, 2, 2, 2, 999)
            const countdown = new Countdown(to, mockWrite);

            countdown.tick(from)
            expect(mockWrite).toHaveBeenCalledWith("1 day, 1 hour, 1 minute, 1 second");
        });

        test("doesn't show days if zero", () => {
            const mockWrite = jest.fn();
            const from = Date.UTC(2030, 1, 1, 1, 1, 1, 1);
            const to = Date.UTC(2030, 1, 1, 11, 11, 11, 999)
            const countdown = new Countdown(to, mockWrite);

            countdown.tick(from)
            expect(mockWrite).toHaveBeenCalledWith("10 hours, 10 minutes, 10 seconds");
        });

        test("doesn't show hours if zero", () => {
            const mockWrite = jest.fn();
            const from = Date.UTC(2030, 1, 1, 1, 1, 1, 1, 0);
            const to = Date.UTC(2030, 1, 1, 1, 11, 11, 999)
            const countdown = new Countdown(to, mockWrite);

            countdown.tick(from)
            expect(mockWrite).toHaveBeenCalledWith("10 minutes, 10 seconds");
        });

        test("doesn't show minutes if zero", () => {
            const mockWrite = jest.fn();
            const from = Date.UTC(2030, 1, 1, 1, 1, 1, 1, 0);
            const to = Date.UTC(2030, 1, 1, 1, 1, 11, 999)
            const countdown = new Countdown(to, mockWrite);

            countdown.tick(from)
            expect(mockWrite).toHaveBeenCalledWith("10 seconds");
        });
    });

})
