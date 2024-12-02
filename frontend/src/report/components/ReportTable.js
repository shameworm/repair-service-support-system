import React, { useMemo, useState } from 'react';
import { format } from "date-fns"
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import Filters from '../../shared/components/TableFilter/TableFilter';

const ReportTable = (props) => {
  const [sorting, setSorting] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [columnFilters, setColumnFilters] = useState([]);


  const columns = useMemo(
    () => [
      {
        accessorKey: 'date',
        header: 'Дата',
        enableColumnFilter: true,
        cell: (info) => {
          const date = new Date(info.getValue());
          return format(date, 'dd.MM.yyyy');
        },
      },
      {
        accessorKey: 'type',
        header: 'Тип',
        enableColumnFilter: true,
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'details',
        header: 'Деталі',
        enableColumnFilter: true,
        cell: (info) => info.getValue() || null,
      },
      {
        accessorKey: 'maintenance.type',
        id: 'maintenance.type',
        header: 'Тип обслуговування',
        enableColumnFilter: true,
        cell: (info) => {
          return info.row.original.maintenance.type || "Н/з"
        },
      },
      {
        accessorKey: 'technician.name',
        id: 'technician.name',
        header: 'Технік',
        enableColumnFilter: true,
        cell: (info) => {
          return info.row.original.technician.name || "Н/з"
        },
      },
      {
        accessorKey: 'equipment.name',
        id: 'equipment.name',
        enableColumnFilter: true,
        header: 'Обладнання',
        cell: (info) => info.row.original.equipment?.name || "Н/з",
      },
      {
        accessorKey: 'pdfReport',
        header: 'PDF Звіт',
        cell: (info) => {
          return (
            <a target="_blank"
              rel="noopener noreferrer" href={`http://localhost:5000/files/reports/report-${info.row.original._id}/pdf`}>Переглянути</a>
          );
        },
      },
      {
        accessorKey: 'actions',
        header: 'Дії',
        cell: (info) => (
          <div style={{ display: 'flex' }}>
            <Button size="small" inverse onClick={() => props.onReportDelete(info.row.original._id)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2">
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                <line x1="10" x2="10" y1="11" y2="17" />
                <line x1="14" x2="14" y1="11" y2="17" />
              </svg>
            </Button>
            <Button size='small' inverse to={`/reports/${info.row.original._id}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-repeat-2">
                <path d="m2 9 3-3 3 3" />
                <path d="M13 18H7a2 2 0 0 1-2-2V6" />
                <path d="m22 15-3 3-3-3" />
                <path d="M11 6h6a2 2 0 0 1 2 2v10" />
              </svg>
            </Button>
          </div>
        ),
        disableSorting: true,
      },
    ],
    [props]
  );

  const tableData = useMemo(() => props.items || [], [props.items]);
  const pageCount = Math.ceil(tableData.length / pageSize);
  const table = useReactTable({
    data: tableData,
    columns,
    pageCount,
    state: {
      sorting,
      columnFilters,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: (updater) => {
      const nextPagination = updater({
        pageIndex,
        pageSize,
      });
      setPageIndex(nextPagination.pageIndex);
      setPageSize(nextPagination.pageSize);
    },
  });

  const handleSort = (header) => {
    header.column.toggleSorting();
  };

  if (props.items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>Не знайдено жодного запису про обслуговування</h2>
          <Button to="/reports/new">Додати запис</Button>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <span style={{ margin: '15px 50px' }}>
        <Button to="/reports/new">+ Додати запис</Button>
        <Filters
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
          filterOptions={[
            { value: "date", label: "Дата" },
            { value: "type", label: "Тип" },
            { value: "details", label: "Деталі" },
            { value: "maintenance.type", label: "Тип обслуговування" },
            { value: "technician.name", label: "Технік" },
            { value: "equipment.name", label: "Обладнання" },
          ]}
        />
      </span>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={() => header.column.getCanSort() && handleSort(header)}
                  style={header.column.columnDef.accessorKey === 'actions' ? { width: '15rem', overflow: 'hidden', textOverflow: 'ellipsis' } : {}}
                >
                  {/* Only render sort button for columns that are sortable */}
                  {header.column.columnDef.disableSorting ? (
                    // No sort button for 'actions' column
                    <span>{header.column.columnDef.header}</span>
                  ) : (
                    <span>
                      {header.column.columnDef.header}
                      {header.column.getCanSort() && !header.column.getIsSorted() && (
                        <span style={{ marginLeft: "4px" }}>{"↕️"}</span>
                      )}
                      {
                        {
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted()]
                      }
                    </span>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  style={cell.column.columnDef.accessorKey === 'actions' ? { maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' } : {}}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      {
        pageCount > 1 && (
          <div className="pagination">
            <div>
              Сторінка {table.getState().pagination.pageIndex + 1} з {pageCount}
            </div>
            <div>
              <Button
                onClick={() => table.previousPage()}
                isDisabled={!table.getCanPreviousPage()}
              >
                {'<'}
              </Button>
              <Button
                onClick={() => table.nextPage()}
                isDisabled={!table.getCanNextPage()}
              >
                {'>'}
              </Button>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default ReportTable;
