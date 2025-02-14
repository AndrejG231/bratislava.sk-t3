// @ts-strict-ignore
import SearchIcon from '@assets/images/search-icon.svg'
import SearchIconSmallBlack from '@assets/images/search-icon-small-black.svg'
import SearchIconSmallWhite from '@assets/images/search-icon-small-white.svg'
// import { useUIContext } from '@bratislava/common-frontend-ui-context'
import cx from 'classnames'
import { useState } from 'react'

import { Button } from '../Button/Button'

export interface BasicSearchOldProps {
  className?: string
  placeholder: string
  title: string
  buttonText: string
  collapse?: boolean
  onSubmit?: (value: string) => void
  initialValue?: string
}

export const BasicSearchOld = ({
  className,
  placeholder,
  title,
  buttonText,
  collapse,
  onSubmit,
  initialValue,
}: BasicSearchOldProps) => {
  // const { Link: UILink } = useUIContext()
  const [input, setInput] = useState(initialValue || '')
  return (
    <div className={cx('flex w-full max-w-[730px] flex-col', className)}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit?.(input)
        }}
      >
        <div className="text-large-respo pb-2 font-medium lg:pb-3">{title}</div>
        <div className={cx('lg:flex', { hidden: !collapse }, { flex: collapse })}>
          <input
            id="name"
            type="text"
            className="text-default h-12 w-full rounded-l-lg border-2 border-r-0 pl-6 text-font outline-none lg:h-14"
            placeholder={placeholder}
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
          <Button
            icon={<SearchIcon className="scale-75" />}
            hoverIcon={<SearchIcon className="scale-75" />}
            className="hover:color-white text-large h-14 rounded-l-none px-6 font-medium capitalize shadow-none hover:bg-category-600 hover:text-white"
            variant="secondary-dark-text"
            onClick={() => onSubmit(input)}
          >
            {buttonText}
          </Button>
        </div>
        <div
          className={cx('gap-y-4 lg:hidden', { 'flex flex-col': !collapse }, { hidden: collapse })}
        >
          <input
            id="name"
            type="text"
            className="text-default h-12 w-full rounded-lg border-2 pl-6 font-medium text-font outline-none lg:h-14"
            placeholder={placeholder}
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
          <Button
            icon={<SearchIconSmallBlack />}
            hoverIcon={<SearchIconSmallWhite />}
            className="hover:color-white text-default h-11 px-12 font-medium capitalize shadow-none hover:bg-category-600 hover:text-white lg:h-14"
            variant="secondary-dark-text"
            onClick={() => onSubmit(input)}
          >
            {buttonText}
          </Button>
        </div>
      </form>
    </div>
  )
}
