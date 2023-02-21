import SelectedIcon from '@assets/images/forms/selected.svg'
import cx from 'classnames'
import { useTranslation } from 'next-i18next'

interface StepperViewRowProps {
  title?: string
  order: number
  isCurrent?: boolean
  isFilled?: boolean
  isLast?: boolean
  onClick?: () => void
  className?: string
}

const StepperViewRow = (props: StepperViewRowProps) => {
  const { title, order, isCurrent, isFilled, isLast, onClick, className } = props
  const { t } = useTranslation('forms')
  const iconClassName = cx(
    'min-w-8 w-8 flex-row h-8 rounded-full flex justify-center items-center border-2 shrink-0',
    {
      'bg-gray-700 border-gray-700 text-white': isFilled || isCurrent,
      'border-gray-300 text-gray-300 bg-transparent': !isFilled && !isCurrent,
    },
  )

  return (
    <div className={cx('flex flex-col select-none', className)}>
      <div
        className="flex flex-row gap-3 items-center cursor-pointer"
        onClick={() => {
          if (onClick) onClick()
        }}
      >
        <div className={iconClassName}>
          {isCurrent || !isFilled ? order : <SelectedIcon className="scale-125" />}
        </div>
        <p className="text-p3-medium">{title}</p>
      </div>
      {!isLast && (
        <div className="w-8 h-8 flex flex-row justify-center items-center">
          <div className="w-0.5 h-4 bg-gray-300 py-2" />
        </div>
      )}
    </div>
  )
}

export default StepperViewRow
