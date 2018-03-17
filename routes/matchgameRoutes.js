var matchGameController = require("../controllers/matchgame");

module.exports = function(app) {
  app.get("/matchgame", matchGameController.renderMatchGame);
  app.post("/matchgame", matchGameController.renderMatchGame);

};