import cx from 'classnames'

export interface ITabBarTab {
  key: string
  title: string
}

interface TabBarTabProps {
  tab: ITabBarTab
  className?: string
  onClick?: () => void
  isActive?: boolean
  handleSelect?: (arg0: string) => void
  size?: 'small' | 'normal'
}

// TODO to be removed with ArticlesFilter
export const TabBarTab = ({
  className,
  tab,
  onClick,
  isActive,
  size = 'normal',
  handleSelect,
}: TabBarTabProps) => {
  return (
    <button
      type="button"
      className={cx(className, 'relative whitespace-nowrap py-2 lg:whitespace-normal', {
        'font-normal text-font': !isActive,
        'font-semibold': isActive,
        'text-h4': size === 'normal',
        'text-default': size === 'small',
      })}
      onClick={handleSelect ? () => handleSelect(tab.title) : onClick}
    >
      {tab.title}
      {isActive && (
        <div className="absolute bottom-0 left-1/2 w-10/12 -translate-x-1/2 border-b-2 border-category-600" />
      )}
    </button>
  )
}

export default TabBarTab
