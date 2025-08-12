import { sidebarLinks } from "@/constants/constants";
import { useUserContext } from "@/context/AuthContext";
import { useSignOutAccount } from "@/services/react-query/queriesAndMutations";
import type { INavLink } from "@/types/types";
import { useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { Button } from "../ui/button";
import { RiLogoutBoxLine } from "react-icons/ri";

function LeftSideBar() {
  const { user } = useUserContext();
  const { mutate: signOut, isSuccess, isPending } = useSignOutAccount();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      navigate("/sign-in", { replace: true }); // reloads the page
    }
  }, [isSuccess, navigate]);

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-10">
        <Link to="/" className="flex items-center justify-center gap-3">
          <img src="/assets/logo.png" width={110} alt="logo" />
        </Link>

        <Link to={`/profile/${user.id}`} className="flex items-center gap-3">
          <img
            src={user.imageUrl || "/assets/profile-default-avatar.svg"}
            alt="user image"
            className="rounded-full w-14 h-14"
          />
          <div className="flex flex-col">
            <p>{user.name}</p>
            <p className="text-muted-foreground">{`@${user.username}`}</p>
          </div>
        </Link>

        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link: INavLink) => {
            const Icon = link.icon;
            return (
              <li key={link.label}>
                <NavLink
                  className={({ isActive }) =>
                    `leftsidebar-link flex items-center gap-4 p-4 ${
                      isActive ? "bg-primary" : "hover:bg-secondary"
                    }`
                  }
                  to={link.route}
                >
                  {<Icon size={20} />}
                  <span>{link.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
      <Button
        className="flex items-center justify-start gap-4"
        variant="link"
        disabled={isPending}
        onClick={() => signOut()}
      >
        <RiLogoutBoxLine className="w-6 h-6" />
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
    </nav>
  );
}

export default LeftSideBar;
