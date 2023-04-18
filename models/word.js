import Model from "./model.js";

class Word extends Model {
  constructor(word, type, description) {
    super();
    this.word = word;
    this.type = type;
    this.description = description;
  }

static async checkLetter(letter, word) {
    const filteredWord = word.split("");
    const includes = filteredWord.includes(letter)
    return includes;
 }

 static async checkWord(word, enteredLetters) {
    const wordData = Array.from(new Set(word.split('')));

    for (let i = 0; i < wordData.length; i++) {
        if (!enteredLetters.includes(wordData[i])) {
          return false;
        }
      }
      return true;

 }

  //Checking the equality of objects
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

  // Take a new word that does not coincide with the old one
  static async getWord(wordsIdArr) {
    const words = await Model.readFile("words.json");
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

  //Returns a word that matches the specified id
  static async getWordById(wordId) {
    const words = await Model.readFile("words.json");
    if(typeof wordId === 'string') {
        wordId = Number(wordId)
    }
    const filteredWord = words.find((word) => {
      return word.id === Number(wordId);
    });

    return filteredWord;
  }

  //returns an array containing the previously guessed words
  static async getGuessedWordsById(wordsId) {
    if (wordsId[0] === '' &&  wordsId.length === 1) {
        return;
    }

   let guessedWords = [];
   if (wordsId.length > 1) {
    wordsId = wordsId.split(',')
   }

   for (let i = 0; i < wordsId.length; ++i) {
    guessedWords.push((await this.getWordById(wordsId[i])).word)
   }

   return guessedWords 
  }
}

export default Word;
