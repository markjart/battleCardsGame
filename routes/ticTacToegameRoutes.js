var ticTacToeGameController = require("../controllers/ticTacToegame");

module.exports = function(app) {
  app.get("/ticTacToegame", ticTacToeGameController.renderTicTacToeGame);
  app.post("/ticTacToegame", ticTacToeGameController.renderTicTacToeGame);

};