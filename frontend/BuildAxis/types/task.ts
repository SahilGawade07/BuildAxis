export interface Task {
  _id: string;
  title: string;
  description?: string;
  status:
    | "open"
    | "in_progress"
    | "completed"
    | "verified"
    | "closed"
    | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  due: string;
  progress: number;
  createdAt: string;
  attachments?: string[];
  images?: string[];
  materials?: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
  site: {
    name: string;
    address?: string;
  };
  createdBy: {
    fName: string;
    lName: string;
    email?: string;
  };
  assignedToSupervisors: Array<{
    fName: string;
    lName: string;
    email?: string;
    phone?: string;
  }>;
  assignedToLabourers: Array<{
    fName: string;
    lName: string;
    email?: string;
    phone?: string;
  }>;
  supervisors?: Array<{
    fName: string;
    lName: string;
    email?: string;
  }>;
  inventoryUsed?: Array<{
    name: string;
    quantity: number;
    unit: string;
    specification?: string;
  }>;
}

export interface TaskListResponse {
  success: boolean;
  message: string;
  data?: {
    tasks: Task[];
    pagination: {
      current: number;
      total: number;
      count: number;
      totalTasks: number;
    };
  };
}
