//=============================================================================
// MessageWindowOP.js
//   Last update: 2019/04/18
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
 * [v0.1.0] イベント中でもメッセージウィンドウを表示しっぱなしにします。
 * 
 * @author 黒姫霧生
 *
 * @help パラメータとか分からんので、プラグインのコードを直接いじって調整してね。
 */

Window_Message.prototype.checkToNotClose = function() {
	if (this.isClosing() && this.isOpen()) {
		if (this.doesContinue() || $gameSwitches.value(150)) {	//ここでスイッチの番号を変更
			this.open();
		}
	}
};