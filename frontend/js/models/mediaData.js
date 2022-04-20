export default class MediaData {
  constructor(jsonObj) {
    const media = Object.entries(jsonObj);
    this.media = new Map(media);
  }

  static JSONFields = {
    type: "type",
    title: "title",
    vimeoId: "id",
    url: "url",
    iframeAllow: "iframeAllow"
  }

  get(data) {
    switch (data.constructor.name) {
      case "Array":
        if (data[0].constructor.name != "String") return false;
        return data.map(mediaId => this.media.get(mediaId));
      case "String":
        return this.media.get(data);
      default:
        return false;
    }
  }
}