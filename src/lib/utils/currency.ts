/**
 * Formats a number to Egyptian Pound (EGP) currency string in Arabic format.
 * Example: 1250 -> 1,250 ج.م
 */
export function formatCurrency(amount: number | null | undefined, showDecimals: boolean = false): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0 ج.م'
  }

  const formattedNumber = new Intl.NumberFormat('ar-EG', {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount)

  return `${formattedNumber} ج.م`
}

/**
 * Formats standard numeric string without currency symbol.
 */
export function formatNumber(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0'
  }

  return new Intl.NumberFormat('ar-EG').format(amount)
}
