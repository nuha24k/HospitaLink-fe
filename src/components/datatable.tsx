import * as React from "react"
import { useMemo } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
} from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

type Column<T> = {
    key: string
    header: string
    render?: (row: T) => React.ReactNode
    className?: string
}

type DataTableProps<T> = {
    columns: Column<T>[]
    data: T[]
    page: number
    pageSize: number
    totalItems: number
    onPageChange: (page: number) => void
}

export default function DataTable<T>({
    columns,
    data,
    page,
    pageSize,
    totalItems,
    onPageChange,
}: DataTableProps<T>) {
    const totalPages = useMemo(
        () => Math.max(1, Math.ceil(totalItems / pageSize)),
        [totalItems, pageSize],
    )
    
    const canPrev = page > 1
    const canNext = page < totalPages

    const goto = (p: number) => {
        if (p < 1 || p > totalPages) return
        onPageChange(p)
    }

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = []
        const maxVisiblePages = 5
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            if (page <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i)
                }
                pages.push('ellipsis')
                pages.push(totalPages)
            } else if (page >= totalPages - 2) {
                pages.push(1)
                pages.push('ellipsis')
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i)
                }
            } else {
                pages.push(1)
                pages.push('ellipsis')
                for (let i = page - 1; i <= page + 1; i++) {
                    pages.push(i)
                }
                pages.push('ellipsis')
                pages.push(totalPages)
            }
        }
        
        return pages
    }

    return (
        <div className="w-full space-y-4">
            {/* Table */}
            <div className="rounded-lg border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-muted/50">
                            {columns.map((c) => (
                                <TableHead
                                    key={c.key}
                                    className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${c.className || ""}`}
                                >
                                    {c.header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((row, idx) => (
                            <TableRow
                                key={idx}
                                className="hover:bg-muted/50 transition-colors"
                            >
                                {columns.map((c) => (
                                    <TableCell
                                        key={c.key}
                                        className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${c.className || ""}`}
                                    >
                                        {c.render
                                            ? c.render(row)
                                            : String(
                                                (row as Record<string, unknown>)[c.key] ?? "",
                                            )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                        {data.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="text-4xl">📋</div>
                                        <p className="text-sm font-medium">Tidak ada data</p>
                                        <p className="text-xs text-muted-foreground">Data akan muncul di sini setelah ditambahkan</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between gap-4">
                <div className="text-sm text-muted-foreground">
                    Menampilkan{" "}
                    <span className="font-medium">
                        {totalItems === 0
                            ? 0
                            : (page - 1) * pageSize + 1}
                    </span>
                    {" "}–{" "}
                    <span className="text-sm font-medium">
                        {Math.min(page * pageSize, totalItems)}
                    </span>
                    {" "}dari{" "}
                    <span className="font-medium">{totalItems}</span>
                    {" "}hasil
                </div>
                
                <Pagination>
                    <PaginationContent className="gap-1">
                        {/* First Page */}
                        <PaginationItem>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => goto(1)}
                                disabled={!canPrev}
                                className="h-9 w-9 p-0"
                            >
                                <ChevronsLeft className="h-4 w-4" />
                                <span className="sr-only">Halaman pertama</span>
                            </Button>
                        </PaginationItem>
                        
                        {/* Previous Page */}
                        <PaginationItem>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => goto(page - 1)}
                                disabled={!canPrev}
                                className="h-9 w-9 p-0"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                <span className="sr-only">Halaman sebelumnya</span>
                            </Button>
                        </PaginationItem>
                        
                        {/* Page Numbers */}
                        {getPageNumbers().map((pageNum, index) => (
                            <PaginationItem key={index}>
                                {pageNum === 'ellipsis' ? (
                                    <PaginationEllipsis />
                                ) : (
                                    <PaginationLink
                                        onClick={() => goto(pageNum as number)}
                                        isActive={page === pageNum}
                                        className="h-9 w-9 p-0"
                                    >
                                        {pageNum}
                                    </PaginationLink>
                                )}
                            </PaginationItem>
                        ))}
                        
                        {/* Next Page */}
                        <PaginationItem>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => goto(page + 1)}
                                disabled={!canNext}
                                className="h-9 w-9 p-0"
                            >
                                <ChevronRight className="h-4 w-4" />
                                <span className="sr-only">Halaman berikutnya</span>
                            </Button>
                        </PaginationItem>
                        
                        {/* Last Page */}
                        <PaginationItem>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => goto(totalPages)}
                                disabled={!canNext}
                                className="h-9 w-9 p-0"
                            >
                                <ChevronsRight className="h-4 w-4" />
                                <span className="sr-only">Halaman terakhir</span>
                            </Button>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    )
}