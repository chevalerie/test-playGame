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
 * [v0.1.0] セーブ画面の情報を変更します。
 * 
 * @author 黒姫霧生
 *
 * @help パラメータとか分からんので、プラグインのコードを直接いじって調整してね。
 */


/*セーブ画面に表示する情報*/
(function() {

DataManager.makeSavefileInfo = function() {
　　var info = {};
　　info.globalId = this._globalId;
　　info.title = $dataSystem.gameTitle;
　　info.characters = $gameParty.charactersForSavefile();
　　info.faces = $gameParty.facesForSavefile();
　　info.playtime = 'プレイ時間'+'　' + $gameSystem.playtimeText();
　　info.timestamp = Date.now();
　　info.saveString = $gameMap.displayName();
　　return info;
};

})();

/*パーティ情報の非表示。2頭身の隊列キャラが表示されるところ*/
(function() {
  Window_SavefileList.prototype.drawContents = function(info, rect, valid) {
    var bottom = rect.y + rect.height;
    if (rect.width >= 420) {
        this.drawGameTitle(info, rect.x + 192, rect.y, rect.width - 192);	/*ここでチャプターや章のタイトル、オートセーブであることを示す文字列の位置をいじれる。デフォルト値(info, rect.x + 192, rect.y, rect.width - 192)*/
//        if (valid) {
//            this.drawPartyCharacters(info, rect.x + 220, bottom - 4);
//        }
    }
    var lineHeight = this.lineHeight();
    var y2 = bottom - lineHeight;
    if (y2 >= lineHeight) {
        this.drawPlaytime(info, rect.x, y2, rect.width);
    }
  };
}());