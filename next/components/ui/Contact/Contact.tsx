import Email from '@assets/images/email2.svg'
import Phone from '@assets/images/phone.svg'
import Markdown from '@components/atoms/Markdown'
import Button from '@components/forms/simple-components/Button'
import cx from 'classnames'

export interface ContactProps {
  className?: string
  title?: string
  description?: string
  phone?: string
  phoneLabel?: string
  email?: string
  emailLabel?: string
  address?: string
}

export const Contact = ({
  className,
  title,
  description,
  phone,
  phoneLabel,
  email,
  emailLabel,
  address,
}: ContactProps) => {
  const items: ContactItemProps[] = []
  if (address) items.push({ variant: 'address', value: address })
  if (phone)
    items.push({
      variant: 'phone',
      value: phone,
      label: phoneLabel,
      href: `tel:${phone.replace(/ /g, '')}`,
    })
  if (email)
    items.push({
      variant: 'email',
      value: email,
      label: emailLabel,
      href: `mailto:${email}`,
    })

  return (
    <>
      {title && <h4 className="text-h4 mb-6 leading-[36px]">{title}</h4>}
      <div className={cx(className, 'flex flex-col items-center gap-3 text-font md:flex-row')}>
        {description && (
          <div
            className={cx('mb-6 md:mb-0', {
              'md:w-1/2': items,
            })}
          >
            <div className={cx('flex h-full flex-col', { 'justify-center': !address })}>
              {description && <Markdown content={description} />}
            </div>
          </div>
        )}
        {items && (
          <div className={cx('mb-6 w-full md:mb-0', { 'md:w-1/2': description })}>
            <div
              className={cx('flex flex-col gap-3 text-font md:flex-row ', {
                'justify-start': items.length === 1,
                'justify-between': items.length === 2 || items.length === 3,
              })}
            >
              {items.map((item) => (
                <div
                  key={item.variant}
                  className={cx('mb-6 last:mb-0 md:mb-0', {
                    'md:w-1/2': items.length === 2,
                  })}
                >
                  <ContactItem {...item} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

interface ContactItemProps {
  variant: 'phone' | 'email' | 'address'
  value: string
  label?: string
  href?: string
}

const ContactItem = ({ variant, value, label, href }: ContactItemProps) => {
  if (variant === 'address') {
    return <Markdown content={value} />
  }

  const Icon = variant === 'phone' ? Phone : Email

  return (
    <div className="text-large relative flex h-full flex-col items-center justify-start pb-20 leading-[30px]">
      <Icon className="h-24 w-24" />
      {value.split(',').map((item, index) => {
        return (
          // eslint-disable-next-line react/no-array-index-key
          <div key={index} className="text-center">
            <span
              className={cx('text-large w-full text-center font-semibold', {
                'mt-9': index === 0,
                'whitespace-nowrap': variant === 'phone',
              })}
            >
              {item}
            </span>
          </div>
        )
      })}
      {label && href && (
        <Button href={href} variant="category" className="mt-8">
          {label}
        </Button>
      )}
    </div>
  )
}

export default Contact
