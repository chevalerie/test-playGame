//=============================================================================
// HzMapInput.js
//=============================================================================

/*:ja
 * @plugindesc マップ上でのキー入力を一時的に無効化します
 * @author hiz
 *
 *  @help 
 *  
 * プラグイン コマンド:
 *   HzMapInput 0                  # マップ上でのキー入力を一時的に無効化
 *   HzMapInput 1                  # マップ上でのキー入力を一時的に有効化
 */
/*:en
 * @plugindesc Disable key input on map temporary.
 * @author hiz
 *
 *  @help 
 *  
 * プラグイン コマンド:
 *   HzMapInput 0                  # Disable key input.
 *   HzMapInput 1                  # Enable key input.
 */

(function() {
    
    function convertEscape(txt) {return Window_Base.prototype.convertEscapeCharacters(txt)};
    
    var _Game_Interpreter_pluginCommand =
            Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command.toUpperCase() === 'HZMAPINPUT') {
            var enabled = Number(convertEscape(args[0]));
            if(enabled === 1)HzMapInput.enable();
            else HzMapInput.disable();
        }
    };
    
    function HzMapInput() {};
    
    HzMapInput._enabled = true;
    
    HzMapInput.enable = function() {
        HzMapInput._enabled = true;
    };
    
    HzMapInput.disable = function() {
        HzMapInput._enabled = false;
    };
    
    HzMapInput.isEnabled = function() {
        return HzMapInput._enabled;
    };
    
    var _Game_System_isMenuEnabled = Game_System.prototype.isMenuEnabled;
    Game_System.prototype.isMenuEnabled = function() {
        return HzMapInput.isEnabled() && _Game_System_isMenuEnabled.call(this);
    };
    
    var _Game_Player_moveByInput = Game_Player.prototype.moveByInput;
    Game_Player.prototype.moveByInput = function() {
        if(!HzMapInput.isEnabled()) return;
        _Game_Player_moveByInput.call(this);
    };
    
    var _Game_Player_triggerButtonAction = Game_Player.prototype.triggerButtonAction;
    Game_Player.prototype.triggerButtonAction = function() {
        if(!HzMapInput.isEnabled()) return;
        _Game_Player_triggerButtonAction.call(this);
    };
})();
