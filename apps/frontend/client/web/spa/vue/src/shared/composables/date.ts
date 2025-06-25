import { computed, isRef, type Ref } from 'vue'
import { format } from 'date-fns'

export function useFormattedDate(
  date: Ref<Date | string | number> | Date | string | number,
  formatString = 'eee d LLLL HH:mm'
) {
  return computed(() => {
    const dateValue = isRef(date) ? date.value : date
    try {
      return format(dateValue, formatString)
    } catch (error) {
      return 'Invalid date'
    }
  })
}

/**
 * Проверяет, находится ли указанная дата в пределах последних N дней от текущего момента.
 * @param date Дата, которую нужно проверить
 * @param days Количество дней в прошлом, в пределах которых дата считается актуальной
 * @returns true, если дата находится в пределах последних N дней, иначе false
 */
export function isDateWithinPastDays(date: Date, days: number): boolean {
  const now = new Date()
  const msInDay = 24 * 60 * 60 * 1000
  const periodInMs = days * msInDay
  const diffMs = now.getTime() - date.getTime()

  return diffMs >= 0 && diffMs <= periodInMs
}

export function useMessageFormattedDate(date: Date) {
  return computed(() => {
    if (isDateWithinPastDays(date, 1)) {
      return useFormattedDate(date, 'HH:mm')
    } else if (isDateWithinPastDays(date, 7)) {
      return useFormattedDate(date, 'eee')
    } else {
      return useFormattedDate(date, 'd LLLL')
    }
  })
}
