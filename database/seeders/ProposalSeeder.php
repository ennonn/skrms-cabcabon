<?php

namespace Database\Seeders;

use App\Models\Proposal;
use App\Models\ProposalCategory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class ProposalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all categories
        $categories = ProposalCategory::all();
        
        // Get users by role
        $users = User::where('role', 'user')->get();
        $admin = User::where('role', 'admin')->first();
        
        // Sample proposals data from the draft
        $proposals = [
            [
                'title' => 'Eco Warriors: Zero Waste Barangay',
                'description' => 'Organize seminars and workshops on zero-waste practices, plus initiate a waste segregation system in each purok.',
                'estimated_cost' => 40000,
                'frequency' => 'Monthly',
                'funding_source' => 'NGO',
                'people_involved' => 'SK Officials, Barangay Officials, Eco Volunteers',
                'implementation_start_date' => '2025-06-10',
                'implementation_end_date' => '2025-12-10',
                'location' => 'Barangay Ampayon, Butuan City',
                'target_participants' => 200,
                'objectives' => json_encode([
                    'Promote zero waste lifestyle',
                    'Educate residents on waste segregation'
                ]),
                'expected_outcomes' => json_encode([
                    'Cleaner environment',
                    'Increased waste segregation compliance'
                ]),
                'status' => 'pending',
                'proposal_category_id' => $categories->where('name', 'Community Development & Environment')->first()->id,
            ],
            [
                'title' => 'Basic Life Support Training for Youth',
                'description' => 'First-aid, CPR, and basic emergency response training for barangay youth in partnership with Red Cross.',
                'estimated_cost' => 20000,
                'frequency' => 'Quarterly',
                'funding_source' => 'NGO',
                'people_involved' => 'SK Officials, Red Cross Trainers',
                'implementation_start_date' => '2025-08-05',
                'implementation_end_date' => '2025-08-07',
                'location' => 'Barangay Libertad, Butuan City',
                'target_participants' => 50,
                'objectives' => json_encode([
                    'Enhance emergency preparedness',
                    'Train first responders in the community'
                ]),
                'expected_outcomes' => json_encode([
                    'Certified youth responders',
                    'Improved barangay emergency readiness'
                ]),
                'status' => 'approved',
                'proposal_category_id' => $categories->where('name', 'Skills & Capacity Building')->first()->id,
            ],
            [
                'title' => 'SK Volleyball Cup',
                'description' => 'Launch a barangay-wide volleyball tournament to promote fitness and teamwork among youth.',
                'estimated_cost' => 35000,
                'frequency' => 'Weekly',
                'funding_source' => 'SK Fund',
                'people_involved' => 'SK Officials, Coaches, Referees',
                'implementation_start_date' => '2025-07-10',
                'implementation_end_date' => '2025-08-30',
                'location' => 'Barangay Baan, Butuan City',
                'target_participants' => 100,
                'objectives' => json_encode([
                    'Promote teamwork and sportsmanship',
                    'Enhance physical fitness'
                ]),
                'expected_outcomes' => json_encode([
                    'Successful tournaments',
                    'Higher youth participation in sports'
                ]),
                'status' => 'draft',
                'proposal_category_id' => $categories->where('name', 'Sports & Recreation')->first()->id,
            ],
            [
                'title' => 'Libreng Pabasa: Eye Check-Up and Glasses Distribution',
                'description' => 'Free eye check-up for students and senior citizens, including free prescription glasses distribution.',
                'estimated_cost' => 50000,
                'frequency' => 'Annually',
                'funding_source' => 'LGU',
                'people_involved' => 'SK Officials, Volunteer Optometrists',
                'implementation_start_date' => '2025-10-05',
                'implementation_end_date' => '2025-10-06',
                'location' => 'Barangay Ambago, Butuan City',
                'target_participants' => 200,
                'objectives' => json_encode([
                    'Provide access to eye care',
                    'Support educational success through better vision'
                ]),
                'expected_outcomes' => json_encode([
                    'Improved eye health',
                    'Better school performance'
                ]),
                'status' => 'approved',
                'proposal_category_id' => $categories->where('name', 'Health & Wellness')->first()->id,
            ],
            [
                'title' => 'Scholarship Assistance Program',
                'description' => 'Provide financial aid for deserving but underprivileged students from the barangay.',
                'estimated_cost' => 100000,
                'frequency' => 'Annually',
                'funding_source' => 'Private Sponsor',
                'people_involved' => 'SK Officials, Barangay Council',
                'implementation_start_date' => '2025-06-01',
                'implementation_end_date' => '2026-03-31',
                'location' => 'Barangay Doongan, Butuan City',
                'target_participants' => 20,
                'objectives' => json_encode([
                    'Support continued education',
                    'Assist financially challenged families'
                ]),
                'expected_outcomes' => json_encode([
                    'Increased school retention',
                    'Higher graduation rates'
                ]),
                'status' => 'pending',
                'proposal_category_id' => $categories->where('name', 'Education Support')->first()->id,
            ],
            [
                'title' => 'Digital Skills Workshop for Youth',
                'description' => 'Teach basic digital literacy skills, including email, social media, MS Office, and basic graphic design.',
                'estimated_cost' => 40000,
                'frequency' => 'Quarterly',
                'funding_source' => 'LGU',
                'people_involved' => 'SK Officials, IT Volunteers',
                'implementation_start_date' => '2025-07-05',
                'implementation_end_date' => '2025-07-10',
                'location' => 'Barangay Kinamlutan, Butuan City',
                'target_participants' => 80,
                'objectives' => json_encode([
                    'Improve digital literacy',
                    'Enhance employability skills'
                ]),
                'expected_outcomes' => json_encode([
                    'Tech-savvy youth',
                    'Increased online opportunities'
                ]),
                'status' => 'rejected',
                'proposal_category_id' => $categories->where('name', 'Skills & Capacity Building')->first()->id,
                'rejection_reason' => 'Budget constraints and overlap with existing programs'
            ],
            [
                'title' => 'Youth Leaders Summit',
                'description' => 'A two-day leadership summit for SK members and youth leaders focusing on effective governance.',
                'estimated_cost' => 60000,
                'frequency' => 'Bi-annual',
                'funding_source' => 'LGU',
                'people_involved' => 'SK Federation, Leadership Trainers',
                'implementation_start_date' => '2025-09-10',
                'implementation_end_date' => '2025-09-11',
                'location' => 'Barangay Antongalon, Butuan City',
                'target_participants' => 100,
                'objectives' => json_encode([
                    'Develop leadership skills',
                    'Strengthen youth organizations'
                ]),
                'expected_outcomes' => json_encode([
                    'Empowered youth leaders',
                    'More effective youth programs'
                ]),
                'status' => 'pending',
                'proposal_category_id' => $categories->where('name', 'Advocacy & Governance')->first()->id,
            ],
            [
                'title' => 'Free Dental Check-Up and Hygiene Seminar',
                'description' => 'Provide free dental consultations and conduct hygiene awareness talks for children and teens.',
                'estimated_cost' => 45000,
                'frequency' => 'Quarterly',
                'funding_source' => 'NGO',
                'people_involved' => 'SK Officials, Volunteer Dentists',
                'implementation_start_date' => '2025-10-03',
                'implementation_end_date' => '2025-10-03',
                'location' => 'Barangay Bayanihan, Butuan City',
                'target_participants' => 200,
                'objectives' => json_encode([
                    'Promote oral hygiene',
                    'Prevent dental diseases'
                ]),
                'expected_outcomes' => json_encode([
                    'Healthier smiles',
                    'Better dental habits among youth'
                ]),
                'status' => 'approved',
                'proposal_category_id' => $categories->where('name', 'Health & Wellness')->first()->id,
            ],
            [
                'title' => 'Math and Science Enhancement Program',
                'description' => 'Special review classes to help students improve their math and science skills.',
                'estimated_cost' => 30000,
                'frequency' => 'Monthly',
                'funding_source' => 'Private Sponsor',
                'people_involved' => 'SK Officials, Volunteer Teachers',
                'implementation_start_date' => '2025-06-20',
                'implementation_end_date' => '2025-08-20',
                'location' => 'Barangay Lemon, Butuan City',
                'target_participants' => 100,
                'objectives' => json_encode([
                    'Improve academic performance',
                    'Prepare students for competitions'
                ]),
                'expected_outcomes' => json_encode([
                    'Higher test scores',
                    'Stronger interest in STEM'
                ]),
                'status' => 'draft',
                'proposal_category_id' => $categories->where('name', 'Education Support')->first()->id,
            ],
            [
                'title' => 'Youth Mental Health Awareness Campaign',
                'description' => 'Workshops and talks on stress management, depression prevention, and mental health resources.',
                'estimated_cost' => 25000,
                'frequency' => 'Bi-annual',
                'funding_source' => 'NGO',
                'people_involved' => 'SK Officials, Psychologists',
                'implementation_start_date' => '2025-11-10',
                'implementation_end_date' => '2025-11-12',
                'location' => 'Barangay Maon, Butuan City',
                'target_participants' => 150,
                'objectives' => json_encode([
                    'Reduce mental health stigma',
                    'Provide coping strategies'
                ]),
                'expected_outcomes' => json_encode([
                    'Increased help-seeking behavior',
                    'Peer support networks'
                ]),
                'status' => 'approved',
                'proposal_category_id' => $categories->where('name', 'Health & Wellness')->first()->id,
            ],
            [
                'title' => 'Barangay Film Festival: Youth Voices',
                'description' => 'A short film competition showcasing youth perspectives on social issues.',
                'estimated_cost' => 50000,
                'frequency' => 'Annually',
                'funding_source' => 'Private Sponsor',
                'people_involved' => 'SK Officials, Local Artists',
                'implementation_start_date' => '2025-12-01',
                'implementation_end_date' => '2025-12-05',
                'location' => 'Barangay Ong Yiu, Butuan City',
                'target_participants' => 30,
                'objectives' => json_encode([
                    'Encourage creative expression',
                    'Highlight youth concerns'
                ]),
                'expected_outcomes' => json_encode([
                    'Quality short films',
                    'Community dialogue on issues'
                ]),
                'status' => 'rejected',
                'proposal_category_id' => $categories->where('name', 'Social Transformation')->first()->id,
                'rejection_reason' => 'Limited resources and technical equipment availability'
            ],
            [
                'title' => 'Disaster Preparedness Training',
                'description' => 'Simulation drills and workshops on earthquake, flood, and fire response.',
                'estimated_cost' => 35000,
                'frequency' => 'Quarterly',
                'funding_source' => 'LGU',
                'people_involved' => 'SK Officials, DRRM Experts',
                'implementation_start_date' => '2025-07-20',
                'implementation_end_date' => '2025-07-22',
                'location' => 'Barangay Pagatpatan, Butuan City',
                'target_participants' => 120,
                'objectives' => json_encode([
                    'Build disaster resilience',
                    'Teach life-saving skills'
                ]),
                'expected_outcomes' => json_encode([
                    'Trained youth responders',
                    'Safer communities'
                ]),
                'status' => 'pending',
                'proposal_category_id' => $categories->where('name', 'Skills & Capacity Building')->first()->id,
            ],
            [
                'title' => 'Indigenous Crafts Workshop',
                'description' => 'Partner with local tribes to teach traditional weaving and handicraft-making.',
                'estimated_cost' => 22000,
                'frequency' => 'Annually',
                'funding_source' => 'NGO',
                'people_involved' => 'SK Officials, Tribal Elders',
                'implementation_start_date' => '2026-02-05',
                'implementation_end_date' => '2026-02-07',
                'location' => 'Barangay Buhangin, Butuan City',
                'target_participants' => 40,
                'objectives' => json_encode([
                    'Preserve cultural heritage',
                    'Generate livelihood ideas'
                ]),
                'expected_outcomes' => json_encode([
                    'Revived traditional crafts',
                    'Youth appreciation for indigenous culture'
                ]),
                'status' => 'approved',
                'proposal_category_id' => $categories->where('name', 'Social Transformation')->first()->id,
            ],
            [
                'title' => 'Youth Debate Championship',
                'description' => 'Inter-school debate on local and national issues to hone critical thinking.',
                'estimated_cost' => 30000,
                'frequency' => 'Annually',
                'funding_source' => 'Private Sponsor',
                'people_involved' => 'SK Officials, Debate Coaches',
                'implementation_start_date' => '2026-04-08',
                'implementation_end_date' => '2026-04-10',
                'location' => 'Barangay Rizal, Butuan City',
                'target_participants' => 24,
                'objectives' => json_encode([
                    'Develop critical thinking',
                    'Enhance public speaking skills'
                ]),
                'expected_outcomes' => json_encode([
                    'Improved debate skills',
                    'Greater youth participation in civic discourse'
                ]),
                'status' => 'draft',
                'proposal_category_id' => $categories->where('name', 'Advocacy & Governance')->first()->id,
            ],
            [
                'title' => 'Mangrove Tree Planting Activity',
                'description' => 'Mobilize the youth to plant mangrove trees to support coastal protection and biodiversity.',
                'estimated_cost' => 30000,
                'frequency' => 'Annually',
                'funding_source' => 'SK Fund',
                'people_involved' => 'SK Officials, DENR Representatives',
                'implementation_start_date' => '2025-09-25',
                'implementation_end_date' => '2025-09-25',
                'location' => 'Barangay Lumbocan, Butuan City',
                'target_participants' => 200,
                'objectives' => json_encode([
                    'Enhance coastal resilience',
                    'Promote environmental stewardship'
                ]),
                'expected_outcomes' => json_encode([
                    'Increased mangrove coverage',
                    'Awareness on climate action'
                ]),
                'status' => 'pending',
                'proposal_category_id' => $categories->where('name', 'Community Development & Environment')->first()->id,
            ],
            [
                'title' => 'Barangay Tech Repair Clinic',
                'description' => 'Free basic gadget repair training and community service for fixing minor tech issues.',
                'estimated_cost' => 28000,
                'frequency' => 'Quarterly',
                'funding_source' => 'LGU',
                'people_involved' => 'SK Officials, IT Students',
                'implementation_start_date' => '2026-01-10',
                'implementation_end_date' => '2026-01-12',
                'location' => 'Barangay Obrero, Butuan City',
                'target_participants' => 60,
                'objectives' => json_encode([
                    'Teach practical tech skills',
                    'Provide free device repairs'
                ]),
                'expected_outcomes' => json_encode([
                    'Reduced e-waste',
                    'Empowered youth technicians'
                ]),
                'status' => 'draft',
                'proposal_category_id' => $categories->where('name', 'Skills & Capacity Building')->first()->id,
            ],
            [
                'title' => 'Barangay Fun Run for Health',
                'description' => 'Community fun run with health booths (BMI checks, nutrition tips) post-race.',
                'estimated_cost' => 45000,
                'frequency' => 'Annually',
                'funding_source' => 'Private Sponsor',
                'people_involved' => 'SK Officials, Health Workers',
                'implementation_start_date' => '2026-03-15',
                'implementation_end_date' => '2026-03-15',
                'location' => 'Barangay Lapu-Lapu, Butuan City',
                'target_participants' => 300,
                'objectives' => json_encode([
                    'Promote active lifestyles',
                    'Raise health awareness'
                ]),
                'expected_outcomes' => json_encode([
                    'Higher fitness participation',
                    'Funds for health programs'
                ]),
                'status' => 'approved',
                'proposal_category_id' => $categories->where('name', 'Health & Wellness')->first()->id,
            ],
            [
                'title' => 'Recycled Art Competition',
                'description' => 'Contest turning recyclables into art to promote waste reduction.',
                'estimated_cost' => 20000,
                'frequency' => 'Annually',
                'funding_source' => 'Barangay Fund',
                'people_involved' => 'SK Officials, Environmentalists',
                'implementation_start_date' => '2025-08-15',
                'implementation_end_date' => '2025-08-17',
                'location' => 'Barangay Villa Kananga, Butuan City',
                'target_participants' => 50,
                'objectives' => json_encode([
                    'Promote upcycling',
                    'Raise eco-awareness'
                ]),
                'expected_outcomes' => json_encode([
                    'Reduced waste',
                    'Creative reuse of materials'
                ]),
                'status' => 'rejected',
                'proposal_category_id' => $categories->where('name', 'Community Development & Environment')->first()->id,
                'rejection_reason' => 'Similar program already exists in the barangay'
            ],
            [
                'title' => 'Youth Policy Formulation Workshop',
                'description' => 'Empower youth to create policy proposals on education, health, and environment in the barangay.',
                'estimated_cost' => 15000,
                'frequency' => 'Bi-annual',
                'funding_source' => 'SK Fund',
                'people_involved' => 'SK Officials, Barangay Council, Youth Advocates',
                'implementation_start_date' => '2025-09-05',
                'implementation_end_date' => '2025-09-06',
                'location' => 'Barangay Golden Ribbon, Butuan City',
                'target_participants' => 40,
                'objectives' => json_encode([
                    'Develop critical thinking',
                    'Encourage youth participation in policymaking'
                ]),
                'expected_outcomes' => json_encode([
                    'Youth-led policy suggestions',
                    'Increased civic engagement'
                ]),
                'status' => 'pending',
                'proposal_category_id' => $categories->where('name', 'Advocacy & Governance')->first()->id,
            ],
            [
                'title' => 'Purok Beautification Contest',
                'description' => 'Monthly competition for the cleanest and most beautiful purok to promote cleanliness and creativity.',
                'estimated_cost' => 25000,
                'frequency' => 'Monthly',
                'funding_source' => 'Barangay Fund',
                'people_involved' => 'SK Officials, Barangay Officials',
                'implementation_start_date' => '2025-05-15',
                'implementation_end_date' => '2025-11-15',
                'location' => 'Barangay Holy Redeemer, Butuan City',
                'target_participants' => 10,
                'objectives' => json_encode([
                    'Promote cleanliness',
                    'Strengthen purok pride and camaraderie'
                ]),
                'expected_outcomes' => json_encode([
                    'Cleaner puroks',
                    'Enhanced sense of community'
                ]),
                'status' => 'approved',
                'proposal_category_id' => $categories->where('name', 'Community Development & Environment')->first()->id,
            ],
            [
                'title' => 'Solar Lamp Assembly Workshop',
                'description' => 'Train youth to assemble solar lamps for off-grid puroks.',
                'estimated_cost' => 50000,
                'frequency' => 'Annually',
                'funding_source' => 'NGO',
                'people_involved' => 'SK Officials, Engineers',
                'implementation_start_date' => '2026-05-20',
                'implementation_end_date' => '2026-05-21',
                'location' => 'Barangay Ambacon, Butuan City',
                'target_participants' => 50,
                'objectives' => json_encode([
                    'Teach renewable energy basics',
                    'Provide light to marginalized areas'
                ]),
                'expected_outcomes' => json_encode([
                    'Solar-lit households',
                    'Youth energy advocates'
                ]),
                'status' => 'pending',
                'proposal_category_id' => $categories->where('name', 'Community Development & Environment')->first()->id,
            ],
            [
                'title' => 'Barangay Storytelling Festival',
                'description' => 'Celebrate local folklore through storytelling contests for kids and teens.',
                'estimated_cost' => 18000,
                'frequency' => 'Annually',
                'funding_source' => 'Barangay Fund',
                'people_involved' => 'SK Officials, Teachers',
                'implementation_start_date' => '2026-06-12',
                'implementation_end_date' => '2026-06-14',
                'location' => 'Barangay Bonbon, Butuan City',
                'target_participants' => 80,
                'objectives' => json_encode([
                    'Preserve oral traditions',
                    'Boost literacy'
                ]),
                'expected_outcomes' => json_encode([
                    'Engaged young readers',
                    'Documented local stories'
                ]),
                'status' => 'approved',
                'proposal_category_id' => $categories->where('name', 'Education Support')->first()->id,
            ],
            [
                'title' => 'Anti-Cyberbullying Campaign',
                'description' => 'Workshops on digital etiquette and reporting cyber harassment.',
                'estimated_cost' => 25000,
                'frequency' => 'Quarterly',
                'funding_source' => 'LGU',
                'people_involved' => 'SK Officials, IT Experts',
                'implementation_start_date' => '2026-07-05',
                'implementation_end_date' => '2026-07-06',
                'location' => 'Barangay Dumalagan, Butuan City',
                'target_participants' => 120,
                'objectives' => json_encode([
                    'Combat online abuse',
                    'Promote safe social media use'
                ]),
                'expected_outcomes' => json_encode([
                    'Safer digital spaces',
                    'Peer monitoring systems'
                ]),
                'status' => 'draft',
                'proposal_category_id' => $categories->where('name', 'Advocacy & Governance')->first()->id,
            ],
            [
                'title' => 'Barangay Zumba Fitness Program',
                'description' => 'Free weekly Zumba sessions to combat sedentary lifestyles.',
                'estimated_cost' => 35000,
                'frequency' => 'Weekly',
                'funding_source' => 'SK Fund',
                'people_involved' => 'SK Officials, Dance Instructors',
                'implementation_start_date' => '2026-08-01',
                'implementation_end_date' => '2026-12-15',
                'location' => 'Barangay Agusan Pequeño, Butuan City',
                'target_participants' => 100,
                'objectives' => json_encode([
                    'Reduce obesity rates',
                    'Build community bonds'
                ]),
                'expected_outcomes' => json_encode([
                    'Healthier residents',
                    'Regular fitness habit'
                ]),
                'status' => 'approved',
                'proposal_category_id' => $categories->where('name', 'Health & Wellness')->first()->id,
            ],
            [
                'title' => 'Rainwater Harvesting Project',
                'description' => 'Install and demonstrate rainwater collectors in public areas.',
                'estimated_cost' => 40000,
                'frequency' => 'Annually',
                'funding_source' => 'NGO',
                'people_involved' => 'SK Officials, Environmental Engineers',
                'implementation_start_date' => '2026-09-10',
                'implementation_end_date' => '2026-09-12',
                'location' => 'Barangay Bancasi, Butuan City',
                'target_participants' => 30,
                'objectives' => json_encode([
                    'Promote water conservation',
                    'Reduce flooding'
                ]),
                'expected_outcomes' => json_encode([
                    'Functional rainwater systems',
                    'Lower water bills'
                ]),
                'status' => 'rejected',
                'proposal_category_id' => $categories->where('name', 'Community Development & Environment')->first()->id,
                'rejection_reason' => 'Technical feasibility concerns and maintenance requirements'
            ],
            [
                'title' => 'SK Youth Talent Expo',
                'description' => 'Showcase youth talents (music, dance, art) in a barangay-wide exhibition.',
                'estimated_cost' => 60000,
                'frequency' => 'Annually',
                'funding_source' => 'Private Sponsor',
                'people_involved' => 'SK Officials, Local Artists',
                'implementation_start_date' => '2026-10-20',
                'implementation_end_date' => '2026-10-22',
                'location' => 'Barangay Bit-os, Butuan City',
                'target_participants' => 150,
                'objectives' => json_encode([
                    'Highlight youth creativity',
                    'Boost confidence'
                ]),
                'expected_outcomes' => json_encode([
                    'Discovered talents',
                    'Strengthened arts community'
                ]),
                'status' => 'pending',
                'proposal_category_id' => $categories->where('name', 'Social Transformation')->first()->id,
            ],
        ];

        // Create proposals and assign to specific users
        $userEmails = [
            'jokosaco@gmail.com',
            'juegos.milquicekets@yahoo.com',
            'canete.rayan99@gmail.com',
            'florida.lowella@gmail.com',
            'jaojao.eliott444.@gmail.com',
            'balasico.kim123@gmail.com',
            'federicos.kristine03@gmail.com',
            'jaojao.kymzairt@gmail.com',
            'cabilogan.nemuel@gmail.com',
            'user.cabcabon@test.com'
        ];
        
        $admin = User::where('email', 'sanchez.kris@gmail.com')->first();
        $userIndex = 0;
        
        foreach ($proposals as $proposal) {
            $status = $proposal['status'];
            
            // Get the next user in rotation
            $submitter = User::where('email', $userEmails[$userIndex % count($userEmails)])->first();
            $userIndex++;
            
            $proposalData = array_merge($proposal, [
                'submitted_by' => $submitter->id,
                'approved_by' => $status === 'approved' || $status === 'rejected' ? $admin->id : null,
                'created_at' => Carbon::now()->subDays(rand(1, 30)), // Random date within the last 30 days
                'updated_at' => Carbon::now()->subDays(rand(0, 5)), // Random date within the last 5 days
            ]);
            
            Proposal::create($proposalData);
        }
    }
} 