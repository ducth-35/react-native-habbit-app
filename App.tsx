import React, {useEffect} from 'react';
import {Navigations} from './src/navigators';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {useHabitStore} from './src/store/useHabitStore';
import {usePremiumStore} from './src/store/usePremiumStore';

const _queryClient = new QueryClient();

const AppContent: React.FC = () => {
  const {actions} = useHabitStore();
  const premiumActions = usePremiumStore(state => state.actions);

  useEffect(() => {
    // Initialize habit data on app start
    actions.loadData();

    // Initialize premium store data
    premiumActions.loadCoinsData();
  }, [actions, premiumActions]);

  return <Navigations />;
};

function App(): React.JSX.Element {
  return (
    <QueryClientProvider client={_queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
