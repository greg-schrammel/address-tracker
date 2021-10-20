const twoFractionDigits = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const formats = [
  { value: 1e15, symbol: 'Q' },
  { value: 1e12, symbol: 'T' },
  { value: 1e9, symbol: 'B' },
  { value: 1e6, symbol: 'M' },
  { value: 1e3, symbol: 'k' },
  { value: 0, symbol: '' },
]

export function formatBigNumber(number) {
  if (!number) return 0
  const format = formats.find((f) => Math.abs(number) >= f.value)
  return twoFractionDigits.format(number / (format?.value || 1)) + format?.symbol
}

const makeCurrencyFormat = (language, currency) =>
  new Intl.NumberFormat(language, {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

export function formatCurrency(number, currency = 'USD', language = 'en-US') {
  if (!number) return 0
  const format = formats.find((f) => Math.abs(number) >= f.value)
  return (
    makeCurrencyFormat(language, currency).format(number / (format?.value || 1)) + format?.symbol
  )
  // TODO: it will bug on languages where the currency sign goes after the number (20$K should be 20K$),
  // only matter when we start supporting new currencies
}

export const formatChange = (currentValue, lastValue) => {
  const changePercent = formatBigNumber(((currentValue - lastValue) / lastValue) * 100)
  const signal = changePercent > 0 ? '+' : '' // no need to add a '-' signal
  const changeString = `${signal}${changePercent}%`
  return [changeString, changePercent]
}

// export const formatChange = (currentValue, changePercentage) => {
//   if (!changePercentage || !currentValue) return undefined
//   const signal = changePercentage > 0 ? '+' : '' // no need to add a '-' signal
//   const lastValue = (currentValue * 100) / (changePercentage + 100)
//   const changeString = `${signal}${formatBigNumber(changePercentage)}% (${formatCurrency(
//     currentValue - lastValue,
//   )})`
//   return changeString
// }
