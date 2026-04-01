import React from 'react';

function OnboardingStatus({ state }) {
  const stateClass = `onboarding-${state.toLowerCase()}`;
  return (
    <div>
      <span className={`badge ${stateClass}`}>{state}</span>
    </div>
  );
}

export default OnboardingStatus;
