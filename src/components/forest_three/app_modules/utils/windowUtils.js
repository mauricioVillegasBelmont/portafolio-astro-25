export class WindowUtils {
  static get aspectRatio() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    return width / height;
  }
  static get getWidth() {
    const width = window.innerWidth;
    return width;
  }
  static get getHeight() {
    const height = window.innerHeight;
    return height;
  }
}
