import { NavLink, Outlet } from "react-router";

function AuthorProfile() {
  return (
    <div className="bg-yellow-50 p-6 mt-6 font-serif border-4 border-blue-500 rounded-xl max-w-5xl mx-auto min-h-screen">
      
      {/* Author Navigation */}
      <div className="flex gap-4 mb-4 bg-gray-200 p-5 justify-center border-b-4 border-red-400">

        <NavLink
          to="articles"
          className={({ isActive }) =>
            isActive 
              ? "bg-green-400 text-black px-6 py-3 text-2xl font-extrabold border-4 border-black rounded-md" 
              : "bg-blue-600 text-white px-6 py-3 text-xl font-bold rounded-md hover:bg-blue-700"
          }
        >
          Articles
        </NavLink>

        <NavLink
          to="write-article"
          className={({ isActive }) =>
            isActive 
              ? "bg-green-400 text-black px-6 py-3 text-2xl font-extrabold border-4 border-black rounded-md" 
              : "bg-blue-600 text-white px-6 py-3 text-xl font-bold rounded-md hover:bg-blue-700"
          }
        >
          Write Article
        </NavLink>

      </div>

      <div className="h-2 w-full bg-orange-500 my-8"></div>

      {/* Nested route content */}
      <Outlet />

    </div>
  );
}

export default AuthorProfile;