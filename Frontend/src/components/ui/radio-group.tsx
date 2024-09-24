import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { CheckCircle2, Circle } from 'lucide-react'

export function RadioGroup(props: RadioGroupPrimitive.RadioGroupProps) {
  return (
    <RadioGroupPrimitive.RadioGroup
      {...props}
      className="flex flex-col gap-2"
    />
  )
}

export function RadioGroupItem(props: RadioGroupPrimitive.RadioGroupItemProps) {
  return (
    <RadioGroupPrimitive.RadioGroupItem
      {...props}
      className="group bg-zinc-100 border border-zinc-300 rounded-lg px-4 py-2.5 flex items-center justify-between outline-none transition-colors duration-300 hover:border-zinc-600 focus:border-[#105841] focus:ring-2 ring-[#105841]/20 data-[state=checked]:bg-[#105841]/10 data-[state=checked]:border-[#105841]"
    />
  )
}

export function RadioGroupIndicator() {
  return (
    <>
      <Circle className="size-4 text-zinc-500 group-data-[state=checked]:hidden" />
      <CheckCircle2 className="size-4 text-[#105841] hidden group-data-[state=checked]:inline" />
    </>
  )
}
