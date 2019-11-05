export function updateFirstLastName(state: any, payload: any) {
  return {
    ...state,
    yourDetails: {
      ...state.yourDetails,
      ...payload,
    },
  };
}
