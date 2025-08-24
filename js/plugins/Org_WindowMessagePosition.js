//=============================================================================
// Org_WindowMessagePosition.js
//   Last update: 2021/05/27
//=============================================================================

/*:
 * @plugindesc
 * [v0.1.0] .
 * 
 * @author KUROHIME kiryu
 *
 * @help This plugin does not provide plugin commands.
 */

/*:ja
 * @plugindesc
 * [v0.1.0] メッセージウィンドウ内に表示されるテキストの開始位置を変更します。
 * 
 * @author 黒姫霧生
 *
 * @help パラメータとか分からんので、プラグインのコードを直接いじって調整してね。
 */

(() => {
  'use strict';
  const MESSAGE_START_X = 130;	/*顔グラがない時のテキスト開始位置。初期？位置：50*/

  Window_Message.prototype.newLineX = function() {
    return $gameMessage.faceName() === '' ? MESSAGE_START_X : 120;	/*顔グラがある時のテキスト開始位置*/
  };
})();