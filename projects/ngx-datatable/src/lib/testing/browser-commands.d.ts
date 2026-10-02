import type { Locator } from 'vitest/browser';
import 'vitest/internal/browser';

declare module 'vitest/internal/browser' {
  interface BrowserCommands {
    longPressDrag(source: Locator, target: Locator): Promise<void>;
  }
}
