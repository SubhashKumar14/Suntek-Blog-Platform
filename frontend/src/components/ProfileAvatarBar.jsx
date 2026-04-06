import { NavLink } from "react-router";
import { useAuth } from "../store/authStore";

function ProfileAvatarBar() {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const user = useAuth((state) => state.currentUser);

  if (!isAuthenticated || !user) {
    return null;
  }

  const getProfilePath = () => {
    switch (user.role) {
      case "AUTHOR":
        return "/author-profile";
      case "ADMIN":
        return "/admin-profile";
      default:
        return "/user-profile";
    }
  };

  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "U";

  return (
    <div className="w-full mt-2 px-3 sm:px-6 flex justify-end">
      <NavLink
        to={getProfilePath()}
        className="block rounded-full"
        aria-label="Open profile"
      >
        {user.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt="Profile avatar"
            className="w-14 h-14 rounded-full border-4 border-black object-cover"
          />
        ) : (
          <div className="w-14 h-14 rounded-full border-4 border-black bg-blue-500 text-white font-black flex items-center justify-center text-lg">
            {initials}
          </div>
        )}
      </NavLink>
    </div>
  );
}

export default ProfileAvatarBar;