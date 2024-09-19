import ModuleMenu from '@/commons/components/Modulemenu.tsx';
import CommonHeader from '@/commons/components/layouts/componants/CommonHeader';
import { useParams } from 'react-router-dom';

const ModulesPage = () => {
  const params = useParams<{ tenant: string }>();
  return (
    <>
      <CommonHeader />
      <div className="m-10">
        <ModuleMenu
          moduleName={'Graph POS Apps'}
          items={[
            {
              name: 'Accounting',
              iconPath: '/menu-icons/budget.png',
              linkPath: `/${params.tenant}/accounting`,
            },
            {
              name: 'Inventory',
              iconPath: '/menu-icons/warehouse.png',
              linkPath: `/${params.tenant}/inventory-management`,
            },
            {
              name: 'Pos',
              iconPath: '/menu-icons/pos-terminal.png',
              linkPath: `/${params.tenant}/inventory-management/pos`,
            },
            {
              name: 'People',
              iconPath: '/menu-icons/supplier.png',
              linkPath: `/${params.tenant}/people`,
            },
            {
              name: 'Reports',
              iconPath: '/menu-icons/report.png',
              linkPath: `/${params.tenant}/reports`,
            },
          ]}
        />
      </div>
    </>
  );
};

export default ModulesPage;
