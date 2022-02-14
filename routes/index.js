var express = require('express');
var router = express.Router();
var wordList = require('../public/wordlists/wordList.json');
var solutionList = require('../public/wordlists/solutionList.json');
var _ = require('lodash');

let games = [];

router.get('/wordList', function(req, res, next) {
  res.send(wordList);
});

router.get('/solutionList', function(req, res, next) {
  res.send(solutionList);
});

router.post('/newWord/:gameKey', function(req, res, next) {
  let word = solutionList[_.random(solutionList.length)]
  let game = games.find(g => g.key === req.params.gameKey);

  if (game === undefined){
    game = {key: req.params.gameKey}
    games = [...games, game]
  }

  game.word = word;
  console.log(JSON.stringify(games));
  res.sendStatus(200);
});

router.post('/guess/:gameKey/:guess', function(req, res, next) {
  let guess = req.params.guess;
  if (!wordList.includes(guess)){
    res.sendStatus(403);
  }
  let game = games.find(g => g.key === req.params.gameKey);
  if (!game || guess.length !== 5 || !guess){
    res.sendStatus(403);
  }
  let solution=game.word;

  let response = req.params.guess.split('').map((l, i) => {
    if (solution[i] === l){
      return 'correct'
    }
    else if (solution.includes(l)){
      return 'contains letter'
    }
    else return 'does not contain letter'
  })

  res.send(response);
});

module.exports = router;
