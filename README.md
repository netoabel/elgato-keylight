# Elgato Key Light Control

A TypeScript library to control Elgato Key Light devices.

## Installation

```bash
npm install elgato-keylight
```

## Usage

```typescript
import { KeyLight } from "elgato-keylight";
const keylight = new KeyLight();
// Turn on
await keylight.setState({ on: 1 });
// Set brightness to 50%
await keylight.setBrightness(50);
// Toggle state
await keylight.toggleState();
```
