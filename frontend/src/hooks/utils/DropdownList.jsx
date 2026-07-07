export const DropdownList = (className, data, label, id) => {
    return (
        <select className={`w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white ${className || ''}`} id={id}>
            <option disabled selected>{label}</option>
            {Array.isArray(data) && data.map((name) => {
                return (
                    <option>{String(name)}</option>
                );
            })}
        </select>
    );
}

export const StaticDropdownList = (data, label, id, className, disabled) => {
    return `
        <div class="mb-3 text-left">
            <label for="${id}" class="block text-sm font-medium text-gray-700 mb-1">${label}</label>
            <select id="${id}" class="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white ${className || ''}" ${disabled ? "disabled" : ""}>
                <option value="" disabled selected>${label}</option>
                ${Array.isArray(data) ? data.map(element => `<option value="${element}">${String(element)}</option>`).join("") : ""}
            </select>
        </div>
    `;
}