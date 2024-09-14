import type { MouseEventHandler } from 'react'
import classNames from 'classnames'

export default function Footer({
  children,
  className,
  colorClassName,
  backgroundClassName,
}: {
  children?: React.ReactNode
  className?: string
  colorClassName?: string
  backgroundClassName?: string
}) {
  return (
    <footer className={classNames('sticky bottom-0 pb-4', className)}>
      <ul
        className={classNames(
          'mx-4 flex items-center divide-x divide-cb-white rounded-lg',
          colorClassName ?? 'text-cb-yellow',
          backgroundClassName ?? 'bg-cb-dusty-blue'
        )}
      >
        {children}
      </ul>
    </footer>
  )
}

export function FooterListItem({
  onClick,
  disabled,
  children,
}: {
  onClick?: MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
  children?: React.ReactNode
}) {
  return (
    <li className='flex-grow'>
      {onClick ? (
        <button
          className='flex w-full justify-center py-2 disabled:pointer-events-none disabled:opacity-25'
          type='button'
          onClick={onClick}
          disabled={disabled ?? false}
        >
          {children}
        </button>
      ) : (
        children
      )}
    </li>
  )
}
