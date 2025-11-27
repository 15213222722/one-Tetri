# Design Document

## Overview

This design addresses the username registration flow timing issue where the system prematurely shows success messages before completing username verification. The solution introduces a proper state machine for authentication flow with clear transitions between wallet connection, username verification, and menu access.

## Architecture

The authentication flow will be managed through a dedicated state machine with the following states:

1. **disconnected**: No wallet connected
2. **connecting**: Wallet connection in progress
3. **verifying**: Checking for existing username
4. **registering**: Username registration modal displayed
5. **authenticated**: Complete authentication, ready for menu

The state transitions will be:
- `disconnected` → `connecting` (user clicks wallet)
- `connecting` → `verifying` (wallet connected successfully)
- `verifying` → `registering` (no username found)
- `verifying` → `authenticated` (username found)
- `registering` → `authenticated` (username registered)

## Components and Interfaces

### Modified Components

#### App.jsx
- Add `authState` state variable to track authentication flow
- Add `authMessage` state variable for user-facing messages
- Modify wallet connection effect to properly sequence states
- Update loading overlay to show during connecting and verifying states
- Show success toast only when reaching authenticated state

#### useBlockchain.js Hook
- No changes needed - already provides `isLoadingUsername` state
- The hook correctly checks localStorage first, then blockchain

### State Management

```javascript
// Authentication states
const AUTH_STATES = {
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  VERIFYING: 'verifying',
  REGISTERING: 'registering',
  AUTHENTICATED: 'authenticated'
};

// State in App.jsx
const [authState, setAuthState] = useState(AUTH_STATES.DISCONNECTED);
const [authMessage, setAuthMessage] = useState('');
```

## Data Models

### Authentication State Machine

```
State: disconnected
├─ Trigger: wallet connection initiated
├─ Action: setAuthState('connecting'), setAuthMessage('Connecting wallet...')
└─ Next: connecting

State: connecting
├─ Trigger: blockchain.account becomes truthy
├─ Action: setAuthState('verifying'), setAuthMessage('Checking username registration...')
└─ Next: verifying

State: verifying
├─ Trigger: blockchain.isLoadingUsername becomes false
├─ Condition: blockchain.username exists
│  ├─ Action: setAuthState('authenticated'), showToast('success', 'Authentication successful!')
│  └─ Next: authenticated
└─ Condition: blockchain.username is null
   ├─ Action: setAuthState('registering'), setAuthMessage('')
   └─ Next: registering

State: registering
├─ Trigger: username registration completes
├─ Action: setAuthState('authenticated'), showToast('success', 'Username registered! Authentication successful!')
└─ Next: authenticated

State: authenticated
├─ Action: setCurrentScreen('menu')
└─ Terminal state (until disconnect)
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Loading indicator visibility during async operations
*For any* authentication flow, when the system is in `connecting` or `verifying` states, the loading overlay should be visible with an appropriate message.
**Validates: Requirements 1.1, 1.2, 1.3, 4.1, 4.2**

### Property 2: Success message timing
*For any* authentication flow, success messages should only appear when `authState` transitions to `authenticated`, never during `connecting`, `verifying`, or `registering` states.
**Validates: Requirements 2.3, 3.1, 3.2, 3.3**

### Property 3: Username modal display condition
*For any* authentication flow, the username registration modal should be displayed if and only if `authState` is `registering`.
**Validates: Requirements 2.2, 4.3**

### Property 4: State transition ordering
*For any* authentication flow, states must transition in the correct order: `disconnected` → `connecting` → `verifying` → (`registering` | `authenticated`), with no state skipped or repeated out of order.
**Validates: Requirements 2.1, 2.4**

### Property 5: Menu access restriction
*For any* authentication flow, the menu screen should only be accessible when `authState` is `authenticated`.
**Validates: Requirements 3.4**

## Error Handling

### Wallet Connection Failures
- If wallet connection fails during `connecting` state:
  - Transition back to `disconnected`
  - Show error toast with failure reason
  - Clear loading overlay

### Username Verification Failures
- If username verification fails during `verifying` state:
  - Assume no username exists (fail-safe to registration)
  - Transition to `registering` state
  - Log error for debugging

### Username Registration Failures
- If username registration fails during `registering` state:
  - Remain in `registering` state
  - Show error toast with failure reason
  - Allow user to retry with different username

## Testing Strategy

### Unit Tests

1. **State Transition Tests**
   - Test each state transition occurs correctly
   - Test invalid transitions are prevented
   - Test state persistence across re-renders

2. **Message Display Tests**
   - Test correct messages shown for each state
   - Test loading overlay visibility conditions
   - Test success toast timing

3. **Component Integration Tests**
   - Test wallet connection triggers state changes
   - Test username verification triggers state changes
   - Test username registration completion triggers state changes

### Property-Based Tests

Property-based testing will use **fast-check** library for JavaScript/React testing. Each test will run a minimum of 100 iterations.

1. **Property 1: Loading Overlay Visibility**
   - Generate random sequences of authentication states
   - Verify loading overlay is visible during `connecting` and `verifying`
   - Verify loading overlay is hidden during other states

2. **Property 2: Success Message Timing**
   - Generate random authentication flow sequences
   - Verify success messages only appear after reaching `authenticated` state
   - Verify no success messages during intermediate states

3. **Property 3: Username Modal Display**
   - Generate random authentication states
   - Verify modal is shown if and only if state is `registering`

4. **Property 4: State Transition Ordering**
   - Generate random sequences of state transitions
   - Verify only valid transitions are allowed
   - Verify no states are skipped

### Edge Cases

- Wallet disconnects during verification
- Multiple rapid wallet connection attempts
- Username registration cancelled/failed
- Blockchain query timeout during verification
- localStorage unavailable or corrupted

## Implementation Notes

### Key Changes to App.jsx

1. Replace `currentScreen === 'landing'` checks with `authState` checks
2. Add useEffect to manage state transitions based on blockchain hook values
3. Update loading overlay condition to check `authState` instead of individual flags
4. Move success toast to only show when entering `authenticated` state
5. Update username modal visibility to check `authState === 'registering'`

### Backward Compatibility

- Existing localStorage username storage remains unchanged
- No changes to blockchain interaction logic
- No changes to username registration modal component
- Maintains same user experience, just fixes timing

### Performance Considerations

- State machine adds minimal overhead (simple string comparisons)
- No additional API calls or blockchain queries
- Loading states properly prevent user interaction during async operations

## Future Enhancements

- Add timeout handling for stuck verification states
- Add retry mechanism for failed blockchain queries
- Add analytics tracking for authentication flow completion rates
- Add visual progress indicator showing current step in flow
