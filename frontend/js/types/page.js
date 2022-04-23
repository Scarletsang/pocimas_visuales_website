/**
 * Typed object that describes the structure of the data needed by the corresponding structure of page.
 * @namespace PageTypes
 */

/**
 * Data needed by the page structure: home
 * @typedef  {object} PageTypes.HomePage
 * @property {string} startText
 * @property {BasicTypes.NodeId} startId
 * @property {BasicTypes.URL} coverImage
 */

/**
 * Data needed by the page structure: resource. see {@link ResourceData}
 * @typedef {Array<PageTypes.ResourceData>} PageTypes.ResourcePage
 */

/**
 * Data describing a resouce element in the resouce page.
 * @typedef {MediaTypes.VimeoData | MediaTypes.IframeData | MediaTypes.StaticMediaData} PageTypes.ResourceData
 * @property {BasicTypes.URL} [thumbnail] An option to include a thumbnail for the resource element to show up front.
 */

/**
 * Data needed by the page structure: choice. See {@link ChoiceData}
 * @typedef {Array<PageTypes.ChoiceData>} PageTypes.ChoicePage
 */

/**
 * Data describing a choice element on the choice page.
 * @typedef {object} PageTypes.ChoiceData
 * @property {BasicTypes.NodeId} id
 * @property {BasicTypes.HTMLContent} front
 * @property {BasicTypes.HTMLContent} [back]
 */

/**
 * Data needed by the page structure: cinema
 * @typedef {Array<MediaTypes.VimeoData | MediaTypes.IframeData | MediaTypes.StaticMediaData>} PageTypes.CinemaPage
 */

 exports.unused = {};