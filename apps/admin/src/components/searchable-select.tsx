import * as React from "react"
import { Check, ChevronsUpDown, Loader2, SearchIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { FormControl } from "@/components/ui/form"

interface SearchableSelectProps {
  items: { label: string; value: string }[]
  value?: string
  onValueChange: (value: string) => void
  onSearchChange?: (search: string) => void
  onScrollEnd?: () => void
  isLoadingMore?: boolean
  hasNextPage?: boolean
  placeholder?: string
  searchPlaceholder?: string
  noResultsMessage?: string
  className?: string
  isPending?: boolean
  isLoading?: boolean
  disabled?: boolean
}

export function SearchableSelect({
  items,
  value,
  onValueChange,
  onSearchChange,
  onScrollEnd,
  isLoadingMore,
  hasNextPage,
  placeholder = "Select item...",
  searchPlaceholder = "Search...",
  noResultsMessage = "No results found.",
  className,
  isPending,
  isLoading,
  disabled,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false)
  const observerTarget = React.useRef(null)

  const selectedItem = items.find((item) => item.value === value)

  React.useEffect(() => {
    if (!open || !onScrollEnd) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isLoadingMore) {
          onScrollEnd()
        }
      },
      { threshold: 0.1 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [open, onScrollEnd, hasNextPage, isLoadingMore])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled || isPending}
            className={cn("w-full justify-between font-normal", className, !value && "text-muted-foreground")}
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading...</span>
              </div>
            ) : (
              selectedItem ? selectedItem.label : placeholder
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]" align="start">
        <Command shouldFilter={!onSearchChange}>
          {onSearchChange ? (
            <div className='flex h-9 items-center gap-2 border-b px-3' data-slot='command-input-wrapper'>
              <SearchIcon className='size-4 shrink-0 opacity-50' />
              <input
                placeholder={searchPlaceholder}
                className='flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50'
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          ) : (
            <CommandInput placeholder={searchPlaceholder} />
          )}
          <CommandList>
            {isLoading && items.length === 0 ? (
              <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </div>
            ) : items.length === 0 ? (
              <CommandEmpty>{noResultsMessage}</CommandEmpty>
            ) : (
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.label} // Use label for better matching if filtered
                    onSelect={() => {
                      onValueChange(item.value)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === item.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {item.label || "Unnamed Item"}
                  </CommandItem>
                ))}
                {onScrollEnd && (
                  <div ref={observerTarget} className="flex justify-center p-2">
                    {isLoadingMore && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                  </div>
                )}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
