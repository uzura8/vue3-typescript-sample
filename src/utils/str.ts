const numFormat = function (num) {
  num = parseInt(num)
  if (isNaN(num)) return 0
  return String(num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
}

export function substr(text: string, len: number, truncation = ''): string {
  const textArray = text.split('')
  let count = 0
  let str = ''
  for (let i = 0, m = textArray.length; i < m; i++) {
    const n = escape(textArray[i])
    if (n.length < 4) {
      count++
    } else {
      count += 2
    }
    if (count > len) {
      return str + truncation
    }
    str += text.charAt(i)
  }
  return text
}

export function isNumeric(str: string) {
  if (typeof str != 'string') return false
  return !isNaN(Number(str)) && !isNaN(parseFloat(str))
}

export function trimSpaces(str: string): string {
  return str.replace(/(^\s+)|(\s+$)/g, '')
}

export function bytesFormat(num: number): string {
  let formatted
  let unit = 'B'
  let count = 0

  // num = parseInt(num)
  if (isNaN(num)) return `0 ${unit}`

  if (num < 1024) {
    formatted = numFormat(num)
    return `${formatted} ${unit}`
  } else if (num < 1024 ** 2) {
    count = 1
    unit = 'KB'
  } else if (num < 1024 ** 3) {
    count = 2
    unit = 'MB'
  } else if (num < 1024 ** 4) {
    count = 3
    unit = 'GB'
  } else {
    formatted = numFormat(num)
    return `${formatted} ${unit}`
  }

  formatted = num
  for (let i = 0; i < count; i++) {
    formatted = formatted / 1024
  }
  formatted = Math.floor(formatted * 100) / 100

  return `${formatted}${unit}`
}

export function checkEmail(text: string): boolean {
  // eslint-disable-next-line no-useless-escape
  const regexp =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return regexp.test(text)
}

export function checkUsername(text: string): boolean {
  const regexp = /^[0-9a-zA-Z_]{2,15}$/
  return regexp.test(text)
}
export function nl2br(str: string): string {
  if (str == null) return ''
  str = str.replace(/\r\n/g, '<br />')
  str = str.replace(/(\n|\r)/g, '<br />')
  return str
}

export function link2url(text: string, isTargetBlank = true, classStr = ''): string {
  const regexp = /(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g
  return text.replace(regexp, (url) => {
    const target = isTargetBlank ? ' target="_blank"' : ''
    return `<a href="${url}" class="${classStr}"${target}>${url}</a>`
  })
}

export function getOrdinalNumber(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'],
    v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

export function getLocaleOrdinalNumber(num: number, locale = 'en'): string {
  if (locale === 'ja') return `第${num}`
  return getOrdinalNumber(num)
}

export function randStr(length: number): string {
  let result = ''
  const characters = 'abcdefghijklmnopqrstuvwxyz'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
