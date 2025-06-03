export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    email_verified_at: string | null;
    role: 'superadmin' | 'admin' | 'user';
    is_active: boolean;
    birthdate: string;
    phone_number: string;
    promoted_by: number | null;
    created_at: string;
    updated_at: string;
}

export interface ProposalCategory {
    id: number;
    name: string;
    is_active: boolean;
}

export interface Proposal {
    id: number;
    title: string;
    description: string;
    status: 'draft' | 'pending' | 'approved' | 'rejected';
    estimated_cost: number;
    frequency: string;
    funding_source: string;
    people_involved: string;
    created_at: string;
    updated_at: string;
    category: ProposalCategory;
    submitter?: User;
    approver?: User;
    rejection_reason?: string;
} 