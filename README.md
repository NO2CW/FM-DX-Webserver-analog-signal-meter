# Analog Signal Meter Plugin for FM-DX Webserver

This plugin replaces the digital signal strength display with an analog meter visualization, giving your FM-DX Webserver a more classic radio receiver look and feel.

## Features

- Replaces the digital "SIGNAL" display with an analog meter visualization
- Dynamically updates the needle position based on real-time signal strength
- Responsive design that adjusts to different screen sizes
- Preserves all signal data for the webserver's internal functions

## Installation

1. Create the following folder structure in your FM-DX Webserver installation:
   ```
   plugins/
   └── signal-meter-plugin/
       ├── signal-meter-plugin.js
       └── README.md
   ```

2. Place `signal-meter-plugin.js` in both the `plugins` folder and the `plugins/signal-meter-plugin` folder.

3. Create or obtain a background meter image named `signal-meter-background.png` and place it in:
   ```
   web/images3/
   ```
   
   The image should have a transparent background and include a meter scale (typically 0-100).

## Activation

1. Go to the FM-DX Webserver admin panel
2. Navigate to the "Plugins" tab
3. Select "Analog meter" from the plugin list
4. Save your settings
5. Restart the webserver

## Customization

You can customize the appearance of the meter by:

1. Creating your own `signal-meter-background.png` image
2. Modifying the needle color and size in the `drawSignalMeter()` function

## Troubleshooting

If the meter doesn't appear:
- Check the browser console for error messages
- Verify that the image file is in the correct location (`web/images3/signal-meter-background.png`)
- Make sure the plugin is properly enabled in the admin panel

## Credits

- Created by Ivan NO2CW
- Based on the FM-DX Webserver by NoobishSVK
