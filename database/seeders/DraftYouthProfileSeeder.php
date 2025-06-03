<?php

namespace Database\Seeders;

use App\Models\Records\PendingYouthProfile;
use App\Models\User;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class DraftYouthProfileSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('en_PH');
        $users = User::where('role', 'user')->get();

        foreach ($users as $user) {
            // Create 2-3 draft profiles for each user
            $count = $faker->numberBetween(2, 3);
            
            for ($i = 0; $i < $count; $i++) {
                $profile = PendingYouthProfile::create([
                    'user_id' => $user->id,
                    'status' => 'draft',
                    'approver_id' => null,
                    'approval_notes' => null,
                    'data_collection_agreement' => 'I understand that the information I submit through this form will be stored and processed accordingly. By registering, I consent to the storing and processing of my answers by the SK Barangay Cabcabon Committee on Secretariat and Officials.',
                    'full_name' => $faker->name(),
                    'address' => 'Purok ' . $faker->numberBetween(1, 5) . $faker->randomElement(['A', 'B', 'C']),
                    'gender' => $faker->randomElement(['Male', 'Female']),
                    'birthdate' => $faker->dateTimeBetween('-24 years', '-15 years')->format('Y-m-d'),
                    'age' => $faker->numberBetween(15, 24),
                    'email' => $faker->email(),
                    'phone' => '09' . $faker->numerify('########'),
                    'civil_status' => $faker->randomElement([
                        'Single', 
                        'Married', 
                        'Widowed',
                        'Divorced',
                        'Separated',
                        'Annulled',
                        'Live-in',
                        'Unknown'
                    ]),
                    'youth_age_group' => $faker->randomElement([
                        'Child Youth (15 - 17 years old)',
                        'Core Youth (18 - 24 years old)',
                        'Young Adult (25 - 30 years old)'
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
                        'Elementary Graduate',
                        'High School Level',
                        'High School Graduate',
                        'Vocational Graduate',
                        'College Level',
                        'College Graduate',
                        'Masters Level',
                        'Masters Graduate',
                        'Doctorate Level',
                        'Doctorate Graduate'
                    ]),
                    'youth_classification' => $faker->randomElement([
                        'In school Youth',
                        'Out of School Youth',
                        'Working Youth',
                        'PWD',
                        'Children in conflict with the law',
                        'Indigenous People'
                    ]),
                    'work_status' => $faker->randomElement([
                        'Employed',
                        'Unemployed',
                        'Self-employed',
                        'Currently Looking for a Job',
                        'Not interested in looking for a job'
                    ]),
                    'is_sk_voter' => $faker->boolean(80),
                    'is_registered_national_voter' => $faker->boolean(70),
                    'voted_last_election' => $faker->boolean(60),
                    'assembly_attendance' => $faker->optional(0.7)->numberBetween(0, 12),
                    'assembly_absence_reason' => $faker->optional(0.3)->sentence(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
} 