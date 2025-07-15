export class WindowUtils {
  static get aspectRatio(): number {
    const width = window.innerWidth;
    const height = window.innerHeight;
    return width / height;
  }
  static get getWidth(): number {
    const width = window.innerWidth;
    return width;
  }
  static get getHeight(): number {
    const height = window.innerHeight;
    return height;
  }
}
