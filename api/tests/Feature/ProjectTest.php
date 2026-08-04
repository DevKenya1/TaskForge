<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_create_project(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/projects', [
            'name' => 'My Project',
            'description' => 'A test project',
        ]);

        $response->assertStatus(201)
            ->assertJsonFragment(['name' => 'My Project', 'owner_id' => $user->id]);
    }

    public function test_guest_cannot_create_project(): void
    {
        $response = $this->postJson('/api/projects', [
            'name' => 'My Project',
        ]);

        $response->assertStatus(401);
    }

    public function test_user_cannot_update_project_they_do_not_own(): void
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();

        $project = Project::create([
            'name' => 'Owner Project',
            'owner_id' => $owner->id,
        ]);

        $response = $this->actingAs($otherUser, 'sanctum')
            ->putJson("/api/projects/{$project->id}", ['name' => 'Hacked']);

        $response->assertStatus(403);
    }
}