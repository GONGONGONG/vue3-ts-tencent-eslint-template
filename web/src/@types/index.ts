export * from './base';
export * from './activity';
// export * from './project';
// export * from './box';

export interface IColumn {
  label: string
  field: string
  render: () => JSX.Element
  width: string | number
  minWidth: string | number
}
