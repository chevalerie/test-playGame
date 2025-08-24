/*:ja
 * @plugindesc ピクチャをマスクするプラグインコマンドサンプル
 * @author DarkPlasma
 * @license MIT
 *
 * @target MV
 * @help
 * 
 * MaskPicture 1 2
 * ピクチャ1をピクチャ2でマスクします。
 * 
 * UnmaskPicture 1
 * ピクチャ1にかけたマスクを解除します。
 */
(() => {
  'use strict';

  const pluginName = 'DarkPlasma_PlayGround';

  function Game_Screen_MaskPictureMixIn(gameScreen) {
    gameScreen.maskPicture = function (basePictureId, maskPictureId) {
      const basePicture = this.picture(basePictureId);
      const maskPicture = this.picture(maskPictureId);
      if (!basePicture || !maskPicture) {
        return;
      }

      this._maskPictureRequest = {
        base: basePictureId,
        mask: maskPictureId,
      };
    };

    gameScreen.unmaskPicture = function (basePictureId) {
      this._unmaskPictureRequest = basePictureId;
    }

    gameScreen.maskPictureRequest = function () {
      return this._maskPictureRequest;
    };

    gameScreen.unmaskPictureRequest =  function () {
      return this._unmaskPictureRequest;
    };

    gameScreen.resetMaskPictureRequest = function () {
      this._maskPictureRequest = undefined;
    };

    gameScreen.resetUnmaskPictureRequest = function () {
      this._unmaskPictureRequest = undefined;
    };
  }

  Game_Screen_MaskPictureMixIn(Game_Screen.prototype);

  function Game_Interpreter_MaskPictureMixIn(gameInterpreter) {
    const _pluginCommand = gameInterpreter.pluginCommand;
    gameInterpreter.pluginCommand = function(command, args) {
      if (command === "MaskPicture") {
        const base = Number(args[0] || 1);
        const mask = Number(args[1] || 2);
        $gameScreen.maskPicture(base, mask);
      } else if (command === "UnmaskPicture") {
        const base = Number(args[0] || 1);
        $gameScreen.unmaskPicture(base);
      }
      _pluginCommand.call(this, command, args);
    };
  }

  Game_Interpreter_MaskPictureMixIn(Game_Interpreter.prototype);

  function Spriteset_MaskPictureMixIn(spritesetClass) {
    const _update = spritesetClass.update;
    spritesetClass.update = function () {
      _update.call(this);
      this.updateMask();
    };

    spritesetClass.updateMask = function () {
      if ($gameScreen.maskPictureRequest()) {
        const baseSprite = this._pictureContainer.children
          .find(sprite => sprite.pictureId() === $gameScreen.maskPictureRequest().base);
        const maskSprite = this._pictureContainer.children
          .find(sprite => sprite.pictureId() === $gameScreen.maskPictureRequest().mask);
        if (baseSprite && maskSprite) {
          baseSprite.setMask(maskSprite);
        }
        $gameScreen.resetMaskPictureRequest();
      }
      if ($gameScreen.unmaskPictureRequest()) {
        const baseSprite = this._pictureContainer.children
          .find(sprite => sprite.pictureId() === $gameScreen.unmaskPictureRequest());
        if (baseSprite) {
          baseSprite.unmask();
        }
        $gameScreen.resetUnmaskPictureRequest();
      }
    };
  }

  Spriteset_MaskPictureMixIn(Spriteset_Base.prototype);

  function Sprite_Picture_MaskMixIn(spritePicture) {
    spritePicture.setMask = function (sprite) {
      this.mask = sprite;
    };

    spritePicture.unmask = function () {
      this.mask = undefined;
    };

    spritePicture.pictureId = function () {
      return this._pictureId;
    };
  }

  Sprite_Picture_MaskMixIn(Sprite_Picture.prototype);
})();