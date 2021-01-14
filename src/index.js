require("dotenv").config();

const { app, BrowserWindow, Menu, Tray } = require("electron");
const path = require("path");
const isProduction =
    !process.env.APP_ENV || process.env.APP_ENV == "production";
let mainWindow = null;
let quiting = false;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
    // eslint-disable-line global-require
    app.quit();
}

const createWindow = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        show: false,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            devTools: !isProduction,
        },
    });

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, "index.html"));

    mainWindow.on("close", (event) => {
        if (!quiting) {
            mainWindow.hide();
            event.preventDefault();
        }
    });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    tray = new Tray(__dirname + "/images/tray.png");
    const contextMenu = Menu.buildFromTemplate([
        {
            label: "Show window",
            click: (menuItem, window, e) => {
                if (mainWindow) {
                    mainWindow.show();
                }
            },
        },
        {
            type: "separator",
        },
        {
            label: "Quit",
            click: (menuItem, window, e) => {
                quiting = true;
                app.quit();
            },
        },
    ]);
    tray.setToolTip("Online Time Tracking");
    tray.setContextMenu(contextMenu);
    createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    // if (process.platform !== "darwin") {
    app.quit();
    // }
});

app.on("activate", () => {
    if (mainWindow) {
        mainWindow.show();
    }
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
