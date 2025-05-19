<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateFollowRequest;
use App\Http\Responses\FollowResponse;
use App\Services\FollowService;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FollowController extends Controller {
    public function __construct(protected FollowService $followService, protected UserService $userService) {
    }

    public function getfollows() {
        $follows = $this->followService->getFollowsFrom(userId: Auth::id());
        $res = [];

        foreach ($follows as $follow) {
            array_push($res, new FollowResponse(
                follow: $follow,
                user: $this->userService->getUserMetaById($follow->to_id)
            ));
        }

        return $res;
    }

    public function createFollow(CreateFollowRequest $req) {
        $validated = $req->validated();
        $to_id = $validated['to_id'];

        $follow = $this->followService->createFollow(
            fromId: Auth::id(),
            toId: $to_id
        );

        if ($follow == null) {
            return response()->json(["error" => "You are already following this user!"], 400);
        }

        return $follow;
    }

    public function getFollow(string $toUser) {
        $followId = $this->followService->userFollowsUser(Auth::id(), $toUser);
        if ($followId == null) {
            return response("", status: 404);
        }

        return response()->json([
            "follow_id" => $followId
        ], status: 200);
    }

    public function deleteFollow(string $id) {
        $follow = $this->followService->deleteFollow(
            fromId: Auth::id(),
            followId: $id
        );

        if ($follow) {
            return response()->noContent(status: 200);
        } else {
            return response()->json(["error" => "You are not following"], 404);
        }
    }
}
