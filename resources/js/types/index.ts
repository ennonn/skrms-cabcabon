import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href?: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
    adminOnly?: boolean;
}

export interface Quote {
    message: string;
    author: string;
}

export interface SharedData {
    auth: {
        user: User | null;
    };
    name: string;
    quote: Quote;
    sidebarOpen: boolean;
    breadcrumbs?: BreadcrumbItem[];
    ziggy: Config & { location: string };
    [key: string]: unknown;
}

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

export interface YouthProfile {
    id: number;
    user_id: number;
    status: 'draft' | 'pending' | 'approved' | 'rejected';
    approver_id: number | null;
    approval_notes: string | null;
    created_at: string;
    updated_at: string;
    personalInformation: {
        full_name: string;
        birthdate: string;
        gender: string;
        email: string | null;
        phone: string | null;
        address: string;
        civil_status: string;
        youth_age_group: string;
        personal_monthly_income: number | null;
        interests_hobbies: string | null;
        suggested_programs: string | null;
    };
    familyInformation: {
        father_name: string | null;
        mother_name: string | null;
        parents_monthly_income: number | null;
    };
    engagementData: {
        education_level: string;
        youth_classification: string;
        work_status: string;
        is_sk_voter: boolean;
        is_registered_national_voter: boolean;
        voted_last_election: boolean;
        has_attended_assembly: boolean;
        assembly_attendance: number | null;
        assembly_absence_reason: string | null;
    };
    user?: User;
    approver?: User;
}

export interface DraftYouthProfile {
    id: number;
    user_id: number;
    status: 'draft' | 'pending' | 'approved' | 'rejected';
    full_name: string;
    birthdate: string;
    gender: string;
    email: string | null;
    phone: string | null;
    address: string;
    civil_status: string;
    youth_age_group: string;
    personal_monthly_income: number | null;
    interests_hobbies: string | null;
    suggested_programs: string | null;
    father_name: string | null;
    mother_name: string | null;
    parents_monthly_income: number | null;
    education_level: string;
    youth_classification: string;
    work_status: string;
    is_sk_voter: boolean;
    is_registered_national_voter: boolean;
    voted_last_election: boolean;
    has_attended_assembly: boolean;
    assembly_attendance: number | null;
    assembly_absence_reason: string | null;
    created_at: string;
    updated_at: string;
    user?: User;
    approver?: User;
}

export interface YouthProfileRecord {
    id: number;
    user_id: number;
    approver_id: number;
    approval_notes: string | null;
    created_at: string;
    updated_at: string;
    user?: User;
    approver?: User;
    personalInformation?: PersonalInformation;
    familyInformation?: FamilyInformation;
    engagementData?: EngagementData;
}

export interface PersonalInformation {
    id: number;
    youth_profile_record_id: number;
    first_name: string;
    last_name: string;
    birthdate: string;
    gender: 'male' | 'female' | 'other';
    email: string | null;
    phone: string | null;
    address: string;
    monthly_income: number | null;
    created_at: string;
    updated_at: string;
}

export interface FamilyInformation {
    id: number;
    youth_profile_record_id: number;
    father_name: string | null;
    father_age: number | null;
    mother_name: string | null;
    mother_age: number | null;
    created_at: string;
    updated_at: string;
}

export interface EngagementData {
    id: number;
    youth_profile_record_id: number;
    education_level: 'elementary' | 'high_school' | 'college' | 'vocational' | 'graduate' | 'out_of_school';
    employment_status: 'employed' | 'unemployed' | 'student';
    is_sk_voter: boolean;
    assembly_attendance: number | null;
    created_at: string;
    updated_at: string;
}

export interface ProposalCategory {
    id: number;
    name: string;
    description: string | null;
    is_active: boolean;
}

export interface BudgetItem {
    item: string;
    quantity: number;
    unit_cost: number;
    total: number;
}

export interface Proposal {
    id: number;
    proposal_category_id: number;
    category: ProposalCategory;
    title: string;
    description: string;
    estimated_cost: number;
    frequency: string;
    funding_source: string;
    people_involved: string;
    objectives?: string[];
    expected_outcomes?: string[];
    implementation_start_date?: string;
    implementation_end_date?: string;
    location?: string;
    target_participants?: number;
    total_budget?: number;
    budget_breakdown?: BudgetItem[];
    status: 'draft' | 'pending' | 'approved' | 'rejected';
    submitted_by: number;
    approved_by: number | null;
    rejection_reason: string | null;
    created_at: string;
    updated_at: string;
    submitter?: User;
    approver?: User;
}