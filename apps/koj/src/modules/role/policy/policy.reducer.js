export const policyInitialState = {
  editingKey: '',
  isEditingFromCreate: false,
  policies: [],
};

export function policyReducer(state, { type, payload }) {
  switch (type) {
    case 'setPolicy':
      state.policies = payload.policy;
      return;

    case 'addPolicy':
      state.policies.unshift(payload.policy);
      state.isEditingFromCreate = true;
      state.editingKey = payload.policy.id;
      return;

    case 'removePolicy':
      state.policies.splice(payload.policy.id, 1);
      state.isEditingFromCreate = false;
      state.editingKey = '';
      return;

    case 'editPolicy':
      state.editingKey = payload.policy.id;
      return;

    case 'savePolicy': {
      console.log(payload);
      const index = state.policies.findIndex(
        (policy) => policy.id === payload.oldId
      );
      if (index > -1) state.policies[index] = payload.policy;
      else state.policies.unshift(payload.policy);
      state.editingKey = '';
      return;
    }

    case 'resetEditingState':
      state.isEditingFromCreate = false;
      state.editingKey = '';
      return;

    default:
      return;
  }
}
