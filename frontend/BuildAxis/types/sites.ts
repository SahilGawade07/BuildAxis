export interface Sites {
  _id: string;
  name: string;
  address: string;
  description: string;
  budget: number;
  startDate: string;   // you can convert to Date in frontend if needed
  endDate: string;
  status: "active" | "inactive" | "completed"; // add more if needed
  supervisors: string[]; // or an array of ObjectIds
  promoters: string[];
  labours: string[];
  orgId: string;
  customerName: string;
  tasks: string[]; // or array of task objects if you expand
  createdAt: string;
  updatedAt: string;
  __v: number;
}
