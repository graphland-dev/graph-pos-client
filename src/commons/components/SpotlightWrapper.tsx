import { Spotlight } from '@mantine/spotlight';

import { Outlet, useParams } from 'react-router-dom';
import { getSpotlightItems } from '../configs/spotlight-items';

const SpotlightWrapper = () => {
  const params = useParams<{ tenant: string }>();

  return (
    <>
      <Spotlight
        shortcut={['mod + P', 'mod + K']}
        actions={getSpotlightItems(params.tenant || '')}
      ></Spotlight>
      <Outlet />
    </>
  );
};

export default SpotlightWrapper;
