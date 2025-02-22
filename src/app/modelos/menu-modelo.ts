export interface MenuItem {
  _id?:string;
  displayName: string;
  iconName: string;
  route?: string;
  tipoPermiso?: string;
  indeterminate?: boolean;
  selected?: boolean;
  children?: MenuItem[];
}
