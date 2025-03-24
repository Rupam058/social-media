<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateFollowRequest;
use App\Services\FollowService;
use Illuminate\Http\Request;

class FollowController extends Controller {
    public function __construct(protected FollowService $followService) {
    }

    public function getfollows() {
        $follows = $this->followService->getFollowsFrom(userId: '0195b937-5c21-7329-9d86-e756299e6448');

        return $follows;
    }

    public function createFollow(CreateFollowRequest $req) {
        $validated = $req->validated();
        $to_id = $validated['to_id'];

        $follow = $this->followService->createFollow(fromId: '0195b937-5c21-7329-9d86-e756299e6448', toId: $to_id);

        if ($follow == null) {
            return response()->json(["error" => "You are already following this user!"], 400);
        }

        return $follow;
    }

    public function deleteFollow(string $id) {
        $follow = $this->followService->deleteFollow(fromId: '0195b937-5c21-7329-9d86-e756299e6448', toId: $id);

        if ($follow) {
            return response()->noContent(status: 200);
        } else {
            return response()->json(["error" => "You are not following"], 404);
        }
    }
}
