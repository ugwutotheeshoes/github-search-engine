import { useState } from "react";
import Radio from "./Radio";
import Loader from "./Loader";

function App() {
  const [value, setValue] = useState("");
  const [selectRole, setSelectRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setValue(e.target.value);
  };
  const handleSelect = (e) => {
    setSelectRole(e.target.value);
    setIsDisabled(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const response =
      selectRole === "User"
        ? fetch(`https://api.github.com/search/users?q=${value}+type:user`)
        : fetch(`https://api.github.com/search/users?q=${value}+type:org`);
    response
      .then((res) => res.json())
      .then((data) => {
        const users = data.items;
        setUsers(users);
        setLoading(false);
        setIsDisabled(true);
        setValue("");
      })
      .catch(() => {
        setErrorMessage("No results found");
        setIsDisabled(true);
        setLoading(false);
      });
  };

  const renderUser = (
    <div>
      <div className="mt-8 mx-4">
        {users[0]?.type === "User" ? (
          <h1 className="text-2xl font-semibold">{users.length} users found</h1>
        ) : users[0]?.type === "Organization" ? (
          <h1 className="text-2xl font-semibold">
            {users.length} organizations found
          </h1>
        ) : (
          <h1 className="text-2xl font-italic italic text-center mt-20">
            Search for a user or organization...
          </h1>
        )}
      </div>
      {users?.map((user) => (
        <div key={user.id} className="flex gap-4 m-4 items-center ">
          <img
            src={user.avatar_url}
            alt={user.login}
            className="h-16 w-16 rounded-full"
          />
          <a href={user.html_url} className="text-2xl font-medium">
            {user.login}
          </a>
        </div>
      ))}
    </div>
  );
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
              <Radio
                label="User"
                selectRole={selectRole}
                handleSelect={handleSelect}
              />
              <Radio
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
      {loading ? <Loader /> : renderUser}
      {errorMessage && <div className="text-2xl font-italic italic text-center mt-20">{errorMessage}</div>}
    </div>
  );
}

export default App;
