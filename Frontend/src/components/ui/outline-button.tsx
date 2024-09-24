import type { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

export function OutlineButton(props: ComponentProps<'button'>) {
  return (
    <button
      {...props}
      className={twMerge(
        'flex items-center px-3 py-2 gap-2 leading-none font-semibold rounded-full border border-solid text-sm text-white bg-[#16BF78] hover:bg-[#105841] hover:text-white disabled:opacity-50 disabled:pointer-events-none outline-none focus-visible:border-[#16BF78] ring-[#16BF78]/10 focus-visible:ring-4',
        props.className
      )}
    />
  );
}
