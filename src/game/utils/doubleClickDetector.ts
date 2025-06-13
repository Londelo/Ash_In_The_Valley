/**
 * Utility class for detecting double-click events on keyboard keys
 */
export class DoubleClickDetector {
  private lastPressTime: Map<string, number> = new Map();
  private readonly threshold: number;

  constructor(thresholdMs: number = 300) {
    this.threshold = thresholdMs;
  }

  /**
   * Checks if a key was double-clicked
   * @param key - The Phaser keyboard key object
   * @param keyId - Unique identifier for the key (e.g., 'SPACE', 'R', 'UP')
   * @returns true if the key was double-clicked within the threshold
   */
  public isDoubleClick(key: Phaser.Input.Keyboard.Key, keyId: string): boolean {
    if (Phaser.Input.Keyboard.JustDown(key)) {
      const currentTime = Date.now();
      const lastPress = this.lastPressTime.get(keyId) || 0;
      
      if (currentTime - lastPress < this.threshold) {
        // Double-click detected, reset the timer to prevent triple-clicks
        this.lastPressTime.set(keyId, 0);
        return true;
      } else {
        // Single click, record the time
        this.lastPressTime.set(keyId, currentTime);
        return false;
      }
    }
    return false;
  }

  /**
   * Resets the double-click state for a specific key
   * @param keyId - The key identifier to reset
   */
  public reset(keyId: string): void {
    this.lastPressTime.delete(keyId);
  }

  /**
   * Resets all double-click states
   */
  public resetAll(): void {
    this.lastPressTime.clear();
  }

  /**
   * Sets a custom threshold for double-click detection
   * @param thresholdMs - New threshold in milliseconds
   */
  public setThreshold(thresholdMs: number): void {
    this.threshold = thresholdMs;
  }
}

/**
 * Creates a global instance for convenience
 */
export const globalDoubleClickDetector = new DoubleClickDetector(300);