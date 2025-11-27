# Implementation Plan

- [x] 1. Add authentication state machine to App.jsx


  - Create AUTH_STATES constant with all state values (disconnected, connecting, verifying, registering, authenticated)
  - Add authState and authMessage state variables
  - Initialize authState to 'disconnected'
  - _Requirements: 1.1, 2.1, 2.4_

- [x] 2. Implement state transition logic for wallet connection


  - Add useEffect to detect when blockchain.account changes from null to truthy
  - Transition from disconnected to connecting when wallet connection starts
  - Set authMessage to "Connecting wallet..."
  - Transition from connecting to verifying when blockchain.account exists
  - Set authMessage to "Checking username registration..."
  - _Requirements: 1.2, 1.3, 2.1_

- [x] 3. Implement state transition logic for username verification


  - Add useEffect to monitor blockchain.isLoadingUsername and blockchain.username
  - When isLoadingUsername becomes false and username exists, transition to authenticated
  - When isLoadingUsername becomes false and username is null, transition to registering
  - Clear authMessage when transitioning to registering
  - _Requirements: 2.2, 2.4_

- [x] 4. Implement state transition logic for username registration completion


  - Update handleUsernameRegistered function to transition authState to authenticated
  - Show success toast: "Username registered! Authentication successful!"
  - _Requirements: 3.1, 3.4_

- [x] 5. Update loading overlay visibility logic


  - Change loading overlay condition from checking individual flags to checking authState
  - Show loading overlay when authState is 'connecting' or 'verifying'
  - Display authMessage in the loading overlay
  - _Requirements: 1.1, 1.2, 1.3, 4.1, 4.2_

- [x] 6. Update username modal visibility logic


  - Change username screen condition from currentScreen === 'username' to authState === 'registering'
  - Ensure modal is hidden when authState is not 'registering'
  - _Requirements: 2.2, 4.3_

- [x] 7. Add success message on authentication completion


  - Add useEffect to detect when authState transitions to 'authenticated'
  - Show success toast: "Authentication successful!" when authenticated with existing username
  - Transition currentScreen to 'menu' when authenticated
  - _Requirements: 3.2, 3.3, 3.4, 4.4_

- [x] 8. Handle wallet disconnection


  - Add useEffect to detect when blockchain.account becomes null
  - Reset authState to 'disconnected' when wallet disconnects
  - Reset currentScreen to 'landing' when wallet disconnects
  - Clear authMessage
  - _Requirements: 2.4_

- [x] 9. Remove old screen-based username flow



  - Remove 'username' from currentScreen state management
  - Remove the old useEffect that checked currentScreen === 'landing'
  - Clean up any references to the old flow
  - _Requirements: 2.3, 2.4_

- [ ]* 10. Write unit tests for state machine
  - Test each state transition occurs correctly
  - Test authMessage updates for each state
  - Test loading overlay visibility for each state
  - Test success toast only appears in authenticated state
  - Test username modal only appears in registering state
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.4_

- [ ]* 10.1 Write property test for loading overlay visibility
  - **Property 1: Loading indicator visibility during async operations**
  - **Validates: Requirements 1.1, 1.2, 1.3, 4.1, 4.2**

- [ ]* 10.2 Write property test for success message timing
  - **Property 2: Success message timing**
  - **Validates: Requirements 2.3, 3.1, 3.2, 3.3**

- [ ]* 10.3 Write property test for username modal display
  - **Property 3: Username modal display condition**
  - **Validates: Requirements 2.2, 4.3**

- [ ]* 10.4 Write property test for state transition ordering
  - **Property 4: State transition ordering**
  - **Validates: Requirements 2.1, 2.4**

- [ ]* 10.5 Write property test for menu access restriction
  - **Property 5: Menu access restriction**
  - **Validates: Requirements 3.4**

- [ ] 11. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
