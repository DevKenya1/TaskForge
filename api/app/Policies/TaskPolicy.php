<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;

class TaskPolicy
{
    protected function hasAccess(User $user, Task $task): bool
    {
        $project = $task->project;

        return $project->owner_id === $user->id
            || $project->members()->where('user_id', $user->id)->exists();
    }

    public function view(User $user, Task $task): bool
    {
        return $this->hasAccess($user, $task);
    }

    public function update(User $user, Task $task): bool
    {
        return $this->hasAccess($user, $task);
    }

    public function delete(User $user, Task $task): bool
    {
        return $task->project->owner_id === $user->id;
    }
}