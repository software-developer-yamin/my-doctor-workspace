import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { cn, getPageNumbers } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SimplePaginationProps {
  metadata: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
  className?: string
}

export function SimplePagination({
  metadata,
  onPageChange,
  onLimitChange,
  className,
}: SimplePaginationProps) {
  const { total, page, limit, totalPages } = metadata
  const pageNumbers = getPageNumbers(page, totalPages)

  if (total === 0) return null

  return (
    <div
      className={cn(
        'flex items-center justify-between px-2 py-4',
        className
      )}
    >
      <div className='flex items-center gap-6'>
        <div className='flex items-center gap-2'>
          <p className='text-sm font-medium'>Rows per page</p>
          <Select
            value={`${limit}`}
            onValueChange={(value) => onLimitChange(Number(value))}
          >
            <SelectTrigger className='h-8 w-[70px] bg-black/40 border-white/10'>
              <SelectValue placeholder={limit} />
            </SelectTrigger>
            <SelectContent side='top' className='bg-[#0c0f17] border-white/10'>
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='text-sm text-muted-foreground'>
          Total {total} items
        </div>
      </div>

      <div className='flex items-center space-x-2'>
        <div className='flex w-[100px] items-center justify-center text-sm font-medium'>
          Page {page} of {totalPages}
        </div>
        <Button
          variant='outline'
          className='hidden h-8 w-8 p-0 lg:flex border-white/10 bg-black/40'
          onClick={() => onPageChange(1)}
          disabled={page <= 1}
        >
          <span className='sr-only'>Go to first page</span>
          <ChevronsLeft className='h-4 w-4' />
        </Button>
        <Button
          variant='outline'
          className='h-8 w-8 p-0 border-white/10 bg-black/40'
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          <span className='sr-only'>Go to previous page</span>
          <ChevronLeft className='h-4 w-4' />
        </Button>

        {pageNumbers.map((pageNumber, index) => (
          <div key={`${pageNumber}-${index}`} className='flex items-center'>
            {pageNumber === '...' ? (
              <span className='px-2 text-sm text-muted-foreground'>...</span>
            ) : (
              <Button
                variant={page === pageNumber ? 'default' : 'outline'}
                className={cn(
                    'h-8 w-8 p-0',
                    page === pageNumber ? '' : 'border-white/10 bg-black/40'
                )}
                onClick={() => onPageChange(pageNumber as number)}
              >
                {pageNumber}
              </Button>
            )}
          </div>
        ))}

        <Button
          variant='outline'
          className='h-8 w-8 p-0 border-white/10 bg-black/40'
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          <span className='sr-only'>Go to next page</span>
          <ChevronRight className='h-4 w-4' />
        </Button>
        <Button
          variant='outline'
          className='hidden h-8 w-8 p-0 lg:flex border-white/10 bg-black/40'
          onClick={() => onPageChange(totalPages)}
          disabled={page >= totalPages}
        >
          <span className='sr-only'>Go to last page</span>
          <ChevronsRight className='h-4 w-4' />
        </Button>
      </div>
    </div>
  )
}
