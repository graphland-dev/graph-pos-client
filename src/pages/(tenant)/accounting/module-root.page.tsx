import ModuleMenu from "@/_app/common/components/Modulemenu";
import { useParams } from "react-router-dom";

const AccountingRoot = () => {
  const params = useParams<{ tenant: string }>();
  return (
    <div className="mt-10">
      <ModuleMenu
        moduleName={"Accounting Management"}
        items={[
          {
            name: "Accounts",
            iconPath: "/menu-icons/budget.png",
            linkPath: `/${params.tenant}/accounting/cashbook/accounts`,
          },
          {
            name: "Statements",
            iconPath: "/menu-icons/bank-statement.png",
            linkPath: `/${params.tenant}/accounting/cashbook/statements`,
          },
          {
            name: "Payrolls",
            iconPath: "/menu-icons/payroll.png",
            linkPath: `/${params.tenant}/accounting/cashbook/payroll`,
          },
          {
            name: "Expenses",
            iconPath: "/menu-icons/budget.png",
            linkPath: `/${params.tenant}/accounting/expense/expense-list`,
          },
        ]}
      />
    </div>
  );
};

export default AccountingRoot;
