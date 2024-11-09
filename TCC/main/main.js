const { app, BrowserWindow, ipcMain} = require('electron');
const ExcelJS = require('exceljs');  // Use 'exceljs' para manter formatação
const path = require('node');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 800,
    icon: path.join(__dirname + '../assets/images/logo_censipam.png'),
    fullscreen: true,
    webPreferences: {
            nodeIntegration: true, // para habilitar a integração do Node.js
            contextIsolation: false
        }
  });
  win.loadFile('src/renderer/templates/index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Função para inserir dados na planilha mantendo a formatação
ipcMain.on('enviar-dados', async (event, dadosFormulario) => {
  console.log('Dados recebidos:', dadosFormulario);

  // Caminho do arquivo Excel existente
  const filePath = path.join(__dirname, 'dados.xlsx');
  
  try {
      // Ler o arquivo Excel existente com formatação preservada
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(filePath);

      // Selecionar a primeira aba da planilha
      const worksheet = workbook.worksheets[0];

      // Localizar a próxima linha disponível na planilha
      const rowCount = worksheet.rowCount;
      const newRow = worksheet.getRow(rowCount + 1);

      // Preencher a nova linha com os dados do formulário
      Object.keys(dadosFormulario).forEach((key, index) => {
          const cell = newRow.getCell(index + 1); // As células são indexadas a partir de 1
          cell.value = dadosFormulario[key]; // Definir o valor da célula

          // Se a célula anterior tiver formatação, aplique-a à nova célula
          const previousCell = worksheet.getRow(rowCount).getCell(index + 1);  // Pega a célula da linha anterior
          if (previousCell.style) {
              cell.style = previousCell.style;  // Mantém a formatação
          }
      });

      // Salvar as alterações no arquivo Excel
      await workbook.xlsx.writeFile(filePath);

      // Enviar uma resposta de sucesso para o frontend
      event.reply('resposta', 'Dados salvos com sucesso na planilha!');
  } catch (error) {
      console.error('Erro ao salvar os dados na planilha:', error.message);
      event.reply('resposta', 'Erro ao salvar os dados: ' + error.message);
  }
});