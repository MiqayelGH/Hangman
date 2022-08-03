import fs from "fs/promises"
import path from "path";
import Model from "./model.js"

class Score extends Model{
    constructor(score) {
        super(); 
        this.score = score;
    }
    
    static async getAll() {
        const scores = await Model.readFile('scores.json')

        return scores;
    }

    static async enterNew(score) {
        score = Number(score);
        const scores = await Model.readFile('scores.json')
        
       if(scores.find((elem) => elem.score === score)){
           return;
       }

       if (!score) {
            return;
       }
       
        const id = scores[scores.length - 1].id + 1
        scores.push({id: id,score: score});

        await fs.writeFile(path.join(path.resolve(),"./dbs/scores.json"),JSON.stringify(scores))
    }
}
export default Score