// Christer McFunkypants Kaitila's Gamepad Keyboard Emulator

// upgraded for game-specific functionality for Wheel of Misfortune

// what this handy file does is "fake" keyboard events
// if the player tries using a gamepad, so your existing
// keyboard controler code will still work, unchanged!

window.joystick = new GamepadSupport();

function GamepadSupport()
{
    const TWIN_STICK_AIMING = true; // fake mouse positions w gamepad?
    const TWIN_STICK_FIRING = true; // if you aim, you fire: simpler controls no buttons reqd

    var gamepad = null;
    var gamepad_left = false;
    var gamepad_right = false;
    var gamepad_up = false;
    var gamepad_down = false;
    var gamepad_b = false;
    var gamepad_a = false;
    var gamepad_x = false;
    var gamepad_y = false;
    var prev_gamepad_left = false;
    var prev_gamepad_right = false;
    var prev_gamepad_up = false;
    var prev_gamepad_down = false;
    var prev_gamepad_fire = false;
    var prev_gamepad_jump = false;
    var prev_gamepad_x = false;
    var prev_gamepad_y = false;
    
    const KEY_LEFT_ARROW = 37;
    const KEY_UP_ARROW = 38;
    const KEY_RIGHT_ARROW = 39;
    const KEY_DOWN_ARROW = 40;
    const KEY_NUMPAD_0 = 96;
    const KEY_NUMPAD_9 = 105;
    const KEY_NUMPAD_PLUS = 107;
    const KEY_NUMPAD_MINUS = 109;
    const KEY_NUMPAD_PERIOD = 110;
    const KEY_BACKSPACE = 8
    const KEY_ENTER = 13;
    const KEY_ESCAPE = 27;
    const KEY_SPACE = 32; // attack
    const KEY_0 = 48;
    const KEY_9 = 57;
    const KEY_PLUS = 187;
    const KEY_MINUS = 189;
    const KEY_PERIOD = 190;
    const KEY_TILDE = 192; // console
    const KEY_W = 87;
    const KEY_A = 65;
    const KEY_S = 83;
    const KEY_D = 68;
    const KEY_Q = 81;
    const KEY_E = 69;
    const KEY_TAB = 9;
    const KEY_Z = 90; // could be an alternate attack button
    const KEY_X = 88;
    const KEY_M = 77;
    const KEY_P = 80; // pause

    // GAME SPECIFIC CONTROLS! FAKE KEYBOARD EVENTS GENERATED:
    var SIMULATED_KEY_UP = KEY_W;
    var SIMULATED_KEY_DOWN = KEY_S;
    var SIMULATED_KEY_LEFT = KEY_A;
    var SIMULATED_KEY_RIGHT = KEY_D;
    var SIMULATED_KEY_B_BUTTON = KEY_SPACE;
    var SIMULATED_KEY_A_BUTTON = KEY_SPACE;
    var SIMULATED_KEY_X_BUTTON = KEY_SPACE;
    var SIMULATED_KEY_Y_BUTTON = KEY_SPACE;

    // twin stick shooter style aiming mode?
    var aim_angle = 0; // right thumbstick to look around twin stick shooter style
    
    window.addEventListener("gamepadconnected", function(e) {
    // Gamepad connected
    console.log("Gamepad connected", e.gamepad);
    });

    window.addEventListener("gamepaddisconnected", function(e) {
    // Gamepad disconnected
    console.log("Gamepad disconnected", e.gamepad);
    });

    function applyDeadzone(number, threshold)
    {
        var percentage = (Math.abs(number) - threshold) / (1 - threshold);
        if(percentage < 0){
            percentage = 0;
        }
        return percentage * (number > 0 ? 1 : -1);
    }

    function handle_gamepad()
    {
        if (!gamepad) // always null until you press a button!
        {
            //console.log("Init gamepad..."); // spammy
            if (!navigator.getGamepads)
            {
                console.log("Gamepad NOT supported on this browser!");
                return; // not supported?
            }
        }
        // poll every frame
        gamepad = navigator.getGamepads()[0];
        if (gamepad)
        {
            //console.log("Gamepad detected: " + gamepad.axes[0] + "," + gamepad.axes[1]);
            var joystickX = applyDeadzone(gamepad.axes[0], 0.25);
            gamepad_right = (joystickX > 0);
            gamepad_left = (joystickX < 0);
            var joystickY = applyDeadzone(gamepad.axes[1], 0.25);
            gamepad_down = (joystickY > 0);
            gamepad_up = (joystickY < 0);
            var butt = applyDeadzone(gamepad.buttons[0].value, 0.25);
            //gamepad_up = gamepad_up || (butt>0); // jump using up
            gamepad_a = (butt>0);
            butt = applyDeadzone(gamepad.buttons[1].value, 0.25);
            gamepad_b = (butt>0);
            butt = applyDeadzone(gamepad.buttons[2].value, 0.25);
            gamepad_x = (butt>0);
            butt = applyDeadzone(gamepad.buttons[3].value, 0.25);
            gamepad_y = (butt>0);
            //console.log("Gamepad buttons: A:" + gamepad.buttons[0].value + " B:" + + gamepad.buttons[1].value + " X:" + + gamepad.buttons[2].value + " Y:" + + gamepad.buttons[3].value);

            if (TWIN_STICK_AIMING)
            {
                /*
                // analog: aim exactly using the right thumbstick
                aim_angle = Math.atan2(gamepad.axes[3], gamepad.axes[2]);
                if (aim_angle!=0) console.log("aim_angle="+aim_angle);
                // "fake" mouse coordinates injected for game engine use in Player.js
                mouseX = Player.x + Math.cos(aim_angle) * 10;
                mouseY = Player.y + Math.sin(aim_angle) * 10;
                */

                // only if being used
                if (gamepad.axes[2] > 0.1 || gamepad.axes[2] < -0.1 || gamepad.axes[3] > 0.1 || gamepad.axes[3] < -0.1)
                {
                    // simpler version of the above
                    mouseX = player.x + gamepad.axes[2] * 10;
                    mouseY = player.y + gamepad.axes[3] * 10;

                    //console.log('We are aiming using the right thumbstick: '+mouseX+','+mouseY);
                    
                    if (TWIN_STICK_FIRING) // force fire mode if we are aiming w right thumb
                    {
                        gamepad_a = true;
                    }
                }
            }
            
        }
        else
        {
            //console.log("No gamepad detected! YET..."); // spammy before button press
        }

        // compare previous state and send fake keyboard events
        fake_keyboard_events();

        window.requestAnimationFrame(handle_gamepad);
    }

    function fake_keyboard_events() // if any
    {
        // compare previous state
        if (!prev_gamepad_left && gamepad_left) simulateKeyDown(SIMULATED_KEY_LEFT);
        if (!prev_gamepad_right && gamepad_right) simulateKeyDown(SIMULATED_KEY_RIGHT);
        if (!prev_gamepad_up && gamepad_up) simulateKeyDown(SIMULATED_KEY_UP);
        if (!prev_gamepad_down && gamepad_down) simulateKeyDown(SIMULATED_KEY_DOWN);
        if (!prev_gamepad_fire && gamepad_b) simulateKeyDown(SIMULATED_KEY_B_BUTTON);
        if (!prev_gamepad_jump && gamepad_a) simulateKeyDown(SIMULATED_KEY_A_BUTTON);
        if (!prev_gamepad_x && gamepad_x) simulateKeyDown(SIMULATED_KEY_X_BUTTON);
        if (!prev_gamepad_y && gamepad_y) simulateKeyDown(SIMULATED_KEY_Y_BUTTON);
        // only sends events if state has changed
        if (prev_gamepad_left && !gamepad_left) simulateKeyUp(SIMULATED_KEY_LEFT);
        if (prev_gamepad_right && !gamepad_right) simulateKeyUp(SIMULATED_KEY_RIGHT);
        if (prev_gamepad_up && !gamepad_up) simulateKeyUp(SIMULATED_KEY_UP);
        if (prev_gamepad_down && !gamepad_down) simulateKeyUp(SIMULATED_KEY_DOWN);
        if (prev_gamepad_fire && !gamepad_b) simulateKeyUp(SIMULATED_KEY_B_BUTTON);
        if (prev_gamepad_jump && !gamepad_a) simulateKeyUp(SIMULATED_KEY_A_BUTTON);
        if (prev_gamepad_x && !gamepad_x) simulateKeyUp(SIMULATED_KEY_X_BUTTON);
        if (prev_gamepad_y && !gamepad_y) simulateKeyUp(SIMULATED_KEY_Y_BUTTON);
        // now remember current state
        prev_gamepad_left = gamepad_left;
        prev_gamepad_right = gamepad_right;
        prev_gamepad_up = gamepad_up;
        prev_gamepad_down = gamepad_down;
        prev_gamepad_fire = gamepad_b;
        prev_gamepad_jump = gamepad_a;
        prev_gamepad_x = gamepad_x;
        prev_gamepad_y = gamepad_y;
    }
    
    function simulateKeyDown(thisKey) 
    {
        //console.log('fake keydown: ' + thisKey)
        var oEvent = document.createEvent('KeyboardEvent');
        Object.defineProperty(oEvent, 'keyCode', { get : function() { return this.keyCodeVal; } });     
        Object.defineProperty(oEvent, 'which', { get : function() { return this.keyCodeVal; } });     
        if (oEvent.initKeyboardEvent) {
            oEvent.initKeyboardEvent("keydown", true, true, document.defaultView, false, false, false, false, thisKey, thisKey);
        } else {
            oEvent.initKeyEvent("keydown", true, true, document.defaultView, false, false, false, false, thisKey, 0);
        }
        oEvent.keyCodeVal = thisKey;
        document.dispatchEvent(oEvent);
    }
    
    function simulateKeyUp(thisKey) 
    {
        //console.log('fake keyup: ' + thisKey)
        var oEvent = document.createEvent('KeyboardEvent');
        Object.defineProperty(oEvent, 'keyCode', { get : function() { return this.keyCodeVal; } });     
        Object.defineProperty(oEvent, 'which', { get : function() { return this.keyCodeVal; } });     
        if (oEvent.initKeyboardEvent) {
            oEvent.initKeyboardEvent("keyup", true, true, document.defaultView, false, false, false, false, thisKey, thisKey);
        } else {
            oEvent.initKeyEvent("keyup", true, true, document.defaultView, false, false, false, false, thisKey, 0);
        }
        oEvent.keyCodeVal = thisKey;
        document.dispatchEvent(oEvent);
    }

    // init
    //console.log('Initializing gamepad support...')
    window.requestAnimationFrame(handle_gamepad);

} // GamepadKeyboardEventEmulator