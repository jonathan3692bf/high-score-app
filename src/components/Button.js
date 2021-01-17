
import { Button } from 'primereact/button'

export default function CustomButton ({
  disabled = false,
  loading = false,
  className = '',
  ...props
}) {
  const loadingIndicator = {}
  let classNames = className
  if (disabled || loading) {
    classNames += ' p-button-secondary'
  }
  if (loading) {
    loadingIndicator.icon = 'pi pi-spin pi-spinner'
    loadingIndicator.label = ''
    // loadingIndicator.style = Object.assign({}, style, { borderRadius: '2rem' })
  }

  return <Button
      {...props}
      {...loadingIndicator}
      disabled={disabled || loading}
      className={classNames}
    />
}
