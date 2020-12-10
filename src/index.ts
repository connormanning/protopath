import path from 'path'
import { getProtocol, stripProtocol, protocolSeparator } from './util'

export * from './util'

// Utility function to split apart the protocol prefix from the path.
function protosplit(p: string): [string, string] {
  const protocol = getProtocol(p)
  const prefix = protocol ? protocol + protocolSeparator : ''
  return [prefix, stripProtocol(p)]
}

// This file consists of protocol-aware versions of a subset of Node's 'path'
// utils.  Those functions which we add no special protocol-aware handling are
// simply re-exported.
export const {
  delimiter,
  posix,
  sep,
  win32,
  basename,
  extname,
  relative,
  toNamespacedPath,
} = path

/**
 * Returns the directory name of a path.  Similar to the Unix dirname command.
 * If a protocol is present, it will be retained in the output.
 *
 * @param p — the path to evaluate.
 */
export function dirname(p: string) {
  const [prefix, filename] = protosplit(p)
  return prefix + path.dirname(filename)
}

/**
 * A passthrough to path.format, with the addition that a "protocol" option, if
 * present, will be prepended to the output as the resulting protocol.  See
 * https://nodejs.org/api/path.html#path_path_format_pathobject.
 */
export type FormatInputPathObject = path.FormatInputPathObject & {
  protocol?: string
}
export function format({ protocol, ...options }: FormatInputPathObject) {
  const prefix = protocol ? protocol + protocolSeparator : ''
  return prefix + path.format(options)
}

/**
 * A passthrough to path.isAbsolute, with the caveat that paths containing a
 * protocol which is not "file" (i.e. does not start with "file://") will always
 * return true.  For example a path beginning with "s3://" is always considered
 * to be an absolute path.  See
 * https://nodejs.org/api/path.html#path_path_isabsolute_path.
 */
export function isAbsolute(p: string) {
  const protocol = getProtocol(p)
  if (protocol && protocol !== 'file') return true
  return path.isAbsolute(stripProtocol(p))
}

/**
 * A passthrough to path.join, with the caveat that the protocol of the first
 * argument, if one exists, is retained in the output.  See
 * https://nodejs.org/api/path.html#path_path_join_paths.
 */
export function join(...args: string[]) {
  if (args.length === 0) return path.join()
  const [first, ...rest] = args
  const [prefix, filename] = protosplit(first)
  return prefix + path.join(filename, ...rest)
}

/**
 * A passthrough to path.normalize, with the caveat that any protocol existing
 * on the input is retained in the output.  See
 * https://nodejs.org/api/path.html#path_path_normalize_path.
 */
export function normalize(p: string) {
  const [prefix, filename] = protosplit(p)
  return prefix + path.normalize(filename)
}

/**
 * A passthrough to path.parse, with the addition of an output key "protocol"
 * containing the protocol string if it exists, or else undefined.  See
 * https://nodejs.org/api/path.html#path_path_parse_path.
 */
export type ParsedPath = path.ParsedPath & { protocol?: string }
export function parse(p: string): ParsedPath {
  const result: ParsedPath = path.parse(stripProtocol(p))
  const protocol = getProtocol(p)
  if (protocol) result.protocol = protocol
  return result
}
