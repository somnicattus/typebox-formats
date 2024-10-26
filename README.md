# TypeBox Formats

JSON Schema string formats for [TypeBox](https://github.com/sinclairzx81/typebox).

Format validations are from [ajv-formats](https://github.com/ajv-validator/ajv-formats) and optional [ajv-formats-draft2019](https://github.com/luzlab/ajv-formats-draft2019).

## Installation

```bash
npm i typebox-formats
yarn add typebox-formats
pnpm add typebox-formats
```

## Basic Usage

```ts
import { FormatRegistry } from '@sinclair/typebox';
import { registerAjvFormats } from 'typebox-formats';

registerAjvFormats(FormatRegistry);
```

Then TypeBox will validate standard string formats provided by ajv-formats.

```ts
import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

Value.Check(Type.String({ format: 'date-time' }), '2024-10-27T00:00:00.000Z');
// true
```
