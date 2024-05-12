/**
 * Get deep value from object
 *
 * @param {Object} obj  Object
 * @param {string} path path to object ket
 * @return {string} Value of object key
 */
export default function getDeep(obj, path) {
	return path.split('.').reduce((a, v) => a[v], obj);
}
