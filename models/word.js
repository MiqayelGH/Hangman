import Model from "./model.js"

class Word extends Model {
    constructor(word,type,description) {
        super()
        this.word = word;
        this.type = type;
        this.description = description;    
    }

    //function for checking the equality of objects
    static isEqual(object1, object2) {
        const props1 = Object.getOwnPropertyNames(object1);
        const props2 = Object.getOwnPropertyNames(object2);
    
        if (props1.length !== props2.length) {
            return false;
        }
    
        for (let i = 0; i < props1.length; ++i) {
          const prop = props1[i];
    
          if (object1[prop] !== object2[prop]) {
            return false;
          }
        }
    
        return true;
      }

    // take a new word that does not coincide with the old one
    static async getWord(wordsIdArr) {
        const words = await Model.readFile('words.json');
        let randomNum = Math.round(Math.random() * (words.length - 1));

        if (wordsIdArr.length) {      
            for (let i = 0; i < words.length; i++) {
                if (wordsIdArr.includes(randomNum)) {
                    randomNum = Math.round(Math.random() * (words.length - 1));
                    continue;
                } 
            }

        return words[randomNum];
       }   
        
    return words[randomNum]; 
    }
    
    //returns a word that matches the specified id
    static async getWordById(word_id) {
        const words = await Model.readFile('words.json');
         
        const filteredWord = words.find((wordObj) => {return wordObj.id === Number(word_id)})
            
        return filteredWord;
    }
    
    //returns an array containing the previously guessed words 
    static async getGuessedWordsId(guessed) {  
       if (guessed == 'newPlayer') {
           return 'newPlayer'
        };
        
       let arr = [];
       if (guessed !== 'newPlayer') { 
            if (guessed.length == 1) {
                arr.push(Number(guessed));
                return arr
           }

            guessed = guessed.split(',');
            guessed.forEach(elem => arr.push(Number(elem)));
        }
        return arr;
     }
    
    static async openLetter(letter,word) {
        let flag = false;
        const trueLetters = {};
        const wrong = {};

        for(let i = 0; i < word.length; i++) {
            if (letter == word[i] && !trueLetters[letter]) {
               trueLetters[letter] = 1;
               flag = true;
            }          
        }
        
        if (!flag && !wrong[letter]) {
            wrong[letter] = 1;
        }

        return {trueLetters,wrong};
    }

    static async createWordObj(bool,letter,obj) {
        bool = Boolean(Number(bool));

        if (bool) {
            obj.trueLetters[letter] = 1;
        } else if(!bool) {
            obj.wrong[letter] = 1;
        }
        return obj;
    }

    static async addLetter(letter,object,word) {
        let flag = false;
        const trueLetters = object.trueLetters;
        const wrong = object.wrong;
    
            for(let i = 0; i < word.length ;i++) {
                if (letter == word[i] && !trueLetters[letter]) {
                   trueLetters[letter] = 1;
                      flag = true;
                } else if (trueLetters[letter]) {
                    flag = true;
                }
            }

            if (!flag && !wrong[letter]) {
                wrong[letter] = 1;
            }
           
        return {trueLetters,wrong};
    }
    static async endGame(word,enteredLetters,guessedArr) { 
        if (enteredLetters == 'newPlayer') {
            return false;
        } 
        
        const wrongValLen = Object.values(Object.values(enteredLetters)[1]).length;
        const trueValLen = Object.values(Object.values(enteredLetters)[0]).length;
        const words = await Model.readFile('words.json'); 
        const wordObj = {};
        let score = 0;
  
        for (let i = 0; i < word.length ; i++) {
            if (!wordObj[word[i]]) {
                wordObj[word[i]] = 1;
            }
        }
       
        if (guessedArr !== 'newPlayer') {
            for (let i = 0; i < guessedArr.length; i++) {
                  const filtered = words.find((elem) =>  elem.word === word );
                  score += (filtered['word'].length * 10) + 100;
            }
        }
       
        if (this.isEqual(Object.values(enteredLetters)[0],wordObj)) {
            
            if (guessedArr == 'newPlayer') {
                guessedArr = [];
            }

            const filtered = words.find((elem) =>  elem.word === word);
            score += (word.length * 10) + 100;
            guessedArr.push(filtered.id);

            return [score,true,guessedArr];
        }

        if (wrongValLen == 7) {
            score += (trueValLen * 10)
            return [score,false];
        }

       return false; 
    }

    static async checkInput(input) {
        if (!input) {
            return false;
        }

        if (input.replace(/[^a-z]/gi, ' ')!== input ){
            return false
        }

        return true;
    }
}

export default Word
