import { SpotlightProvider } from '@mantine/spotlight';
import { Outlet, useParams } from 'react-router-dom';
import { getSpotlightItems } from '../configs/spotlight-items';

const SpotlightWrapper = () => {
  const params = useParams<{ tenant: string }>();

  return (
    <SpotlightProvider
      shortcut={['mod + P', 'mod + K']}
      actions={getSpotlightItems(params.tenant || '')}
    >
      <Outlet />
    </SpotlightProvider>
  );
};

export default SpotlightWrapper;
