import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({

    test: {

        globals: true,

        environment: "jsdom",

        setupFiles: [
            "./app/tests/setup.ts",
        ],

        clearMocks: true,

        restoreMocks: true,

    },

    resolve: {

        alias: {

            "@": path.resolve(__dirname, "app"),

        },

    },

});