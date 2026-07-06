import axios from './root.service.js';

export async function createPlanService(planData) {
  try {
    const response = await axios.post("/planes", planData);
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export async function updatePlanService(id_plan, planData) {
  try {
    const response = await axios.put(`/planes/${id_plan}`, planData);
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export async function deletePlanService(id_plan) {
  try {
    const response = await axios.delete(`/planes/${id_plan}`);
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export async function EditarPlanStatusService(id_plan, estado) {
  try {
    const response = await axios.patch(`/planes/${id_plan}/estado`, { estado });
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export async function getPlanesService() {
  try {
    const response = await  axios.get("/planes");
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
}
