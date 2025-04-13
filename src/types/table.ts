export interface Header<T> {
  name: string;
  accessor: keyof T;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  csv?: (row: T) => string;
}

export interface TableProps<T> {
  data: T[];
  headers: Header<T>[];
}
