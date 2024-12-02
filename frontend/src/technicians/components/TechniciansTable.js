import React, { useMemo, useState } from 'react';
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

const TechniciansTable = (props) => {
  const [sorting, setSorting] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [columnFilters, setColumnFilters] = useState([]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: "Ім'я",
        enableColumnFilter: true,
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'specialization',
        header: 'Спеціалізація',
        enableColumnFilter: true,
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'contactInfo',
        header: 'Контактна інформація',
        enableColumnFilter: true,
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'isAdmin',
        header: 'Адміністратор',
        enableColumnFilter: true,
        cell: (info) => {
          return info.getValue() ? 'Адміністратор' : 'Працівник';
        },
      },
    ],
    []
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
          <h2>Не знайдено жодного працівника</h2>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <span style={{ margin: '15px 50px', display: "flex" }}>
        <Filters
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
          filterOptions={[
            { value: "name", label: "Ім'я" },
            { value: "specialization", label: "Спеціалізація" },
            { value: "contactInfo", label: "Контактна інформація" },
            { value: "isAdmin", label: "Адміністратор" },
          ]}
        />
      </span>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} onClick={() => header.column.getCanSort() && handleSort(header)}
                >
                  {/* Only render sort button for columns that are sortable */}
                  {header.column.columnDef.disableSorting ? (
                    // No sort button for 'actions' column
                    <span>{header.column.columnDef.header}</span>
                  ) : (
                    <span
                    >
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
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      {pageCount > 1 && (
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
      )}
    </div>
  );
};

export default TechniciansTable;
