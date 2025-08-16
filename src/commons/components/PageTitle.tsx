import { Helmet } from "react-helmet";

interface IPageTitleProps {
  title: string;
}

const PageTitle: React.FC<IPageTitleProps> = ({ title }) => {
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>{title}</title>
    </Helmet>
  );
};

export default PageTitle;
