export const createSwalField_OLD = (inputId, label, value) => {
  return `
        <div class="input m-1 form-group">
            <label for="swal2-input${Number(inputId)}" class="label">${label}</label>  
            <input id="swal2-input${Number(inputId)}" placeholder="${label}" value="${value}"></input>
        </div>        
    `
}

export const createSwalDateField_OLD = (inputId, label, value) => {
  return `
    <label class="input m-1">
        <span class="label">${label}</span>
        <input type="date" id="swal2-input${Number(inputId)}" value="${value || getToday()}" />
    </label>
    `
};

export const createSwalField = (inputId, label, value) => {
  return `
    <div class="mb-3 text-left">
      <label for="swal2-input${inputId}" class="block text-sm font-medium text-gray-700 mb-1">${label}</label>  
      <input 
        id="swal2-input${inputId}" 
        class="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white"
        placeholder="${label}" 
        value="${value ?? ""}">
    </div>
  `;
};

export const createSwalTextarea = (inputId, label, value) => {
  return `
    <div class="mb-3 text-left">
      <label for="swal2-input${inputId}" class="block text-sm font-medium text-gray-700 mb-1">${label}</label>  
      <textarea 
        id="swal2-input${inputId}" 
        class="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white h-24"
        placeholder="${label}">${value ?? ""}</textarea>
    </div>
  `;
};

export const createSwalDateField = (inputId, label, value = "") => {
  return `
    <div class="mb-3 text-left">
      <label for="swal2-input${inputId}" class="block text-sm font-medium text-gray-700 mb-1">${label}</label>  
      <input 
        type="date" 
        id="swal2-input${inputId}" 
        class="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white"
        value="${value ?? ""}" />
    </div>
  `;
};