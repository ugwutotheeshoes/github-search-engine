import { useEffect, useState } from "react";
import Radio from "./Radio";
import Loader from "./Loader";
import useDebounce from "./useDebounce";
import { useNavigate, useLocation } from "react-router-dom";

function Engine() {
  const [value, setValue] = useState("");
  const [selectRole, setSelectRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get("q");
  const roleQuery = new URLSearchParams(location.search).get("type");

  const user = selectRole === "User" ? "user" : "org";

  const handleChange = (e) => {
    // navigate(`/search/?q=${debounceSearch}+type:${user}`);
    setValue(e.target.value);
    console.log("change");
  };
  const handleSelect = (e) => {
    setSelectRole(e.target.value);
    console.log("select");
    setIsDisabled(false);
  };
  const debounceSearch = useDebounce(value, 1000);

  useEffect(() => {
    function Data() {
      setLoading(true);
      console.log("submit");
      const user = selectRole === "User" ? "user" : "org";
      const url = `https://api.github.com/search/users?q=${debounceSearch}+type:${user}`;
      const response = fetch(url);
      response
        .then((res) => res.json())
        .then((data) => {
          const users = data.items;
          setUsers(users);
          setLoading(false);
          navigate(`/search/?q=${debounceSearch}+type:${user}`);
          console.log(searchQuery);
          console.log(roleQuery);
          if (window.location.reload && searchQuery) {
            setSelectRole(user);
            setValue(debounceSearch);
          }
          // setValue("");
        })
        .catch(() => {
          setErrorMessage("No results found");
          // setIsDisabled(true);
          setLoading(false);
        });
    }
    if (debounceSearch) Data();
  }, [debounceSearch]);

  // const handleSubmit = () => {
  //   // e.preventDefault();

  // };

  const renderUser = (
    <div>
      <div className="mx-4 mt-8">
        {users[0]?.type === "User" ? (
          <h1 className="text-2xl font-semibold">{users.length} users found</h1>
        ) : users[0]?.type === "Organization" ? (
          <h1 className="text-2xl font-semibold">
            {users.length} organizations found
          </h1>
        ) : (
          <h1 className="mt-20 text-2xl italic text-center font-italic">
            Search for a user or organization...
          </h1>
        )}
      </div>
      {users?.map((user) => (
        <div key={user.id} className="flex items-center gap-4 m-4 ">
          <img
            src={user.avatar_url}
            alt={user.login}
            className="w-16 h-16 rounded-full"
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
      <div className="flex items-center justify-between gap-10 px-4 py-6 border-b-2 bg-slate-200">
        <h1 className="flex-none text-3xl font-semibold ">
          GitHub Search Engine
        </h1>
        {/* <form
          onSubmit={handleSubmit}
          className="flex items-center justify-between"
        > */}
        <div className="flex items-center justify-between gap-20 mr-8">
          <div>
            <p>Select a role to search for:</p>
            <div className="flex items-center justify-between gap-10 mr-8">
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
            className="bg-gray-50 disabled:bg-slate-200 disabled:placeholder:text-gray-400 disabled:cursor-not-allowed border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mr-2 w-80"
            required
          />
        </div>
        {/* <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 disabled:bg-slate-500 disabled:placeholder:text-gray-400 disabled:cursor-not-allowed focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            disabled={isDisabled}
          >
            Search
          </button>
        </form> */}
      </div>
      {loading ? <Loader /> : renderUser}
      {errorMessage && (
        <div className="mt-20 text-2xl italic text-center font-italic">
          {errorMessage}
        </div>
      )}
    </div>
  );
}

export default Engine;
