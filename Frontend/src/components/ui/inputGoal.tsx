import { forwardRef, type ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

type InputProps = ComponentProps<'input'>

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return (
    <input
      {...props}
      ref={ref}
      className={twMerge(
        'px-4 h-12 bg-zinc-100 border border-zinc-200 rounded-lg placeholder-zinc-300 text-zinc-950 text-sm outline-none transition-colors duration-300 focus:border-[#105841] focus:ring-2 ring-[#105841]/20 disabled:opacity-50 disabled:pointer-events-none',
        props.className
      )}
    />
  )
})

Input.displayName = 'Input'
