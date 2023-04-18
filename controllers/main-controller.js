import Word from "../models/word.js";
import Score from "../models/score.js";

async function homePage(req, res) {
  const scores = await Score.getAll();

  return res.render("home.ejs", {
    layout: "./layouts/main-layout.ejs",
    scores: scores,
  });
}
async function sendLetter(req, res) {
  const body = req.body;

  function renderGame (wordData, mistakes, progress, score, enteredLetters, guessedWordsIds) {
    let alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

    return res.render("game.ejs", {
      layout: "./layouts/game-layout.ejs",
      alphabet: alphabet,
      word: wordData.word,
      type: wordData.type,
      description: wordData.description,
      wordId: wordData.id,
      mistakes: mistakes,
      progress: progress,
      score: score,
      enteredLetters: enteredLetters,
      guessedWordsIds: guessedWordsIds,
    })
  }

  const guessedWordsIds = body.guessedWordsIds;

  if  (typeof body.stage !== 'undefined') {
    if  (body.stage === 'new') {
      const currentWordData = await Word.getWord([]);
      return renderGame(currentWordData, 0, true, 0, [] , "");

    } else if (body.stage === 'continue') {
      let guessedWordsIds = [];

      if (body.guessedWordsIds.length > 1) {
        guessedWordsIds = body.guessedWordsIds.split(',')   
      } else if (body.guessedWordsIds.length == 1) {
        guessedWordsIds = [body.guessedWordsIds]
      }

      guessedWordsIds.push(body.wordId) 
      const newWordData = await Word.getWord(guessedWordsIds)

      return renderGame (newWordData, 0, true, body.score, [], guessedWordsIds)
    } else if (body.stage === 'end') {
      const score = body.score; 
      const guessedWords = await Word.getGuessedWordsById(guessedWordsIds);
      await Score.addScore(score, guessedWords)
      const scores = await Score.getAll();

      return res.render("home.ejs", {
        layout: "./layouts/main-layout.ejs",
        scores: scores,
      });
    }
  }

  let score = Number(body.score)
  let mistakes = body.mistakes ? Number(body.mistakes) : 0;
  const guessedWords = await Word.getGuessedWordsById(guessedWordsIds);
  const wordId = body.wordId;
  const wordData = await Word.getWordById(wordId);
  const currentWord = wordData.word;
  const letter = body.letter 
  let enteredLetters = body.enteredLetters.split(",");

  if (enteredLetters[0] === '') {
    enteredLetters.shift()
  }
  enteredLetters.push(letter)

  const checkLttr = await Word.checkLetter(letter, currentWord)
  
  if (!checkLttr) {
    mistakes++;

    if (mistakes >= 7) {
        await Score.addScore(score)
        return renderGame (wordData, mistakes, false, score, enteredLetters, guessedWordsIds)
    } 
  } else {
        score += 10;
  }

  if (await Word.checkWord (wordData.word, enteredLetters)) {
    score += currentWord.length / 2 * 100
    return renderGame (wordData, mistakes, false, score, enteredLetters, guessedWordsIds)
  }

  renderGame (wordData, mistakes, true, score, enteredLetters, guessedWordsIds)
}

export default {
  sendLetter,
  homePage,
};
