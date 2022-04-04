import LessonList from "./lessonList";
import NavigationBar from "./navigationBar";
import PageContent from "./pageContent";
import Page from "./page";
import Lobby from "./lobby";
import MediaPopup from "./mediaPopup";

export default function defineCustomElements() {
  customElements.define('lesson-list', LessonList);
  customElements.define('navigation-bar', NavigationBar);
  customElements.define('page-content', PageContent);
  customElements.define('page-element', Page);
  customElements.define('lobby-element', Lobby);
  customElements.define('media-popup', MediaPopup);
}