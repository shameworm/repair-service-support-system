import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';

const TechniciansTable = (props) => {
  const [sorting, setSorting] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);



  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: "Ім'я",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'specialization',
        header: 'Спеціалізація',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'contactInfo',
        header: 'Контактна інформація',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'isAdmin',
        header: 'Адміністратор',
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
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
