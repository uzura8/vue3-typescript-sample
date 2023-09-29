export function buttonClass(type = 'default', size = 'base', isReturnString = true) {
  let classes: string[] = []
  const sizes = ['focus:outline-none', 'focus:ring-4', 'font-medium', 'rounded-lg']
  let addSizes: string[] = []

  switch (type) {
    case 'danger':
      classes = [
        'text-white',
        'bg-danger-700',
        'hover:bg-danger-800',
        'focus:ring-danger-300',
        'dark:bg-danger-600',
        'dark:hover:bg-danger-700',
        'dark:focus:ring-danger-900'
      ]
      break

    case 'ghost':
      classes = ['bg-gray-700', 'bg-opacity-0', 'hover:bg-opacity-5']
      break

    case 'light':
      classes = [
        'text-gray-500',
        'bg-white',
        'border',
        'border-gray-200',
        'hover:bg-gray-100',
        'hover:text-primary-700',
        'focus:ring-gray-200',
        'focus:z-10',
        'dark:bg-gray-800',
        'dark:text-gray-400',
        'dark:border-gray-600',
        'dark:hover:text-white',
        'dark:hover:bg-gray-700',
        'dark:hover:border-gray-600',
        'dark:focus:ring-gray-700'
      ]
      break

    case 'default':
    default:
      classes = [
        'text-gray-900',
        'bg-white',
        'border',
        'border-gray-300',
        'hover:bg-gray-100',
        'focus:ring-gray-200',
        'dark:bg-gray-800',
        'dark:text-white',
        'dark:border-gray-600',
        'dark:hover:bg-gray-700',
        'dark:hover:border-gray-600',
        'dark:focus:ring-gray-700'
      ]
      break
  }
  switch (size) {
    case 'xs':
      addSizes = ['text-xs', 'px-3', 'py-2']
      break
    case 'sm':
      addSizes = ['text-sm', 'px-3', 'py-2']
      break
    case 'lg':
      addSizes = ['text-base', 'px-5', 'py-3']
      break
    case 'xl':
      addSizes = ['text-base', 'px-6', 'py-3.5']
      break
    case 'base':
    case 'md':
    default:
      addSizes = ['text-sm', 'px-5', 'py-2.5']
      break
  }
  sizes.push(...addSizes)
  classes.push(...sizes)
  return isReturnString ? classes.join(' ') : classes
}
