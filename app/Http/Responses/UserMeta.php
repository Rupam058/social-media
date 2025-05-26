<?php

namespace App\Http\Responses;

class UserMeta {
    public string $id;
    public string $username;
    public string $name;
    public string|null $avatar;
    public string|null $banner;

    public function __construct(
        string $id,
        string $username,
        string $name,
        string | null $avatar,
        string | null $banner = null
    ) {
        $this->id = $id;
        $this->username = $username;
        $this->name = $name;
        $this->avatar = $avatar;
        $this->banner = $banner;
    }

    public static function fromJson(array $json): UserMeta {
        return new UserMeta(
            id: $json["id"] ?? '',
            username: $json["username"] ?? '',
            name: $json["name"] ?? '',
            avatar: $json["avatar"] ?? null,
            banner: $json["banner"] ?? null
        );
    }

    public function toJson(): array {
        return [
            "id" => $this->id,
            "username" => $this->username,
            "name" => $this->name,
            "avatar" => $this->avatar,
            "banner" => $this->banner
        ];
    }
}
