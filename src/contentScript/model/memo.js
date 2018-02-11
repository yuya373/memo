export default class Memo {
  constructor({
    x, y, text, createdAt, updatedAt,
  }) {
    this.x = x;
    this.y = y;
    this.text = text || "";
    this.createdAt = createdAt || (new Date()).getTime();
    this.updatedAt = updatedAt || null;
  }

  update({ x, y, text }) {
    let isUpdated = false;

    if ((typeof text) === "string") {
      this.text = text;
      isUpdated = true;
    }
    if (x >= 0) {
      this.x = x;
      isUpdated = true;
    }
    if (y >= 0) {
      this.y = y;
      isUpdated = true;
    }
    if (isUpdated) {
      this.updatedAt = (new Date()).getTime();
    }
  }
}
