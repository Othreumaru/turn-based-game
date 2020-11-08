import * as PIXI from 'pixi.js';

export const AXE_GRAPHICS = 'axe';
export const FULL_SHIELD_GRAPHICS = 'full-shield';
export const FULL_THREAT_GRAPHICS = 'full-threat';
export const HEART_GRAPHICS = 'heart';
export const SHIELD_GRAPHICS = 'shield';
export const THREAT_GRAPHICS = 'threat';
export const COIN_GRAPHICS = 'coin';

export const UI_RESOURCES = [
  { name: AXE_GRAPHICS, location: 'ui/axe.png' },
  { name: FULL_SHIELD_GRAPHICS, location: 'ui/full-shield.png' },
  { name: FULL_THREAT_GRAPHICS, location: 'ui/full-threat.png' },
  { name: HEART_GRAPHICS, location: 'ui/heart.png' },
  { name: SHIELD_GRAPHICS, location: 'ui/shield.png' },
  { name: THREAT_GRAPHICS, location: 'ui/threat.png' },
  { name: COIN_GRAPHICS, location: 'ui/coin.png' },
];

export const getUiTexture = (name: string) => {
  return PIXI.Loader.shared.resources[name].texture;
};
