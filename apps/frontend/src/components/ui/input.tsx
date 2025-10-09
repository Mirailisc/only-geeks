"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground min-w-0 rounded-md text-base transition-[color,box-shadow,width] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "border-input dark:bg-input/30 border bg-transparent shadow-xs w-full",
        outline: "border-input dark:bg-background dark:border-input border-2 bg-background w-full",
        filled: "border-input bg-muted dark:bg-input/50 border focus-visible:bg-background w-full",
        ghost: "border-transparent bg-transparent hover:bg-accent focus-visible:bg-accent w-full",
        "default-growth": "border-input dark:bg-input/30 border bg-transparent shadow-xs w-auto",
        "outline-growth": "border-input dark:bg-background dark:border-input border-2 bg-background w-auto",
        "filled-growth": "border-input bg-muted dark:bg-input/50 border focus-visible:bg-background w-auto",
        "ghost-growth": "border-transparent bg-transparent hover:bg-accent focus-visible:bg-accent w-auto",
      },
      inputSize: {
        sm: "h-8 px-2.5 py-1 text-sm",
        default: "h-9 px-3 py-1",
        lg: "h-10 px-4 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  },
)

export interface InputProps extends Omit<React.ComponentProps<"input">, "size">, VariantProps<typeof inputVariants> {
  maxWidth?: number
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, type, maxWidth, ...props }, ref) => {
    const [inputValue, setInputValue] = React.useState<string>(
      (props.value as string) || (props.defaultValue as string) || "",
    )
    const [width, setWidth] = React.useState<number | undefined>(undefined)
    const spanRef = React.useRef<HTMLSpanElement>(null)
    const internalRef = React.useRef<HTMLInputElement>(null)

    const isGrowthVariant = variant?.includes("-growth")

    React.useImperativeHandle(ref, () => internalRef.current!)

    // Update inputValue when props.value changes (controlled component)
    React.useEffect(() => {
      if (props.value !== undefined) {
        setInputValue(props.value as string)
      }
    }, [props.value])

    // Update width whenever inputValue changes
    React.useLayoutEffect(() => {
      if (!isGrowthVariant || !spanRef.current) return

      const contentWidth = spanRef.current.offsetWidth
      const calculatedWidth = contentWidth // Add 1rem (16px)
      const finalWidth = maxWidth ? Math.min(calculatedWidth, maxWidth) : calculatedWidth
      setWidth(finalWidth)
    }, [isGrowthVariant, inputValue, maxWidth])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setInputValue(newValue)
      props.onChange?.(e)
    }

    if (isGrowthVariant) {
      return (
        <div className="inline-flex relative">
          {/* Hidden span to measure text width */}
          <span
            ref={spanRef}
            className={cn(
              "invisible absolute whitespace-pre",
              inputSize === "sm" && "px-2.5 py-1 text-sm",
              inputSize === "default" && "px-3 py-1 text-base md:text-sm",
              inputSize === "lg" && "px-4 py-2 text-base md:text-sm",
            )}
            aria-hidden="true"
          >
            {inputValue || props.placeholder || " "}
          </span>
          <input
            type={type}
            data-slot="input"
            className={cn(inputVariants({ variant, inputSize, className }))}
            style={{ 
              width: width ? `${width}px` : undefined,
              maxWidth: maxWidth ? `${maxWidth}px` : undefined,
            }}
            ref={internalRef}
            {...props}
            onChange={handleChange}
          />
        </div>
      )
    }

    return (
      <input
        type={type}
        data-slot="input"
        className={cn(inputVariants({ variant, inputSize, className }))}
        ref={internalRef}
        {...props}
      />
    )
  },
)
Input.displayName = "Input"

export { Input, inputVariants }