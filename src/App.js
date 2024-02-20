import { useState } from "react";
import Checkbox from "./Checkbox";

function App() {
  const [value, setValue] = useState("");
  const [selectRole, setSelectRole] = useState("");
  const [users, setUsers] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);

  const handleChange = (e) => {
    setValue(e.target.value);
  };
  const handleSelect = (e) => {
    setSelectRole(e.target.value);
    setIsDisabled(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response =
      selectRole === "User"
        ? await fetch(
            `https://api.github.com/search/users?q=${value}+type:user`
          )
        : await fetch(
            `https://api.github.com/search/users?q=${value}+type:org`
          );

    const data = await response.json();
    const users = data.items;
    // console.log(users);
    setUsers(users);
    setValue('');
  };
  return (
    <div>
      <div className="flex justify-between items-center border-b-2 py-6 px-4 bg-slate-200 gap-10">
        <h1 className="flex-none text-3xl font-semibold ">
          GitHub Search Engine
        </h1>
        <form
          onSubmit={handleSubmit}
          className="flex justify-between items-center"
        >
          <div>
            <p>Select a role to search for:</p>
            <div className="flex justify-between items-center gap-10 mr-8">
              <Checkbox
                label="User"
                selectRole={selectRole}
                handleSelect={handleSelect}
              />
              <Checkbox
                label="Organization"
                selectRole={selectRole}
                handleSelect={handleSelect}
              />
            </div>
          </div>
          <input
            type="text"
            placeholder="Search for a user or organization"
            value={value}
            onChange={handleChange}
            disabled={isDisabled}
            className="bg-gray-50 disabled:bg-slate-200 disabled:placeholder:text-gray-400 disabled:cursor-not-allowed border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mr-2 w-60"
            required
          />
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 disabled:bg-slate-500 disabled:placeholder:text-gray-400 disabled:cursor-not-allowed focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            disabled={isDisabled}
          >
            Search
          </button>
        </form>
      </div>
      <ul className="mt-8 mx-4">
        {selectRole === "User" && users.length > 0  ? (
          <h1 className="text-2xl font-semibold">{users.length} users found</h1>
        ) : selectRole === "Organization" && users.length > 0 ? (
          <h1 className="text-2xl font-semibold">
            {users.length} organizations found
          </h1>
        ) : (
          <h1 className="text-2xl font-italic italic text-center mt-20">
            Search for a user or organization...
          </h1>
        )}
        {users?.map((user) => (
          <li key={user.id} className="flex gap-4 m-4 items-center ">
            <img
              src={user.avatar_url}
              alt={user.login}
              className="h-16 w-16 rounded-full"
            />
            <a href={user.html_url} className="text-2xl font-medium">
              {user.login}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
