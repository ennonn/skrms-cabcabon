<?php

namespace Database\Seeders;

use App\Models\Records\PendingYouthProfile;
use App\Models\User;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class PendingYouthProfileSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('en_PH');
        $users = User::where('role', 'user')->get();

        // Create some entries based on real data format
        $realDataTemplates = [
            [
                'data_collection_agreement' => 'I understand that the information I submit through this form will be stored and processed accordingly. By registering, I consent to the storing and processing of my answers by the SK Barangay Cabcabon Committee on Secretariat and Officials.',
                'full_name' => 'Jaojao Richel Cabilogan',
                'address' => 'Purok 1A',
                'gender' => 'Female',
                'age' => 22,
                'birthdate' => '2001-02-17',
                'email' => 'richeljaojao@gmail.com',
                'phone' => '09151317908',
                'civil_status' => 'Single',
                'youth_age_group' => 'Core Youth (18 - 24 years old)',
                'education_level' => 'College Level',
                'youth_classification' => 'In school Youth',
                'work_status' => 'Unemployed',
                'is_sk_voter' => true,
                'is_registered_national_voter' => true,
                'voted_last_election' => true,
                'assembly_attendance' => 0,
                'assembly_absence_reason' => 'There was no KK assembly Meeting',
                'mother_name' => 'Jaojao, Estrelda Cabilogan',
                'father_name' => 'Jaojao, Renier Ochate',
                'parents_monthly_income' => 8000,
                'personal_monthly_income' => 1000,
                'suggested_programs' => 'Committee on Environment',
                'interests_hobbies' => 'Volleyball'
            ]
        ];

        foreach ($users as $user) {
            // Create 1-2 pending profiles for each user
            $count = $faker->numberBetween(1, 2);
            
            for ($i = 0; $i < $count; $i++) {
                $birthdate = $faker->dateTimeBetween('-30 years', '-15 years')->format('Y-m-d');
                $age = date_diff(date_create($birthdate), date_create('now'))->y;

                $profile = PendingYouthProfile::create([
                    'user_id' => $user->id,
                    'status' => 'pending',
                    'approver_id' => null,
                    'approval_notes' => null,
                    'form_submitted_at' => now(),
                    'data_collection_agreement' => 'I understand that the information I submit through this form will be stored and processed accordingly. By registering, I consent to the storing and processing of my answers by the SK Barangay Cabcabon Committee on Secretariat and Officials.',
                    'full_name' => $faker->name(),
                    'address' => $faker->address(),
                    'gender' => $faker->randomElement(['Male', 'Female']),
                    'birthdate' => $faker->dateTimeBetween('-24 years', '-15 years')->format('Y-m-d'),
                    'age' => $faker->numberBetween(15, 24),
                    'email' => $faker->email(),
                    'phone' => $faker->phoneNumber(),
                    'civil_status' => $faker->randomElement(['Single', 'Married', 'Widowed']),
                    'youth_age_group' => $faker->randomElement([
                        'Junior Youth (15 - 17 years old)',
                        'Core Youth (18 - 24 years old)',
                        'Senior Youth (25 - 30 years old)'
                    ]),
                    'personal_monthly_income' => $faker->randomFloat(2, 0, 10000),
                    'interests_hobbies' => $faker->randomElement([
                        'Volleyball',
                        'Basketball',
                        'Dancing',
                        'Singing',
                        'Drawing',
                        'Reading',
                        'Cooking'
                    ]),
                    'suggested_programs' => $faker->randomElement([
                        'Committee on Environment',
                        'Committee on Education',
                        'Committee on Sports',
                        'Committee on Health',
                        'Committee on Peace and Order'
                    ]),
                    'mother_name' => $faker->name('female'),
                    'father_name' => $faker->name('male'),
                    'parents_monthly_income' => $faker->randomFloat(2, 5000, 15000),
                    'education_level' => $faker->randomElement([
                        'Elementary Level',
                        'High School Level',
                        'College Level',
                        'Graduate Level'
                    ]),
                    'youth_classification' => $faker->randomElement([
                        'In school Youth',
                        'Out of school Youth',
                        'Working Youth'
                    ]),
                    'work_status' => $faker->randomElement(['Employed', 'Unemployed', 'Self-employed']),
                    'is_sk_voter' => $faker->boolean(80),
                    'is_registered_national_voter' => $faker->boolean(70),
                    'voted_last_election' => $faker->boolean(60),
                    'assembly_attendance' => $faker->optional(0.7)->numberBetween(0, 12),
                    'assembly_absence_reason' => $faker->optional(0.3)->sentence(),
                ]);
            }
        }

        // Create 10 additional entries with more realistic data
        for ($i = 0; $i < 10; $i++) {
            $template = $realDataTemplates[0];
            $birthdate = $faker->dateTimeBetween('-24 years', '-15 years')->format('Y-m-d');
            $age = $faker->numberBetween(15, 24);

            PendingYouthProfile::create([
                'user_id' => $users->random()->id,
                'status' => 'pending',
                'approver_id' => null,
                'approval_notes' => null,
                'form_submitted_at' => now(),
                'data_collection_agreement' => $template['data_collection_agreement'],
                'full_name' => $faker->name(),
                'address' => 'Purok ' . $faker->numberBetween(1, 5) . $faker->randomElement(['A', 'B', 'C']),
                'gender' => $faker->randomElement(['Male', 'Female']),
                'birthdate' => $birthdate,
                'age' => $age,
                'email' => $faker->email(),
                'phone' => '09' . $faker->numerify('########'),
                'civil_status' => $faker->randomElement(['Single', 'Married', 'Widowed']),
                'youth_age_group' => $faker->randomElement([
                    'Junior Youth (15 - 17 years old)',
                    'Core Youth (18 - 24 years old)',
                    'Senior Youth (25 - 30 years old)'
                ]),
                'personal_monthly_income' => $faker->randomFloat(2, 0, 10000),
                'interests_hobbies' => $faker->randomElement([
                    'Volleyball',
                    'Basketball',
                    'Dancing',
                    'Singing',
                    'Drawing',
                    'Reading',
                    'Cooking'
                ]),
                'suggested_programs' => $faker->randomElement([
                    'Committee on Environment',
                    'Committee on Education',
                    'Committee on Sports',
                    'Committee on Health',
                    'Committee on Peace and Order'
                ]),
                'mother_name' => $faker->name('female'),
                'father_name' => $faker->name('male'),
                'parents_monthly_income' => $faker->randomFloat(2, 5000, 15000),
                'education_level' => $faker->randomElement([
                    'Elementary Level',
                    'High School Level',
                    'College Level',
                    'Graduate Level'
                ]),
                'youth_classification' => $faker->randomElement([
                    'In school Youth',
                    'Out of school Youth',
                    'Working Youth'
                ]),
                'work_status' => $faker->randomElement(['Employed', 'Unemployed', 'Self-employed']),
                'is_sk_voter' => $faker->boolean(80),
                'is_registered_national_voter' => $faker->boolean(70),
                'voted_last_election' => $faker->boolean(60),
                'assembly_attendance' => $faker->optional(0.7)->numberBetween(0, 12),
                'assembly_absence_reason' => $faker->optional(0.3)->sentence(),
            ]);
        }
    }

    private function createFromZapierData(User $user, User $admin): void
    {
        $zapierData = [
            [
                'status' => 'pending',
                'full_name' => 'John Doe Smith',
                'address' => 'Purok 1A',
                'gender' => 'Male',
                'birthdate' => '2000-01-01',
                'age' => 24,
                'email' => 'john.doe@example.com',
                'phone' => '09123456789',
                'civil_status' => 'Single',
                'youth_age_group' => 'Core Youth (18 - 24 years old)',
                'personal_monthly_income' => 5000.00,
                'interests_hobbies' => 'Basketball',
                'suggested_programs' => 'Committee on Sports',
                'mother_name' => 'Jane Doe',
                'father_name' => 'James Doe',
                'parents_monthly_income' => 15000.00,
                'education_level' => 'College Level',
                'youth_classification' => 'In school Youth',
                'work_status' => 'Self-employed',
                'is_sk_voter' => true,
                'is_registered_national_voter' => true,
                'voted_last_election' => true,
                'assembly_attendance' => 5,
                'assembly_absence_reason' => null,
            ],
            [
                'status' => 'pending',
                'full_name' => 'Jane Smith Brown',
                'address' => 'Purok 2B',
                'gender' => 'Female',
                'birthdate' => '2005-06-15',
                'age' => 18,
                'email' => 'jane.smith@example.com',
                'phone' => '09987654321',
                'civil_status' => 'Single',
                'youth_age_group' => 'Junior Youth (15 - 17 years old)',
                'personal_monthly_income' => 0.00,
                'interests_hobbies' => 'Volleyball',
                'suggested_programs' => 'Committee on Education',
                'mother_name' => 'Mary Smith',
                'father_name' => 'Robert Smith',
                'parents_monthly_income' => 25000.00,
                'education_level' => 'High School Level',
                'youth_classification' => 'In school Youth',
                'work_status' => 'Unemployed',
                'is_sk_voter' => false,
                'is_registered_national_voter' => false,
                'voted_last_election' => false,
                'assembly_attendance' => 0,
                'assembly_absence_reason' => 'School commitments',
            ],
        ];

        foreach ($zapierData as $data) {
            $profile = PendingYouthProfile::create([
                'user_id' => $user->id,
                'status' => $data['status'],
                'approver_id' => null,
                'approval_notes' => null,
                'form_submitted_at' => now(),
                'data_collection_agreement' => 'I understand that the information I submit through this form will be stored and processed accordingly. By registering, I consent to the storing and processing of my answers by the SK Barangay Cabcabon Committee on Secretariat and Officials.',
                'full_name' => $data['full_name'],
                'address' => $data['address'],
                'gender' => $data['gender'],
                'birthdate' => $data['birthdate'],
                'age' => $data['age'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'civil_status' => $data['civil_status'],
                'youth_age_group' => $data['youth_age_group'],
                'personal_monthly_income' => $data['personal_monthly_income'],
                'interests_hobbies' => $data['interests_hobbies'],
                'suggested_programs' => $data['suggested_programs'],
                'mother_name' => $data['mother_name'],
                'father_name' => $data['father_name'],
                'parents_monthly_income' => $data['parents_monthly_income'],
                'education_level' => $data['education_level'],
                'youth_classification' => $data['youth_classification'],
                'work_status' => $data['work_status'],
                'is_sk_voter' => $data['is_sk_voter'],
                'is_registered_national_voter' => $data['is_registered_national_voter'],
                'voted_last_election' => $data['voted_last_election'],
                'assembly_attendance' => $data['assembly_attendance'],
                'assembly_absence_reason' => $data['assembly_absence_reason'],
            ]);

            // If you want to create approved records as well, you can add that logic here
            if ($profile->status === 'approved') {
                $this->createApprovedRecord($profile, $admin);
            }
        }
    }
} 