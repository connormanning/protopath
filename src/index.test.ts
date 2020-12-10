import * as P from '.'

test('get procotol', () => {
  expect(P.getProtocol('s3://')).toEqual('s3')
  expect(P.getProtocol('s3://a')).toEqual('s3')
  expect(P.getProtocol('s3://a/b')).toEqual('s3')
  expect(P.getProtocol('s3://a/b/')).toEqual('s3')
  expect(P.getProtocol('s3://a/://b')).toEqual('s3')
  expect(P.getProtocol('file://a')).toEqual('file')

  expect(P.getProtocol('a.txt')).toBeUndefined()
  expect(P.getProtocol('/')).toBeUndefined()
  expect(P.getProtocol('/dir')).toBeUndefined()
})

test('strip protocol', () => {
  expect(P.stripProtocol('s3://bucket')).toEqual('bucket')
  expect(P.stripProtocol('s3://bucket/object')).toEqual('bucket/object')
  expect(P.stripProtocol('s3://a/b/c.txt')).toEqual('a/b/c.txt')

  expect(P.stripProtocol('asdf')).toEqual('asdf')
  expect(P.stripProtocol('/asdf')).toEqual('/asdf')
  expect(P.stripProtocol('./asdf')).toEqual('./asdf')
  expect(P.stripProtocol('asdf.txt')).toEqual('asdf.txt')
  expect(P.stripProtocol('/asdf.txt')).toEqual('/asdf.txt')
  expect(P.stripProtocol('./asdf.txt')).toEqual('./asdf.txt')
})

test('pop slash', () => {
  expect(P.popSlash('')).toEqual('')
  expect(P.popSlash('/')).toEqual('')
  expect(P.popSlash('a')).toEqual('a')
  expect(P.popSlash('/a')).toEqual('/a')
  expect(P.popSlash('a/')).toEqual('a')
  expect(P.popSlash('/a/')).toEqual('/a')
})

test('get stem', () => {
  // Directories.
  expect(P.getStem('asdf')).toEqual('asdf')
  expect(P.getStem('/asdf')).toEqual('asdf')
  expect(P.getStem('/asdf/')).toEqual('asdf')

  // Files.
  expect(P.getStem('/asdf.json')).toEqual('asdf')
  expect(P.getStem('s3://something/asdf.json')).toEqual('asdf')
  expect(P.getStem('s3://something/as.df.json')).toEqual('as.df')
  expect(P.getStem('s3://something/as df.json')).toEqual('as df')
})

test('basename', () => {
  expect(P.basename('a/b')).toEqual('b')
  expect(P.basename('a/b/')).toEqual('b')
  expect(P.basename('a/b/c.txt')).toEqual('c.txt')

  expect(P.basename('s3://a/b')).toEqual('b')
  expect(P.basename('s3://a/b/')).toEqual('b')
  expect(P.basename('s3://a/b/c.txt')).toEqual('c.txt')
})

test('dirname', () => {
  expect(P.dirname('a')).toEqual('.')
  expect(P.dirname('a.txt')).toEqual('.')
  expect(P.dirname('a/b')).toEqual('a')
  expect(P.dirname('a/b/')).toEqual('a')
  expect(P.dirname('/a/b/')).toEqual('/a')

  expect(P.dirname('s3://a')).toEqual('s3://.')
  expect(P.dirname('s3://a.txt')).toEqual('s3://.')
  expect(P.dirname('s3://a/b')).toEqual('s3://a')
  expect(P.dirname('s3://a/b/')).toEqual('s3://a')
})

test('extname', () => {
  expect(P.extname('a')).toEqual('')
  expect(P.extname('a.txt')).toEqual('.txt')
  expect(P.extname('s3://a')).toEqual('')
  expect(P.extname('s3://a.txt')).toEqual('.txt')
})

test('isAbsolute', () => {
  expect(P.isAbsolute('.')).toEqual(false)
  expect(P.isAbsolute('a')).toEqual(false)
  expect(P.isAbsolute('a/b')).toEqual(false)
  expect(P.isAbsolute('a/b/c.txt')).toEqual(false)
  expect(P.isAbsolute('/')).toEqual(true)
  expect(P.isAbsolute('/a')).toEqual(true)
  expect(P.isAbsolute('/a/b')).toEqual(true)
  expect(P.isAbsolute('/a/b/c.txt')).toEqual(true)

  expect(P.isAbsolute('file://.')).toEqual(false)
  expect(P.isAbsolute('file://a')).toEqual(false)
  expect(P.isAbsolute('file://a/b')).toEqual(false)
  expect(P.isAbsolute('file://a/b/c.txt')).toEqual(false)
  expect(P.isAbsolute('file:///')).toEqual(true)
  expect(P.isAbsolute('file:///a')).toEqual(true)
  expect(P.isAbsolute('file:///a/b')).toEqual(true)
  expect(P.isAbsolute('file:///a/b/c.txt')).toEqual(true)

  expect(P.isAbsolute('s3://a')).toEqual(true)
  expect(P.isAbsolute('s3://a/b')).toEqual(true)
  expect(P.isAbsolute('s3://a/b/c.txt')).toEqual(true)
})

test('join', () => {
  expect(P.join()).toEqual('.')
  expect(P.join('a', 'b', 'c')).toEqual('a/b/c')
  expect(P.join('/a', 'b', 'c')).toEqual('/a/b/c')
  expect(P.join('s3://a', 'b', 'c')).toEqual('s3://a/b/c')
  expect(P.join('s3://a/b/..')).toEqual('s3://a')
})

test('normalize', () => {
  expect(P.normalize('a')).toEqual('a')
  expect(P.normalize('a/b')).toEqual('a/b')
  expect(P.normalize('a/..')).toEqual('.')
  expect(P.normalize('a/b/..')).toEqual('a')
  expect(P.normalize('..')).toEqual('..')

  expect(P.normalize('s3://a')).toEqual('s3://a')
  expect(P.normalize('s3://a/b')).toEqual('s3://a/b')
  expect(P.normalize('s3://a/..')).toEqual('s3://.')
  expect(P.normalize('s3://a/b/..')).toEqual('s3://a')
  expect(P.normalize('s3://..')).toEqual('s3://..')
})

test('format', () => {
  expect(P.format({ dir: 'a/b', base: 'c.txt' })).toEqual('a/b/c.txt')
  expect(P.format({ protocol: 's3', dir: 'a/b', base: 'c.txt' })).toEqual(
    's3://a/b/c.txt'
  )
})

test('parse', () => {
  const parsed = {
    dir: 'a/b',
    base: 'c.txt',
    ext: '.txt',
    name: 'c',
    root: '',
  }
  expect(P.parse('a/b/c.txt')).toEqual(parsed)
  expect(P.parse('s3://a/b/c.txt')).toEqual({ ...parsed, protocol: 's3' })
})
