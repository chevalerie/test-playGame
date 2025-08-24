/*:
 * @plugindesc 複数の透明な矩形の範囲にマウスがあるかを個別にチェックするプラグイン
 * @author 黒姫霧生
 * @help
 * このプラグインは、指定した複数の範囲内にマウスカーソルがあるかどうかを判定します。
 * 使用方法:
 * - このプラグインを有効にする。
 * - ゲーム内のスクリプトコマンドで `TouchInput.isMouseInRects(rectangles)` または
 *   `TouchInput.getHoveredRectIndex(rectangles)` を使用して範囲チェックを行う。
 *
 * rectanglesは、各矩形を定義する配列で、各要素は[x1, y1, x2, y2]の形式です。
 */

(function() {
    TouchInput.isMouseInRect = function(x1, y1, x2, y2) {
        var mouseX = this.x;
        var mouseY = this.y;
        return mouseX >= x1 && mouseX <= x2 && mouseY >= y1 && mouseY <= y2;
    };

    TouchInput.getHoveredRectIndex = function(rectangles) {
        for (var i = 0; i < rectangles.length; i++) {
            var rect = rectangles[i];
            if (this.isMouseInRect(rect[0], rect[1], rect[2], rect[3])) {
                return i; // 矩形のインデックスを返す
            }
        }
        return -1; // どの矩形にもホバーしていない場合
    };
})();
