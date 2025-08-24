/*:
 * @plugindesc [v1.1] メッセージ送り入力そのものを無効化するプラグイン
 * @author 黒姫霧生
 *
 * @help
 * ----------------------------------------------------
 * ■使い方
 *
 * ロックしたい場面で以下を実行：
 *
 *   $gameTemp._messageLocked = true;
 *
 * ロック解除したいときは：
 *
 *   $gameTemp._messageLocked = false;
 *
 * ロック中は、メッセージ送りのクリックやキーが
 * 一切効かなくなります。
 *
 * ----------------------------------------------------
 * このプラグインにはパラメータはありません。
 */

(function() {

    const _isTriggered = Window_Message.prototype.isTriggered;
    Window_Message.prototype.isTriggered = function() {
        if ($gameTemp._messageLocked) {
            return false;
        }
        return _isTriggered.call(this);
    };

})();
