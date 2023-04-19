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
  function renderGame (wordData, mistakes, progress, score, enteredLetters, guessedWordsIds, enteredRight) {
    let alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
    console.log(wordData, mistakes, progress, score, enteredLetters, guessedWordsIds, enteredRight , 'poxancvox tvyalner')
    return res.render("game.ejs", {
      layout: "./layouts/game-layout.ejs",
      alphabet: alphabet,
      wordLength: wordData.word.length,
      type: wordData.type,
      description: wordData.description,
      wordId: wordData.id,
      mistakes: mistakes,
      progress: progress,
      score: score,
      enteredLetters: enteredLetters,
      guessedWordsIds: guessedWordsIds,
      enteredRight: enteredRight || []
    })
  }

  const body = req.body;
  console.log(req.body)


  const guessedWordsIds = body.guessedWordsIds;
  if  (typeof body.stage !== 'undefined') {
    if  (body.stage === 'new') {
      const wordData = await Word.getWord([]);

      const enteredRight = [];
      for (let i = 0; i < wordData.word.length ; ++i) {
        enteredRight.push('_')
      }

      return renderGame(wordData, 0, true, 0, [] , "", enteredRight);

    } else if (body.stage === 'continue') {
      let guessedWordsIds = [];

      if (body.guessedWordsIds.length > 1) {
        guessedWordsIds = body.guessedWordsIds.split(',')   
      } else if (body.guessedWordsIds.length == 1) {
        guessedWordsIds = [body.guessedWordsIds]
      }

      guessedWordsIds.push(body.wordId) 
      const newWord = await Word.getWord(guessedWordsIds)
      const enteredRight = [];
      
      for (let i = 0; i < newWord.word.length ; ++i) {
        enteredRight.push('_')
      }

      return renderGame (newWord, 0, true, body.score, [], guessedWordsIds, enteredRight)
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

  const enteredRight = await Word.getFoundedPart(wordData.word, enteredLetters)
  console.log(enteredRight)

  const checkLttr = await Word.checkLetter(letter, currentWord)
  
  if (!checkLttr) {
    mistakes++;

    if (mistakes >= 7) {
        await Score.addScore(score)
        return renderGame (wordData, mistakes, false, score, enteredLetters, guessedWordsIds, enteredRight)
    } 
  } else {
        score += 10;
  }

  console.log(enteredLetters, wordData.word)
  if (await Word.checkWord (wordData.word, enteredLetters)) {
    score += currentWord.length / 2 * 100
    return renderGame (wordData, mistakes, false, score, enteredLetters, guessedWordsIds, enteredRight)
  }

  
  // console.log(enteredLetters)
  renderGame (wordData, mistakes, true, score, enteredLetters, guessedWordsIds, enteredRight)
}

export default {
  sendLetter,
  homePage,
};
