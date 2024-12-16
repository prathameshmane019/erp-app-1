// types/auth.ts
export interface User {
    _id: string;
    role: 'faculty' | 'student';
    name: string;
    email: string;
    phone?: string;
    currentYear:string;
    department:string;
    institute: {
      _id:string;
      name: string;
      address: string;
    };
    subjects?: Array<{
      _id: string;
      id: string;
      name: string;
      batch: string[];
      subType: string;
    }>;
  }
  export default {};