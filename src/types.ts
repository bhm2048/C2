export interface Student {
  id: string;
  name: string;
  isDuplicate?: boolean;
}

export interface Group {
  id: string;
  name: string;
  members: Student[];
}
