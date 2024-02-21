const Radio = ({ label, selectRole, handleSelect }) => {
  return (
    <div>
      <label className="flex items-center justify-center gap-2">
        <input
          type="radio"
          value={label}
          onChange={handleSelect}
          checked={selectRole === label}
        />
        <span>{label}</span>
      </label>
    </div>
  );
};
export default Radio;
