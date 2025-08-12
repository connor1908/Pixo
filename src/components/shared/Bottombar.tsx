import { bottombarLinks } from "@/constants/constants";
import type { INavLink } from "@/types/types";
import { NavLink } from "react-router";

function Bottombar() {
  return (
    <section className="bottom-bar">
      {bottombarLinks.map((link: INavLink) => {
        const Icon = link.icon;
        return (
          <NavLink
            key={link.label}
            className={({ isActive }) =>
              `flex-center flex-col rounded-lg items-center gap-1 p-2 transition ${
                isActive ? "bg-primary" : "hover:bg-secondary"
              }`
            }
            to={link.route}
          >
            {<Icon size={20} />}
            <span className="hidden xs:block">{link.label}</span>
          </NavLink>
        );
      })}
    </section>
  );
}

export default Bottombar;
