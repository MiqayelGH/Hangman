import Word from "../models/word.js"

async function sendLetter(req,res) {
    const body = req.body;
    const guessedWords = await Word.getGuessedWordsId(body.guessed_words_ids);
    const word_id = body.word_id
    const wordObj = await Word.getWordById(word_id);
    const input = body.letter_input;
    let enteredLetters = req.body.enteredLetters
   
    if (enteredLetters !== 'newPlayer' && !enteredLetters) {
        enteredLetters = {trueLetters:{},wrong:{}}

        for(let key in body) {
            if(key !== "letter_input" && key !== "word_id" && key !== "guessed_words_ids" && key !== 'enteredLetters') {
                await Word.createWordObj(key.split(' ')[0], body[key],enteredLetters)   
            }               
        }

        await Word.addLetter(input,enteredLetters,wordObj.word);  
    }

     if (!await Word.checkInput(input)) {
            return  res.render('game.ejs', {
                layout: "./layouts/game-layout.ejs",
                word: wordObj['word'],
                type: wordObj.type,
                description: wordObj.description,
                enteredLetters: enteredLetters,
                wordId: wordObj.id,
                guessed_words_ids: guessedWords,
            })
    }

    if (enteredLetters == 'newPlayer' ) {
        enteredLetters = await Word.openLetter(input, wordObj.word);
    }

    const gameStage = await Word.endGame(wordObj['word'],enteredLetters,guessedWords)
   
    if (gameStage) {   
        if (gameStage[1]) {
            return res.render('next_game.ejs', {
                        layout: "./layouts/main-layout.ejs",
                        score: gameStage[0],
                        wordId: word_id,
                        guessed_words_ids: gameStage[2]

            })
        }

        return res.render('game_over.ejs', {
                    layout: "./layouts/main-layout.ejs",
                    wordId: word_id,
                    score: gameStage[0]
                })
    }

   return res.render('game.ejs', {
                layout: "./layouts/game-layout.ejs",
                word: wordObj['word'],
                type: wordObj.type,
                description: wordObj.description,
                enteredLetters: enteredLetters,
                wordId: wordObj.id,
                guessed_words_ids: guessedWords,
          })
 }
 
 async function continueGame(req,res) {
    const wordObj = await Word.getWord(req.body.guessed_words_ids);
 
     return res.render('game.ejs', {
                layout: "./layouts/game-layout.ejs",
                wordId: wordObj.id,
                word: wordObj.word,
                type: wordObj.type,
                description: wordObj.description,
                enteredLetters: 'newPlayer',
                guessed_words_ids: req.body.guessed_words_ids,
            })
 
  }

export default {
    sendLetter,continueGame   
 }