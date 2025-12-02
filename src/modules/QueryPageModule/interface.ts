export interface SparqlRowProps {
  [key: string]: string | number;
}

export interface SparqlResponseProps {
  status: number;
  message: string;
  data: SparqlRowProps[];
}