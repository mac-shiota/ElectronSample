// const { app, BrowserWindow } = require('electron')
const { app, BrowserWindow, ipcMain, dialog } = require('electron');

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'えれくとろんさんぷる',
    webPreferences: {
      // レンダラープロセスが Node.js の機能を利用できるようにします（デフォルトは false）
      nodeIntegration: true,
      // メインプロセスとレンダラープロセスの JavaScript コンテキストを分離します（デフォルトは true）
      contextIsolation: false,
    },
  })

  ipcMain.handle('open-dialog', async (_e, _arg) => {
    return dialog
      // ファイル選択ダイアログを表示する
      .showOpenDialog(mainWindow, {
        properties: ['openFile'],
      })
      .then((result) => {
        // キャンセルボタンが押されたとき
        if (result.canceled) return '';

        // 選択されたファイルの絶対パスを返す
        return result.filePaths[0];
      });
  });

  mainWindow.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
});


// 開いたウインドウがない場合にウインドウを開く (macOS)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// 全ウインドウを閉じた時にアプリを終了する (Windows & Linux)
app.on('window-all-closed', () => {
  // macos でなければ
  if (process.platform !== 'darwin') {
    app.quit();
  }
});