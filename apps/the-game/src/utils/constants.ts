import * as PIXI from 'pixi.js';

export const LEFT_X_CENTER_Y_ANCHOR = new PIXI.Point(0, 0.5);
export const RIGHT_X_CENTER_Y_ANCHOR = new PIXI.Point(1, 0.5);
export const CENTER_X_CENTER_Y_ANCHOR = new PIXI.Point(0.5, 0.5);

export const LEFT_X_TOP_Y_ANCHOR = new PIXI.Point(0, 0);
export const RIGHT_X_TOP_Y_ANCHOR = new PIXI.Point(1, 0);
export const CENTER_X_TOP_Y_ANCHOR = new PIXI.Point(0.5, 0);

export const LEFT_X_BOTTOM_Y_ANCHOR = new PIXI.Point(0, 1);
export const RIGHT_X_BOTTOM_Y_ANCHOR = new PIXI.Point(1, 1);
export const CENTER_X_BOTTOM_Y_ANCHOR = new PIXI.Point(0.5, 1);

export const SMALL_TEXT_FONT_STYLE: Partial<PIXI.TextStyle> = {
  fontFamily: 'cursive',
  fontSize: 20,
};

export const MEDIUM_TEXT_FONT_STYLE: Partial<PIXI.TextStyle> = {
  fontFamily: 'cursive',
  fontSize: 32,
};

export const BIG_TEXT_FONT_STYLE: Partial<PIXI.TextStyle> = {
  fontFamily: 'cursive',
  fontSize: 64,
};
