import type { Models } from "appwrite";
import { Button } from "../ui/button";
import { Link } from "react-router";

type UserCardProps = {
  user: Models.Document;
};

const UserCard = ({ user }: UserCardProps) => {
  return (
    <Link to={`/profile/${user.$id}`} className="user-card">
      <img
        src={user.imageUrl || "/assets/profile-default-avatar.svg"}
        alt="creator"
        className="rounded-full w-14 h-14"
      />

      <div className="flex-col gap-1 flex-center">
        <p className="text-center base-medium line-clamp-1">{user.name}</p>
        <p className="text-center small-regular text-muted-foreground line-clamp-1">
          @{user.username}
        </p>
      </div>

      <Button type="button" size="sm">
        Follow
      </Button>
    </Link>
  );
};

export default UserCard;
