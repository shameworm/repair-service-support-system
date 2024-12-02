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

const EquipmentTable = (props) => {
  const [sorting, setSorting] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [columnFilters, setColumnFilters] = useState([]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Назва',
        enableColumnFilter: true,
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'type',
        header: 'Тип',
        enableColumnFilter: true,

        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'status',
        header: 'Статус',
        enableColumnFilter: true,

        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'location',
        header: 'Адреса',
        enableColumnFilter: true,

        cell: (info) => {
          console.log(info.row.original._id);
          return info.getValue();
        },
      },
      {
        accessorKey: 'actions',
        header: 'Дії',
        cell: (info) => (
          <div style={{ display: 'flex' }}>
            <Button size="small" inverse onClick={() => props.onEquipmentDelete(info.row.original._id)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2">
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                <line x1="10" x2="10" y1="11" y2="17" />
                <line x1="14" x2="14" y1="11" y2="17" />
              </svg>
            </Button>
            <Button size='small' inverse to={`equipments/${info.row.original._id}`}>
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
          <h2>Не знайдено жодного обладнання</h2>
          <Button to="/equipments/new">Додати обладнання</Button>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <span style={{ margin: '15px 50px', display: "flex" }}>
        <Button to="/equipments/new">+ Додати обладнання</Button>
        <Filters
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
          filterOptions={[
            { value: "name", label: "Назва" },
            { value: "type", label: "Тип" },
            { value: "status", label: "Статус" },
            { value: "location", label: "Адреса" },
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

export default EquipmentTable;
