//=============================================================================
// CaptureAndDisplayImage.js
//=============================================================================
/*:
 * @plugindesc 画面をキャプチャして画像を表示するプラグインです。
 * @version 9.4.0
 * 
 * @param FadeInFrames
 * @text フェードイン時間（フレーム）
 * @desc ゲーム画面のフェードインにかかるフレーム数を指定します。
 * @default 60
 * 
 * @param FadeOutFrames
 * @text フェードアウト時間（フレーム）
 * @desc ゲーム画面のフェードアウトにかかるフレーム数を指定します。
 * @default 60
 * 
 * @param ApplyFadeToScene
 * @text フェード適用シーン
 * @desc フェードイン・アウトを適用するシーンを指定します。カンマ区切りで複数のシーン名を指定可能です。
 * @default Scene_Map
 * 
 * @param SwitchID
 * @text フェードスイッチID
 * @desc フェードイン・アウトを制御するスイッチのIDを指定します。
 * @default 0
 * 
 * @help このプラグインを使用すると、ゲーム画面をキャプチャして
 * それを画像として表示することができます。
 * 
 * プラグインコマンド:
 *   CaptureImage        # 画面をキャプチャします。
 *   DisplayCapturedImage      # キャプチャした画像を表示します。
 *   RemoveDisplayedImage     # 表示した画像を削除します。
 *   SetImageOpacity 0 60      # 表示した画像の不透明度を60フレームかけて0に設定します。
 *   SetImageOpacity 255 30    # 表示した画像の不透明度を30フレームかけて255に設定します。
 * 
 */

(function() {
    var parameters = PluginManager.parameters('CaptureAndDisplayImage');
    var fadeInFrames = parseInt(parameters['FadeInFrames']) || 60;
    var fadeOutFrames = parseInt(parameters['FadeOutFrames']) || 60;
    var applyFadeToScene = (parameters['ApplyFadeToScene'] || 'Scene_Map').split(',');
    var switchID = parseInt(parameters['SwitchID']) || 0;

    // Utils.snapShot の定義
    Utils.snapShot = function() {
        var canvas = SceneManager.snap()._canvas;
        return canvas.toDataURL('image/png').split(',')[1];
    };

    var capturedImageData = null; // キャプチャした画像データを保持する変数
    var isImageDisplayed = false; // キャプチャした画像が表示されているかどうかのフラグ

    // プラグインコマンドの定義
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'CaptureImage') {
            captureImage();
        } else if (command === 'DisplayCapturedImage') {
            displayCapturedImage();
        } else if (command === 'RemoveDisplayedImage') {
            removeDisplayedImage();
        } else if (command === 'SetImageOpacity') {
            setImageOpacity(args[0], args[1]);
        }
    };

    // 画面をキャプチャする関数
    function captureImage() {
        var scene = SceneManager._scene;
        var messageWindow = scene._messageWindow;
        if (messageWindow) {
            messageWindow.hide();
        }
        capturedImageData = Utils.snapShot();
        if (messageWindow) {
            messageWindow.show();
        }
    }

    // キャプチャした画像を表示する関数
    function displayCapturedImage() {
        if (capturedImageData) {
            var image = new Image();
            image.src = "data:image/png;base64," + capturedImageData;
            image.onload = function() {
                // ゲーム画面内に画像を表示する
                var bitmap = new Bitmap(image.width, image.height);
                bitmap.context.drawImage(image, 0, 0);
                var sprite = new Sprite(bitmap);
                sprite.x = (Graphics.width - sprite.width) / 2;
                sprite.y = (Graphics.height - sprite.height) / 2;
                sprite.name = 'capturedImageSprite'; // スプライトに名前を付ける
                SceneManager._scene.addChildAt(sprite, SceneManager._scene.children.indexOf(SceneManager._scene._windowLayer));
                isImageDisplayed = true; // 画像が表示されているフラグを設定
            };
        } else {
            console.error("No captured image found.");
        }
    }

    // 表示した画像を削除する関数
    function removeDisplayedImage() {
        var scene = SceneManager._scene;
        var sprites = scene.children.filter(function(child) {
            return child instanceof Sprite && child.name === 'capturedImageSprite';
        });
        sprites.forEach(function(sprite) {
            scene.removeChild(sprite);
        });
        isImageDisplayed = false; // 画像が表示されていないフラグを設定
    }

    // 表示した画像の不透明度を設定する関数
    function setImageOpacity(opacity, frames) {
        var scene = SceneManager._scene;
        var sprites = scene.children.filter(function(child) {
            return child instanceof Sprite && child.name === 'capturedImageSprite';
        });
        sprites.forEach(function(sprite) {
            var targetOpacity = parseInt(opacity);
            var currentOpacity = sprite.opacity;
            var changePerFrame = (targetOpacity - currentOpacity) / parseInt(frames);
            var frameCount = 0;
            var opacityInterval = setInterval(function() {
                frameCount++;
                sprite.opacity += changePerFrame;
                if (frameCount >= parseInt(frames)) {
                    sprite.opacity = targetOpacity;
                    clearInterval(opacityInterval);
                }
            }, 16.6667); // 1秒間に60回（16.6667ミリ秒ごと）実行する
        });
    }

    // Scene_Map内でキャプチャした画像を表示する処理
    var _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        _Scene_Map_start.call(this);
        if (isImageDisplayed) {
            displayCapturedImage(); // キャプチャした画像を再表示する
        }
        if (applyFadeToScene.includes('Scene_Map') && $gameSwitches.value(switchID)) {
            this.startFadeIn(fadeInFrames, false); // フェードインを開始
        }
    };

    // シーン遷移時のフェードアウト処理の追加
    var _SceneManager_goto = SceneManager.goto;
    SceneManager.goto = function(sceneClass) {
        if (applyFadeToScene.includes(sceneClass.name) && SceneManager._scene instanceof Scene_Map && sceneClass !== Scene_Map && $gameSwitches.value(switchID)) {
            SceneManager._scene.startFadeOut(fadeOutFrames, false); // フェードアウトを開始
        }
        _SceneManager_goto.apply(this, arguments);
    };

})();
