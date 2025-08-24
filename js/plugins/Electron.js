//=============================================================================
// Electron.js
//=============================================================================

/*:ja
 * @plugindesc Electronでのゲーム起動をサポートします。
 * @author RaTTiE
 *
 * @help このプラグインには、プラグインコマンドはありません。
 */

(function() {
// ----------------------------------------------------------------------------
// Utilsのラップ
// ----------------------------------------------------------------------------
/**
 * Checks whether the platform is Node.js.
 *
 * @static
 * @method isNodejs
 * @return {Boolean} True if the platform is Node.js
 */
Utils.isNodejs = function() {
    return typeof require === 'function' && typeof process === 'object';
};

/**
 * Checks whether the platform is NW.js.
 *
 * @static
 * @method isNwjs
 * @return {Boolean} True if the platform is NW.js
 */
Utils.isNwjs = function() {
    if (!Utils.isNodejs()) return false;

    try {
        var gui = require('nw.gui');

        return true;
    } catch (e) {
        return false;
    }
};

/**
 * Checks whether the platform is Electron.
 *
 * @static
 * @method isElectron
 * @return {Boolean} True if the platform is Electron
 */
Utils.isElectron = function() {
    if (!Utils.isNodejs()) return false;

        try {
            var electron = require('electron');

            return true;
        } catch (e) {
            return false;
        }
};

/**
 * @static
 * @method _defaultStretchMode
 * @private
 */
Graphics._defaultStretchMode = function() {
    return Utils.isNodejs() || Utils.isMobileDevice();
};

StorageManager.isLocalMode = function() {
    return Utils.isNodejs();
}

// ----------------------------------------------------------------------------
// Inputのラップ
// ----------------------------------------------------------------------------
var orgInput_initialize = Input.initialize;
var orgInput__wrapNwjsAlert = Input._wrapNwjsAlert;
var Input__wrapElectronAlert = function() {
    if (Utils.isElectron()) {
        var _alert = window.alert;
        window.alert = function() {
            _alert.apply(this, arguments);
            require('electron').ipcRenderer.send('focusMainWindow');
            Input.clear();
        };
    }
};

/**
 * Initializes the input system.
 *
 * @static
 * @method initialize
 */
Input.initialize = function() {
    orgInput_initialize.call(this);

    this._wrapNodejsAlert();
};

/**
 * @static
 * @method _wrapNwjsAlert
 * @private
 */
Input._wrapNwjsAlert = function() { };

/**
 * @static
 * @method _wrapNodejsAlert
 * @private
 */
Input._wrapNodejsAlert = function() {
    if (Utils.isNwjs()) {
        orgInput__wrapNwjsAlert.call(this);
    } else if (Utils.isElectron()) {
        Input__wrapElectronAlert.call(this);
    }
};

// ----------------------------------------------------------------------------
// SceneManagerのラップ
// ----------------------------------------------------------------------------
var orgSceneManager_initialize = SceneManager.initialize;
var orgSceneManager_initNwjs = SceneManager.initNwjs;
var SceneManager_initElectron = function() { };

SceneManager.initialize = function() {
    orgSceneManager_initialize.call(this);

    this.initNodejs();
}

SceneManager.initNwjs = function() { };

SceneManager.initNodejs = function() {
    if (Utils.isNwjs()) {
        orgSceneManager_initNwjs.call(this);
    } else if (Utils.isElectron()) {
        SceneManager_initElectron.call(this);
    }
};

SceneManager.onKeyDown = function(event) {
    if (!event.ctrlKey && !event.altKey) {
        switch (event.keyCode) {
        case 116:   // F5
            if (Utils.isNodejs()) {
                location.reload();
            }
            break;
        case 119:   // F8
            if (Utils.isOptionValid('test')) {
                if (Utils.isNwjs()) {
                    require('nw.gui').Window.get().showDevTools();
                } else if (Utils.isElectron()) {
                    require('electron').ipcRenderer.send('openDevTools');
                }
            }
            break;
        }
    }
};
})();