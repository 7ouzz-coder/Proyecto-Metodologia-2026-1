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
    <div class="input m-1 form-group">
      <label for="swal2-input${inputId}" class="label">${label}</label>  
      <input 
        id="swal2-input${inputId}" 
        placeholder="${label}" 
        value="${value ?? ""}">
    </div>
  `;
};

export const createSwalTextarea = (inputId, label, value) => {
  return `
    <legend for="swal2-input${inputId}" class="fieldset-legend center content-center">
      ${label}
    </legend>
    <div class="textarea-container m-1 form-group center content-center justify-center align-center center-items">
      <fieldset class="fieldset">
        <textarea 
          class="textarea h-24" 
          id="swal2-input${inputId}" 
          placeholder="${value ?? ""}">
        </textarea>
      </fieldset> 
    </div>
  `;
};

export const createSwalDateField = (inputId, label, value = "") => {
  return `
    <label class="input m-1">
      <span class="label">${label}</span>
      <input 
        type="date" 
        id="swal2-input${inputId}" 
        value="${value ?? ""}" />
    </label>
  `;
};