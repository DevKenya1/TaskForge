<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskTest extends TestCase
{
    use RefreshDatabase;

    public function test_project_owner_can_create_task(): void
    {
        $user = User::factory()->create();
        $project = Project::create(['name' => 'Test Project', 'owner_id' => $user->id]);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson("/api/projects/{$project->id}/tasks", [
                'title' => 'First Task',
                'status' => 'todo',
            ]);

        $response->assertStatus(201)
            ->assertJsonFragment(['title' => 'First Task']);
    }

    public function test_non_member_cannot_create_task(): void
    {
        $owner = User::factory()->create();
        $outsider = User::factory()->create();
        $project = Project::create(['name' => 'Test Project', 'owner_id' => $owner->id]);

        $response = $this->actingAs($outsider, 'sanctum')
            ->postJson("/api/projects/{$project->id}/tasks", [
                'title' => 'Sneaky Task',
            ]);

        $response->assertStatus(403);
    }

    public function test_task_status_can_be_updated(): void
    {
        $user = User::factory()->create();
        $project = Project::create(['name' => 'Test Project', 'owner_id' => $user->id]);
        $task = $project->tasks()->create(['title' => 'Task One', 'status' => 'todo']);

        $response = $this->actingAs($user, 'sanctum')
            ->putJson("/api/projects/{$project->id}/tasks/{$task->id}", [
                'status' => 'done',
            ]);

        $response->assertStatus(200)
            ->assertJsonFragment(['status' => 'done']);
    }
}