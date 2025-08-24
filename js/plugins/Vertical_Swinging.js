//rpg_sprites.js　より抜粋

/*:
 * @plugindesc シェイクを縦にするよ。
 * @author ゆわか
 */

Spriteset_Base.prototype.updatePosition = function() {
    var screen = $gameScreen;
    var scale = screen.zoomScale();
    this.scale.x = scale;
    this.scale.y = scale;
    this.x = Math.round(-screen.zoomX() * (scale - 1));
    this.y = Math.round(-screen.zoomY() * (scale - 1));
    this.y += Math.round(screen.shake()); //ここのyをxに戻せば横揺れになる
};