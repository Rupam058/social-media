<?php

namespace App\Http\Responses;

class ProfileResponse {
    public string $id;
    public string $username;
    public string $name;
    public string|null $description;
    public string|null $avatar;
    public string|null $banner;

    public function __construct(
        string $id,
        string $username,
        string $name,
        string|null $avatar,
        string|null $description,
        string|null $banner = null
    ) {
        $this->id = $id;
        $this->username = $username;
        $this->name = $name;
        $this->description = $description;
        $this->avatar = $avatar;
        $this->banner = $banner;
    }
}
