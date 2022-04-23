/**
 * Typed Object that represent the supported media data.
 * @namespace MediaTypes
*/

/**
 * Data describing a vimeo video.
 * @typedef {object} MediaTypes.VimeoData
 * @property {"vimeo"} type
 * @property {string} title
 * @property {Number} id
 */

/**
 * Data describing an iframe
 * @typedef {object} MediaTypes.IframeData
 * @property {"iframe"} type
 * @property {string} title
 * @property {BasicTypes.URL} url
 * @property {string} [iframeAllow]
 */

/**
 * Data describing a static media file: an image or a pdf
 * @typedef {object} MediaTypes.StaticMediaData
 * @property {"image" | "pdf"} type
 * @property {string} title
 * @property {BasicTypes.URL} url
 */

 exports.unused = {};