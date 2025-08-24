//=============================================================================
// SaveListDrawTimestamp.js
// ----------------------------------------------------------------------------
// (C) 2019 astral
// This software is released under the MIT License.
// https://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2019/03/31 初版
/*:
 * 
 * @plugindesc セーブ一覧画面へ、セーブした日時を表示します
 * @author astral
 * 
 * 
 * @param timeFormat
 * @text 表示形式
 * @desc 表示形式をデータベースの用語設定と同じように、%1等で設定出来ます。%1：年 %2：月 %3：日 %4：時 %5：分 %6：秒 
 * @type string
 * @default %1/%2/%3 %4:%5:%6
 * 
 * @param shiftX
 * @text X方向位置調整
 * @desc 現在の表示位置を、指定したx方向へ加算・減算して表示します。
 * @type number
 * @min -99999999
 * @default 0
 * 
 * @param shiftY
 * @text Y方向位置調整
 * @desc 現在の表示位置を、指定したy方向へ加算・減算して表示します。
 * @type number
 * @min -99999999
 * @default 0
 * 
 * @help
 * 
 * セーブ一覧画面へ、セーブした日時を表示します。
 * 
 * 
 * プラグインパラメーター
 * 
 * 表示形式
 *  
 *  表示形式をデータベースの用語設定と同じように、%1等で設定出来ます。
 *  %1：年　%2：月　%3：日　%4：時　%5：分　%6：秒
 * 
 * 表示位置調整
 * 
 *  デフォルトでは、プレイ時間の上に表示されるようになっています。
 *  位置調整で指定したX/Y方向へ、デフォルトの表示位置調整して表示します。
 *  x方向に-50を指定すると、左へ50ピクセル移動された状態になります。
 *  
 * 
 * 既存のセーブデータも利用可能です。
 * 
 * MIT License.
 * 
 */


(function () {
    'use strict';

    var param = (function (parameters){
        var $ = JSON.parse(JSON.stringify(parameters, function(key, value) {
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        }));
        function toNumber(val) {return Number(val);}
        return {
            timeFormat:$.timeFormat || '%1/%2/%3 %4:%5:%6',
            shiftX:toNumber($.shiftX) || 0,
            shiftY:toNumber($.shiftY) || 0,
        };
        
    })(PluginManager.parameters('SaveListDrawTimestamp'));

    var _Window_SavefileList_drawContents = Window_SavefileList.prototype.drawContents;
    Window_SavefileList.prototype.drawContents = function(info, rect, valid) {
        _Window_SavefileList_drawContents.apply(this, arguments);
        var lineHeight = this.lineHeight();
        var x = rect.x + param.shiftX;
        var y = rect.y  + lineHeight + param.shiftY;
        this.drawTimeStamp(info, x, y, rect.width);
    };

    Window_SavefileList.prototype.drawTimeStamp = function(info, x, y, width) {
        if (info.timestamp > 0) {
            function timePad(str) {
                str = '' + str;
                return str.length === 1 ? '0' + str : str;
            };
            var time = new Date(info.timestamp);
            var drawTime = param.timeFormat.format(
                time.getFullYear(),
                timePad(time.getMonth() + 1),
                timePad(time.getDate()),
                timePad(time.getHours()),
                timePad(time.getMinutes()),
                timePad(time.getSeconds())
                );
            this.drawText(drawTime, x, y, width, 'right');
        }
    };

})();
