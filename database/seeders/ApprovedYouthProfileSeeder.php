<?php

namespace Database\Seeders;

use App\Models\Records\YouthProfileRecord;
use App\Models\Records\PersonalInformation;
use App\Models\Records\FamilyInformation;
use App\Models\Records\EngagementData;
use App\Models\User;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class ApprovedYouthProfileSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('en_PH');
        $users = User::where('role', 'user')->get();
        $admins = User::whereIn('role', ['admin', 'superadmin'])->get();

        foreach ($users as $user) {
            // Create 1-2 approved profiles for each user
            $count = $faker->numberBetween(1, 2);
            
            for ($i = 0; $i < $count; $i++) {
                $birthdate = $faker->dateTimeBetween('-24 years', '-15 years')->format('Y-m-d');
                $age = $faker->numberBetween(15, 24);

                // Create the main record
                $record = YouthProfileRecord::create([
                    'user_id' => $user->id,
                    'approver_id' => $admins->random()->id,
                    'approval_notes' => $faker->optional()->sentence(),
                ]);

                // Create personal information
                PersonalInformation::create([
                    'youth_profile_record_id' => $record->id,
                    'form_submitted_at' => now(),
                    'data_collection_agreement' => 'I understand that the information I submit through this form will be stored and processed accordingly. By registering, I consent to the storing and processing of my answers by the SK Barangay Cabcabon Committee on Secretariat and Officials.',
                    'full_name' => $faker->name(),
                    'address' => 'Purok ' . $faker->numberBetween(1, 5) . $faker->randomElement(['A', 'B', 'C']),
                    'gender' => $faker->randomElement(['male', 'female', 'other']),
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
                    'suggested_programs' => $faker->sentence(),
                ]);

                // Create family information
                FamilyInformation::create([
                    'youth_profile_record_id' => $record->id,
                    'mother_name' => $faker->name('female'),
                    'father_name' => $faker->name('male'),
                    'parents_monthly_income' => $faker->randomFloat(2, 5000, 15000),
                ]);

                // Create engagement data
                EngagementData::create([
                    'youth_profile_record_id' => $record->id,
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
                    'has_attended_assembly' => $faker->boolean(70),
                    'assembly_attendance' => $faker->optional(0.7)->numberBetween(0, 12),
                    'assembly_absence_reason' => $faker->optional(0.3)->sentence(),
                    'suggested_programs' => $faker->randomElement([
                        'Committee on Environment',
                        'Committee on Education',
                        'Committee on Sports',
                        'Committee on Health',
                        'Committee on Peace and Order'
                    ]),
                ]);
            }
        }
    }
} 