CREATE OR REPLACE VIEW looker_analytics_view AS
WITH total_budget AS (
    SELECT SUM(p.estimated_cost) as total_all_proposals
    FROM proposals p
    WHERE p.status = 'approved'
)
SELECT 
    -- Non-sensitive Profile Information
    ypr.created_at as profile_created_at,
    
    -- Demographics (Aggregated)
    pi.gender,
    pi.youth_age_group,
    pi.civil_status,
    
    -- Education and Work (Non-identifiable)
    ed.education_level,
    ed.youth_classification,
    ed.work_status,
    
    -- Engagement Metrics (Non-identifiable)
    ed.is_sk_voter,
    ed.is_registered_national_voter,
    ed.voted_last_election,
    ed.has_attended_assembly,
    ed.assembly_attendance,
    
    -- Interests and Hobbies (Aggregated)
    pi.interests_hobbies,
    pi.suggested_programs,
    
    -- Income Ranges (Instead of exact amounts)
    CASE 
        WHEN pi.personal_monthly_income < 5000 THEN 'Below 5k'
        WHEN pi.personal_monthly_income BETWEEN 5000 AND 10000 THEN '5k-10k'
        WHEN pi.personal_monthly_income BETWEEN 10001 AND 20000 THEN '10k-20k'
        WHEN pi.personal_monthly_income > 20000 THEN 'Above 20k'
        ELSE 'Not Specified'
    END as income_bracket,
    
    CASE 
        WHEN fi.parents_monthly_income < 10000 THEN 'Below 10k'
        WHEN fi.parents_monthly_income BETWEEN 10000 AND 30000 THEN '10k-30k'
        WHEN fi.parents_monthly_income BETWEEN 30001 AND 50000 THEN '30k-50k'
        WHEN fi.parents_monthly_income > 50000 THEN 'Above 50k'
        ELSE 'Not Specified'
    END as household_income_bracket,
    
    -- Proposal Statistics (Aggregated)
    COUNT(DISTINCT p.id) as total_proposals_submitted,
    SUM(CASE WHEN p.status = 'approved' THEN 1 ELSE 0 END) as approved_proposals,
    SUM(CASE WHEN p.status = 'rejected' THEN 1 ELSE 0 END) as rejected_proposals,
    SUM(CASE WHEN p.status = 'pending' THEN 1 ELSE 0 END) as pending_proposals,
    
    -- Proposal Category Information
    pc.name as proposal_category,
    
    -- Budget Allocation Analysis
    SUM(CASE WHEN p.status = 'approved' THEN p.estimated_cost ELSE 0 END) as allocated_budget,
    ROUND((SUM(CASE WHEN p.status = 'approved' THEN p.estimated_cost ELSE 0 END) / NULLIF(tb.total_all_proposals, 0)) * 100, 2) as budget_percentage,
    
    -- Budget Status by Category
    SUM(CASE WHEN p.status = 'approved' AND p.proposal_category_id = pc.id THEN p.estimated_cost ELSE 0 END) as category_allocated_budget,
    SUM(CASE WHEN p.status = 'pending' AND p.proposal_category_id = pc.id THEN p.estimated_cost ELSE 0 END) as category_pending_budget,
    SUM(CASE WHEN p.status = 'rejected' AND p.proposal_category_id = pc.id THEN p.estimated_cost ELSE 0 END) as category_rejected_budget,
    
    -- Category Budget Metrics
    COUNT(DISTINCT CASE WHEN p.status = 'approved' AND p.proposal_category_id = pc.id THEN p.id END) as category_approved_count,
    AVG(CASE WHEN p.status = 'approved' AND p.proposal_category_id = pc.id THEN p.estimated_cost END) as category_avg_approved_cost,
    
    -- Overall Budget Metrics
    tb.total_all_proposals as total_approved_budget,
    
    -- Time-based Analysis (Non-sensitive)
    DATE_TRUNC('month', ypr.created_at) as profile_month,
    DATE_TRUNC('quarter', ypr.created_at) as profile_quarter,
    DATE_TRUNC('year', ypr.created_at) as profile_year

FROM youth_profile_records ypr
LEFT JOIN users u ON ypr.user_id = u.id
LEFT JOIN personal_information pi ON ypr.id = pi.youth_profile_record_id
LEFT JOIN family_information fi ON ypr.id = fi.youth_profile_record_id
LEFT JOIN engagement_data ed ON ypr.id = ed.youth_profile_record_id
LEFT JOIN proposals p ON ypr.user_id = p.submitted_by
LEFT JOIN proposal_categories pc ON p.proposal_category_id = pc.id
CROSS JOIN total_budget tb

GROUP BY 
    ypr.created_at,
    pi.gender,
    pi.youth_age_group,
    pi.civil_status,
    ed.education_level,
    ed.youth_classification,
    ed.work_status,
    ed.is_sk_voter,
    ed.is_registered_national_voter,
    ed.voted_last_election,
    ed.has_attended_assembly,
    ed.assembly_attendance,
    pi.interests_hobbies,
    pi.suggested_programs,
    pc.id,
    pc.name,
    tb.total_all_proposals,
    CASE 
        WHEN pi.personal_monthly_income < 5000 THEN 'Below 5k'
        WHEN pi.personal_monthly_income BETWEEN 5000 AND 10000 THEN '5k-10k'
        WHEN pi.personal_monthly_income BETWEEN 10001 AND 20000 THEN '10k-20k'
        WHEN pi.personal_monthly_income > 20000 THEN 'Above 20k'
        ELSE 'Not Specified'
    END,
    CASE 
        WHEN fi.parents_monthly_income < 10000 THEN 'Below 10k'
        WHEN fi.parents_monthly_income BETWEEN 10000 AND 30000 THEN '10k-30k'
        WHEN fi.parents_monthly_income BETWEEN 30001 AND 50000 THEN '30k-50k'
        WHEN fi.parents_monthly_income > 50000 THEN 'Above 50k'
        ELSE 'Not Specified'
    END; 