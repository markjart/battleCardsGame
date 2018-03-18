var snakeGameController = require("../controllers/snakegame");

module.exports = function(app) {
  app.get("/snakegame", snakeGameController.renderSnakeGame);
  app.post("/snakegame", snakeGameController.renderSnakeGame);

};