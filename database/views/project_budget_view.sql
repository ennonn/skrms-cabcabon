CREATE OR REPLACE VIEW project_budget_view AS
SELECT 
    -- Project Information
    p.id as project_id,
    p.title as project_title,
    pc.name as project_category,
    p.status as project_status,
    p.created_at as project_created_at,
    
    -- Budget Information
    p.estimated_cost as total_budget,
    
    -- Project Details
    p.description as project_description,
    p.frequency as project_frequency,
    p.funding_source,
    p.people_involved,
    
    -- Submitter Information (Non-sensitive)
    u.id as submitter_id,
    
    -- Approval Information
    CASE 
        WHEN p.status = 'approved' THEN 'Approved'
        WHEN p.status = 'rejected' THEN 'Rejected'
        WHEN p.status = 'pending' THEN 'Pending Review'
        ELSE 'Draft'
    END as approval_status,
    p.rejection_reason,
    
    -- Budget Analysis
    CASE 
        WHEN p.estimated_cost < 10000 THEN 'Low Budget (Below 10k)'
        WHEN p.estimated_cost BETWEEN 10000 AND 50000 THEN 'Medium Budget (10k-50k)'
        WHEN p.estimated_cost BETWEEN 50001 AND 100000 THEN 'High Budget (50k-100k)'
        ELSE 'Very High Budget (Above 100k)'
    END as budget_category,
    
    -- Time-based Analysis
    DATE_TRUNC('month', p.created_at) as submission_month,
    DATE_TRUNC('quarter', p.created_at) as submission_quarter,
    DATE_TRUNC('year', p.created_at) as submission_year

FROM proposals p
LEFT JOIN proposal_categories pc ON p.proposal_category_id = pc.id
LEFT JOIN users u ON p.submitted_by = u.id; 