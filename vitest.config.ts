import {defineConfig} from 'vitest/config';

export default defineConfig({
    test: {
        minWorkers: 1,
        maxWorkers: 1,
        sequence: {
            shuffle: false
        },
        environment: 'node',
        testTimeout: 10000,
        hookTimeout: 10000,
        passWithNoTests: true,
        reporters: ['verbose'],
        globals: true
    }
});