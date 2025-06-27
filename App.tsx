import React, {useEffect} from 'react';
import {Navigations} from './src/navigators';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {useHabitStore} from './src/store/useHabitStore';

const _queryClient = new QueryClient();

const AppContent: React.FC = () => {
  const {actions} = useHabitStore();

  useEffect(() => {
    // Initialize habit data on app start
    actions.loadData();
  }, [actions]);

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
