import Word from "../models/word.js"
import Score from "../models/score.js"
 
async function homePage(req,res) {
    const scores = await Score.getAll();
    
        return res.render('home_page.ejs', {
                   layout:"./layouts/main-layout.ejs",
                   scores: scores
               });
 }

async function startGame(req,res) {
   const wordObj = await Word.getWord([]);

    return res.render('game.ejs', {
                layout: "./layouts/game-layout.ejs",
                word: wordObj['word'],
                type: wordObj.type,
                description: wordObj.description,
                enteredLetters: 'newPlayer',
                wordId: wordObj.id,
                guessed_words_ids: 'newPlayer',
            })

 }
 
async function endGame(req,res) {
        await Score.enterNew(req.body.score)
        const scores = await Score.getAll();

        res.render('home_page.ejs', {
            layout:"./layouts/main-layout.ejs",
            scores: scores
        });
}

export default {
    homePage,startGame,endGame
 }