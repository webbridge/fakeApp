import { fakeQuery } from "../fakeApi/fakeQuery";
import { fakeMutation } from "../fakeApi/fakeMutation";

const apiService = {
  get: fakeQuery,
  post: fakeMutation
};

export default apiService;
