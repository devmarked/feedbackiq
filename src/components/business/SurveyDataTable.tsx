"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Eye, Edit3, Share2, Calendar, Users, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Survey } from "@/types"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/contexts/ToastContext"
import Link from "next/link"
import { ShareSurveyModal } from "./ShareSurveyModal"

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'draft':
      return 'bg-gray-100 text-gray-800 border-gray-200'
    case 'paused':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'completed':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

// Delete survey function
const deleteSurvey = async (surveyId: string, surveyTitle: string, onSuccess?: () => void, onError?: () => void) => {
  try {
    const supabase = createClient()
    const { error } = await supabase
      .from('surveys')
      .delete()
      .eq('id', surveyId)

    if (error) {
      console.error('Error deleting survey:', error)
      if (onError) {
        onError()
      }
      return false
    }

    if (onSuccess) {
      onSuccess()
    }
    return true
  } catch (error) {
    console.error('Error deleting survey:', error)
    if (onError) {
      onError()
    }
    return false
  }
}

// ActionCell component to handle the actions column
interface ActionCellProps {
  survey: Survey
  onSurveyDeleted?: () => void
}

const ActionCell: React.FC<ActionCellProps> = ({ survey, onSurveyDeleted }) => {
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [showShareModal, setShowShareModal] = React.useState(false)
  const { showSuccess, showError } = useToast()

  const handleDelete = async () => {
    setIsDeleting(true)
    const success = await deleteSurvey(
      survey.id, 
      survey.title,
      () => {
        // Success callback
        showSuccess('Survey Deleted', `"${survey.title}" has been successfully deleted`)
        if (onSurveyDeleted) {
          onSurveyDeleted()
        }
      },
      () => {
        // Error callback
        showError('Delete Failed', `Failed to delete "${survey.title}". Please try again.`)
      }
    )
    setIsDeleting(false)
  }

  return (
    <div className="flex items-center space-x-2">
      <Link href={`/business/surveys/${survey.id}/edit`}>
        <Button variant="outline" size="sm">
          <Edit3 className="w-4 h-4 mr-1" />
          Edit
        </Button>
      </Link>
      
      {survey.status === 'active' && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowShareModal(true)}
        >
          <Share2 className="w-4 h-4 mr-1" />
          Share
        </Button>
      )}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {survey.status === 'active' && (
            <Link href={`/survey/${survey.id}`}>
              <DropdownMenuItem>
                <Eye className="w-4 h-4 mr-2" />
                View Survey
              </DropdownMenuItem>
            </Link>
          )}
          <Link href={`/business/surveys/${survey.id}/responses`}>
            <DropdownMenuItem>
              <Users className="w-4 h-4 mr-2" />
              View Responses
            </DropdownMenuItem>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem 
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                onSelect={(e) => e.preventDefault()}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Survey
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Survey</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete &quot;{survey.title}&quot;? This action cannot be undone.
                  {survey.response_count > 0 && (
                    <span className="block mt-2 text-amber-600 font-medium">
                      ⚠️ This survey has {survey.response_count} response{survey.response_count !== 1 ? 's' : ''} that will also be deleted.
                    </span>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Survey
                    </>
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <ShareSurveyModal
        survey={survey}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </div>
  )
}

// Create columns function that accepts the callback
const createColumns = (onSurveyDeleted?: () => void): ColumnDef<Survey>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium"
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const survey = row.original
      return (
        <div className="flex flex-col">
          <div className="font-medium text-gray-900">{survey.title}</div>
          {survey.description && (
            <div className="text-sm text-gray-500 mt-1 line-clamp-2">
              {survey.description}
            </div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge variant="secondary" className={getStatusColor(status)}>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "response_count",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium"
        >
          <Users className="mr-2 h-4 w-4" />
          Responses
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const survey = row.original
      return (
        <div className="flex flex-col">
          <span className="font-medium">{survey.response_count}</span>
          {survey.target_responses && (
            <span className="text-sm text-gray-500">
              / {survey.target_responses} target
            </span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium"
        >
          <Calendar className="mr-2 h-4 w-4" />
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const createdAt = row.getValue("created_at") as string
      return (
        <div className="text-sm">
          {formatDate(createdAt)}
        </div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const survey = row.original
      
      return <ActionCell survey={survey} onSurveyDeleted={onSurveyDeleted} />
    },
  },
]

// Export the columns for backward compatibility
export const columns = createColumns()

interface SurveyDataTableProps {
  data: Survey[]
  onSurveyDeleted?: () => void
}

export function SurveyDataTable({ data, onSurveyDeleted }: SurveyDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  // Create columns with the callback
  const columnsWithCallback = React.useMemo(() => createColumns(onSurveyDeleted), [onSurveyDeleted])

  const table = useReactTable({
    data,
    columns: columnsWithCallback,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Filter surveys..."
              value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("title")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          </div>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="h-12">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="h-16"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columnsWithCallback.length}
                    className="h-24 text-center"
                  >
                    No surveys found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
