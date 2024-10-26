/* eslint-disable sonarjs/new-cap */
import { FormatRegistry } from '@sinclair/typebox';

import { registerAjvFormats } from '../index.js';

afterEach(() => {
    FormatRegistry.Clear();
});
describe('registerAjvFormats', () => {
    it('should register formats from ajv-formats', () => {
        registerAjvFormats(FormatRegistry);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const validator = FormatRegistry.Get('date-time')!;
        expect(validator).toBeInstanceOf(Function);
        expect(validator(new Date().toISOString())).toBeTruthy();
        expect(validator('Invalid Date')).toBeFalsy();
    });
    it('should register formats from ajv-formats-draft02019', () => {
        registerAjvFormats(FormatRegistry);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const validator = FormatRegistry.Get('duration')!;
        expect(validator).toBeInstanceOf(Function);
        expect(validator('P3Y6M4DT12H30M5S')).toBeTruthy();
        expect(validator('Invalid Duration')).toBeFalsy();
    });
});
