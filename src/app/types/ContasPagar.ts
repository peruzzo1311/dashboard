export interface ProjectionColumn {
  schema: string;
  table: string;
  column: string;
  label: string;
  type: string;
}

export interface Row {
  columns: string[];
}

export interface Filter {
  key: string;
  label: string;
  dataType: string;
  filterValue: {
    value: string;
    description: string;
    domain: string;
    service: string;
    type: string;
    name: string;
    search: string;
    records: string;
    _discriminator: string;
  };
}

export default interface ContasPagar {
  projection: ProjectionColumn[];
  rows: Row[];
  lastRefresh: string;
  filters: Filter[];
  source: string;
}
