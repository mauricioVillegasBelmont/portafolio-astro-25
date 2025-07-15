export class StringUtils {
  static cleanString(string) {
    string = string.replace(/\s+/g, " ").trim();
    string = string.replace(/[\t\r\n\0\v]/g, "");
    string = string.replace(/<\/?[^>]+(>|$)/g, "");
    string = string
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

    return string;
  }
  static splitParragraps(text ) {
    return text.split(/\r?\n/);
  }
  static randHash(qtd = 5) {
    const caracteres =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const quantidadeCaracteres = caracteres.length;
    let hash = "";

    for (let x = 0; x < qtd; x++) {
      const posicao = Math.floor(Math.random() * quantidadeCaracteres);
      hash += caracteres.charAt(posicao);
    }

    return hash;
  }
  static autoUid(prefix = "id", size = 5) {
    return `${prefix}-${this.randHash(size)}__${new Date()
      .getTime()
      .toString(36)}--${this.getRandomIntegerInclusive()}`;
  }
  static getRandomIntegerInclusive(min = 1, max = 1000) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
/**
 * Returns a number whose value is limited to the given range.
 *
 * @param {Number} val The initial value
 * @param {Number} min The lower boundary
 * @param {Number} max The upper boundary
 * @returns {Number} A number in the range (min, max)
 */
export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);