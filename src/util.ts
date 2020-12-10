import path from 'path'
export const protocolSeparator = '://'

/**
 * Returns the protocol string of the path, defined here as the substring prior
 * to the first appearance of the sequence '://'.  If this sequence is not
 * present in the path, then returns undefined.
 *
 * @param p the path to evaluate.
 */
export function getProtocol(p: string): string | undefined {
  const index = p.indexOf(protocolSeparator)
  if (index !== -1) return p.slice(0, index)
}

/**
 * Returns the portion of the path after the first occurence of the sequence
 * '://', if this sequence exists.  If this sequence is not present in the path,
 * then the path is returned unchanged.
 *
 * @param p the path to evaluate.
 */
export function stripProtocol(p: string): string {
  const protocol = getProtocol(p)
  if (!protocol) return p
  return p.slice(protocol.length + protocolSeparator.length)
}

/**
 * If the path ends with a trailing '/' character, then the substring prior to
 * this character is returned.  Otherwise the path is returned unchanged.
 *
 * @param p the path to evaluate.
 */
export function popSlash(p: string): string {
  return p.endsWith('/') ? p.slice(0, -1) : p
}

/**
 * Returns the "stem" of the path, which is the filename without the extension
 * for file paths, or the deepest subdirectory in the path for directory paths.
 *
 * @param p the path to evaluate.
 */
export function getStem(p: string): string {
  return path.parse(p).name
}
