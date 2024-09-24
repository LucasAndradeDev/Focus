import * as ProgressPrimitive from '@radix-ui/react-progress'

export function Progress(props: ProgressPrimitive.ProgressProps) {
  return (
    <ProgressPrimitive.Progress
      {...props}
      className="bg-zinc-300 rounded-full h-2"
    />
  )
}

export function ProgressIndicator(
  props: ProgressPrimitive.ProgressIndicatorProps
) {
  return (
    <ProgressPrimitive.Indicator
      {...props}
      className="bg-gradient-to-r from-[#16BF78] to-[#105841] w-1/2 h-2 rounded-full"
    />
  )
}
