export const DropdownList = (className, data, label, id) => {
    return (
        <select className={`select ${className}`} id={id}>
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
        <select class="select ${className}" id=${id}>
            <option ${disabled ? "disabled" : ""} selected>${label}</option>
            ${Array.isArray(data) && data.map((element) => {
                return `<option>${String(element)}</option>`
            }).join(" ")}
        </select>
    `
}