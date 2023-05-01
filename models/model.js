import fs from "fs/promises";
import path from "path";

class Model {
  static async readFile(fileName) {
    const modelsBuffer = await fs.readFile(path.join(path.resolve(), `/dbs/${fileName}`));
    const modelsJson = modelsBuffer.toString();

    if (!modelsJson) {
      return [];
    }

    return JSON.parse(modelsJson);
  }
}

export default Model;
