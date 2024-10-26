import type { FormatRegistry } from '@sinclair/typebox';
import type { Format as ajvFormat, FormatDefinition } from 'ajv';

import * as ajvFormats from './ajv-formats/formats.js';

/**
 * Register formats in a dictionary or entries.
 * @param registry - The `FormatRegistry` of TypeBox.
 * @param formats - Formats in a dictionary or entries.
 */
export const registerFormats = (
    registry: { Set: typeof FormatRegistry.Set },
    formats:
        | Readonly<
              Record<
                  Parameters<(typeof FormatRegistry)['Set']>[0],
                  Parameters<(typeof FormatRegistry)['Set']>[1]
              >
          >
        | ReadonlyArray<
              readonly [
                  Parameters<(typeof FormatRegistry)['Set']>[0],
                  Parameters<(typeof FormatRegistry)['Set']>[1],
              ]
          >,
): void => {
    if ((Array.isArray as (v: unknown) => v is readonly unknown[])(formats)) {
        for (const [name, format] of formats) {
            // eslint-disable-next-line sonarjs/new-cap
            registry.Set(name, format);
        }
    } else {
        for (const [, [name, format]] of Object.entries(formats).entries()) {
            // eslint-disable-next-line sonarjs/new-cap
            registry.Set(name, format);
        }
    }
};

/**
 * Transform an ajv format into a TypeBox format func which can be passed as the second parameter of `FormatRegistry.Set()`.
 * @param format - An ajv format.
 * @returns An TypeBox format func.
 */
// eslint-disable-next-line unicorn/prevent-abbreviations
export const toTypeBoxFormatFunc = (format: ajvFormat): ((value: string) => boolean) => {
    if (format === true) {
        return () => true;
    }
    if (format instanceof RegExp) {
        return value => format.test(value);
    }
    if (typeof format === 'string') {
        return value => value === format;
    }
    if (typeof format === 'function') {
        return format;
    }
    if (
        typeof format === 'object' &&
        (format.type === 'string' || format.type === undefined) &&
        (format.async === false || format.async === undefined)
    ) {
        return toTypeBoxFormatFunc((format as FormatDefinition<string>).validate);
    }
    return () => true;
};

/**
 * Register standard JSON Schema string formats from https://github.com/ajv-validator/ajv-formats
 * @param registry - The `FormatRegistry` of TypeBox.
 * @param options - Options.
 */
export const registerAjvFormats = (
    registry: { Set: typeof FormatRegistry.Set },
    options?: {
        /**
         * The mode of formats from 'ajv-formats'.
         * @defaultValue `'full'`
         */
        mode?: 'fast' | 'full';
        /**
         * Set true to add formats from optional https://github.com/luzlab/ajv-formats-draft2019.
         *
         * Optional dependencies are required to enable this.
         *
         * Only available with the ability of handling CommonJS `require` module system.
         *
         * @defaultValue `false`
         */
        draft2019?: boolean;
    },
): void => {
    const formats = options?.mode === 'fast' ? ajvFormats.fastFormats : ajvFormats.fullFormats;
    registerFormats(
        registry,
        Object.entries(formats).map(([key, format]) => [key, toTypeBoxFormatFunc(format)] as const),
    );
    if (options?.draft2019 === true) {
        registerFormats(
            registry,
            Object.entries(
                // eslint-disable-next-line unicorn/prefer-module, @typescript-eslint/no-require-imports
                require('./ajv-formats-draft2019/formats/index.js') as ajvFormats.DefinedFormats,
            ).map(([key, format]) => [key, toTypeBoxFormatFunc(format)] as const),
        );
    }
};
