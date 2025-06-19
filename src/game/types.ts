// Global type augmentations for Phaser GameObjects
declare global {
  namespace Phaser {
    namespace GameObjects {
      interface Sprite {
        banditInstance?: import('./actors/DaggerBandit').DaggerBandit;
        attackHitbox?: import('./utils/attackHitbox').AttackHitbox;
      }
    }
  }
}

export {};