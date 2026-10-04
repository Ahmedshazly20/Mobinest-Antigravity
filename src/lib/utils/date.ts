/**
 * Utility functions for Arabic date formatting
 */

export function formatDate(dateString: string | Date | null | undefined): string {
  if (!dateString) return '-'
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  } catch (error) {
    return '-'
  }
}

export function formatDateTime(dateString: string | Date | null | undefined): string {
  if (!dateString) return '-'
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  } catch (error) {
    return '-'
  }
}

export function formatTime(dateString: string | Date | null | undefined): string {
  if (!dateString) return '-'
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString
    return new Intl.DateTimeFormat('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  } catch (error) {
    return '-'
  }
}
