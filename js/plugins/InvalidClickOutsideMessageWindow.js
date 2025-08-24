//=============================================================================
// InvalidClickOutsideMessageWindow.js
//=============================================================================

/*:
 * @plugindesc 「文章の表示...」イベントコマンドにおいて、ウインドウ外のクリックを無効にします。
 * @author 奏ねこま（おとぶきねこま）
 *
 * @help
 * *このプラグインには、プラグインコマンドはありません。      
 *
 * [ 利用規約 ] .................................................................
 *  本プラグインの利用者は、RPGツクールMV/RPGMakerMVの正規ユーザーに限られます。
 *  商用、非商用、ゲームの内容（年齢制限など）を問わず利用可能です。
 *  ゲームへの利用の際、報告や出典元の記載等は必須ではありません。
 *  二次配布や転載、ソースコードURLやダウンロードURLへの直接リンクは禁止します。
 *  （プラグインを利用したゲームに同梱する形での結果的な配布はOKです）
 *  不具合対応以外のサポートやリクエストは受け付けておりません。
 *  本プラグインにより生じたいかなる問題においても、一切の責任を負いかねます。
 * [ 改訂履歴 ] .................................................................
 *   Version 1.00  2016/08/18  初版
 * -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 *  Web Site: http://i.gmobb.jp/nekoma/rpg_tkool/
 *  Twitter : https://twitter.com/koma_neko
 */

(function(){
    'use strict';
    
    var _Window_Message_isTriggered = Window_Message.prototype.isTriggered;
    Window_Message.prototype.isTriggered = function() {
        var result = _Window_Message_isTriggered.call(this);
        if (TouchInput.isRepeated()) {
            var x = this.canvasToLocalX(TouchInput.x);
            var y = this.canvasToLocalY(TouchInput.y);
            if (x < 0 || (x > this.width) || y < 0 || (y > this.height)) {
                return false;
            }
        }
        return result;
    };
}());
