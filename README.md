# FBRef.com Visualizer

Use a radar chart to visualize FBRef.com data.

## Installation

This extension is not available in the Chrome web store and must be installed manually.
Installation can be done in two ways:

### Using Developer Mode

1. Unzip `FBRefVisualizer.zip` into a directory.
2. Open <chrome://extensions/> and enable developer mode.
3. Click _Load unpacked_ and point Chrome to the directory that you unzipped in step 1.

### Using CRX File on Windows
1. Run `whitelist.reg` or manually add the extension ID `mieebnfllicbcopenddppodkdojbmghj` to `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Google\Chrome\ExtensionInstallWhitelist`.
2. Navigate to <chrome://extensions/> and drag the .crx file onto the Chrome window to install.
3. Completely restart Chrome by right clicking in the icon in the system tray and selecting _Exit_.

## Usage

1. Navigate to [fbref.com][1] and go to a player's page. [Harry Kane][2].
2. If a player has a scouting report available, the extension icon will go from grey to color.
3. Click the icon to view the radar chart.
4. The radar chart can be downloaded as a PNG image by clicking the download button at the bottom left.

## Building

### Prerequisites

* [Yarn][3]

### Build

1. Install dependant packages by navigating to the root directory and running `yarn`.
2. To build a production version run `yarn build` to to build a production version into `./dist/`.
3. To build a development version and watch for changes run `yarn start` to build into `./build/`.

[1]: https://fbref.com/
[2]: https://fbref.com/en/players/21a66f6a/Harry-Kane
[3]: https://yarnpkg.com/
